// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// The framework puts its data for the browser in a dozen or more small inline scripts at the end of each built page.
// This module finds them, combines them into one script, and can move that script into a file
// (specs/041-combine-page-scripts). Every step is proved by running the original scripts and the new script in a
// sandbox and comparing the data they leave behind, so the build fails rather than ship a page with different data.

import { createHash } from "node:crypto";
import vm from "node:vm";
import { format } from "prettier";

// A run of inline scripts with no attributes that ends right before the closing body tag, with only whitespace
// between them. Scripts with an address (src) are not part of it.
const TRAILING_RUN = /((?:\s*<script>(?:(?!<\/script>)[\s\S])*?<\/script>)+)(\s*<\/body>)/;

export interface SplitScripts {
    before: string; // everything up to the first script of the run
    bodies: string[]; // the scripts' contents, in order
    after: string; // from the closing body tag on
}

/** Splits a page around its trailing run of inline data scripts, or returns null when it has none. */
export function splitDataScripts(html: string): SplitScripts | null {
    const match = TRAILING_RUN.exec(html);
    if (!match) return null;
    const bodies = [...match[1].matchAll(/<script>([\s\S]*?)<\/script>/g)].map((script) => script[1]);
    return {
        before: html.slice(0, match.index),
        bodies,
        after: html.slice(match.index + match[1].length).replace(/^\s+/, ""),
    };
}

/**
 * Runs the scripts, in order, in a fresh sandbox where `self` is an empty object, and returns what ended up in the
 * framework's data queue (`self.__next_f`), as plain data.
 */
export function dataQueue(bodies: string[]): unknown {
    const context = vm.createContext({ self: {} });
    for (const body of bodies) vm.runInContext(body, context, { timeout: 2000 });
    return JSON.parse(JSON.stringify((context.self as { __next_f?: unknown }).__next_f ?? null));
}

function firstDifference(expected: unknown, actual: unknown): string {
    if (Array.isArray(expected) && Array.isArray(actual)) {
        const length = Math.max(expected.length, actual.length);
        for (let index = 0; index < length; index++) {
            if (JSON.stringify(expected[index]) !== JSON.stringify(actual[index])) return `at queue entry ${index}`;
        }
    }
    return "in the data queue";
}

/** Throws, naming the page, unless the new script leaves exactly the data the original scripts left. */
export function assertSameData(originalBodies: string[], newBody: string, page: string): void {
    const expected = dataQueue(originalBodies);
    const actual = dataQueue([newBody]);
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        throw new Error(
            `${page}: the data in the new script differs from the original ${firstDifference(expected, actual)}`,
        );
    }
}

/** Joins script bodies into one, ending each statement explicitly so no piece can run into the next. */
export function combineBodies(bodies: string[]): string {
    return bodies.map((body) => `${body.trim().replace(/;+$/, "")};`).join("\n");
}

export interface Combined {
    html: string;
    bodies: string[]; // the original scripts, for the data check at later steps
    note?: string; // set when the page was left alone
}

/** Replaces a page's trailing run of inline data scripts with one script, after proving the data is the same. */
export function combineDataScripts(html: string, page: string): Combined {
    const split = splitDataScripts(html);
    if (!split) {
        return { html, bodies: [], note: `${page}: no trailing data scripts; left unchanged` };
    }
    const combined = combineBodies(split.bodies);
    assertSameData(split.bodies, combined, page);
    return {
        // No whitespace outside the script: a newline between elements would be text React does not expect.
        html: `${split.before}<script>\n${combined}\n</script>${split.after}`,
        bodies: split.bodies,
    };
}

export interface DataFile {
    path: string; // relative to the built site folder (`out/`)
    content: string;
}

export interface Externalized {
    html: string;
    file: DataFile;
}

const DATA_FOLDER = "_next/static/data";

/**
 * Moves a page's combined data script into a file named by the hash of its content, points one plain script element
 * (no async or defer, so it runs in order before the page needs it) at the file, and puts a preload hint for it first
 * in the head. The file is formatted. The data check runs against the original scripts first.
 */
export async function externalizeDataScript(
    html: string,
    originalBodies: string[],
    page: string,
): Promise<Externalized> {
    const split = splitDataScripts(html);
    if (!split) throw new Error(`${page}: no data script to move`);
    if (!html.includes("<head>")) throw new Error(`${page}: no head to put the preload hint in`);

    const content = await format(combineBodies(split.bodies), {
        parser: "babel",
        tabWidth: 4,
        useTabs: false,
        printWidth: 120,
    });
    assertSameData(originalBodies, content, page);

    const name = createHash("sha256").update(content).digest("hex").slice(0, 16);
    const address = `/${DATA_FOLDER}/${name}.js`;
    const moved = `${split.before}<script src="${address}"></script>${split.after}`.replace(
        "<head>",
        `<head><link rel="preload" as="script" href="${address}"/>`,
    );
    return { html: moved, file: { path: `${DATA_FOLDER}/${name}.js`, content } };
}
