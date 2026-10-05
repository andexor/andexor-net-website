// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import {
    assertSameData,
    combineBodies,
    combineDataScripts,
    dataQueue,
    externalizeDataScript,
    splitDataScripts,
} from "../../scripts/combine-scripts";

// Spec 041: the framework's data scripts at the end of a built page are found, combined, and moved to a file without
// changing the data they leave behind. These pages are shaped like the built output.
const START = "(self.__next_f = self.__next_f || []).push([0])";
const piece = (text: string) => `self.__next_f.push([1,${JSON.stringify(text)}])`;
const PIECES = [piece("one"), piece("two"), piece("three")];

const page = (scripts: string[], extra = "") =>
    `<!DOCTYPE html><html><head><script>var head = 1;</script><script src="/a.js" async=""></script></head>` +
    `<body><p>Hi</p><script src="/webpack.js" async=""></script>${extra}` +
    scripts.map((body) => `<script>${body}</script>`).join("\n") +
    `\n</body></html>`;

describe("splitDataScripts", () => {
    it("finds the trailing run of inline scripts, in order, with what comes before and after", () => {
        const split = splitDataScripts(page([START, ...PIECES]))!;
        expect(split.bodies).toEqual([START, ...PIECES]);
        expect(split.before).toContain('<script src="/webpack.js" async=""></script>');
        expect(split.before).not.toContain(PIECES[0]);
        expect(split.after.trimStart()).toMatch(/^<\/body>/);
    });

    it("leaves the head's inline scripts and every script with an address out of the run", () => {
        const split = splitDataScripts(page([START, ...PIECES]))!;
        expect(split.bodies.join("")).not.toContain("var head");
        expect(split.before).toContain("var head = 1;");
        expect(split.before).toContain('src="/a.js"');
    });

    it("returns nothing when the body does not end in inline scripts", () => {
        expect(splitDataScripts(`<html><head></head><body><p>No scripts</p></body></html>`)).toBeNull();
        expect(splitDataScripts(page([]))).toBeNull();
    });

    it("stops the run at anything that is not whitespace", () => {
        const split = splitDataScripts(
            page([START, PIECES[0]], "<p>in the way</p>" + `<script>${PIECES[1]}</script>`),
        )!;
        expect(split.bodies.join("\n")).toContain(PIECES[1]);
        expect(split.bodies.join("\n")).not.toContain("in the way");
        expect(split.before).toContain("in the way");
    });
});

describe("dataQueue", () => {
    it("is the same for the same scripts, one at a time or all in one", () => {
        expect(dataQueue([START, ...PIECES])).toEqual(dataQueue([[START, ...PIECES].join(";\n")]));
    });

    it("differs when a piece is dropped, reordered, or altered", () => {
        const whole = dataQueue([START, ...PIECES]);
        expect(dataQueue([START, PIECES[0], PIECES[2]])).not.toEqual(whole);
        expect(dataQueue([START, PIECES[1], PIECES[0], PIECES[2]])).not.toEqual(whole);
        expect(dataQueue([START, PIECES[0], piece("2"), PIECES[2]])).not.toEqual(whole);
    });

    it("runs each call in a fresh sandbox", () => {
        dataQueue([START, PIECES[0]]);
        expect(dataQueue([START])).toEqual([[0]]);
    });
});

describe("assertSameData", () => {
    it("passes for equal data", () => {
        expect(() => assertSameData([START, ...PIECES], [START, ...PIECES].join(";\n"), "ok.html")).not.toThrow();
    });

    it("throws, naming the page, when the data differs", () => {
        const dropped = [START, PIECES[0], PIECES[2]].join(";\n");
        expect(() => assertSameData([START, ...PIECES], dropped, "broken.html")).toThrow(/broken\.html/);
    });
});

describe("combineDataScripts", () => {
    const original = [START, ...PIECES];

    it("replaces the trailing run with one inline script holding every piece, in order", () => {
        const { html } = combineDataScripts(page(original), "combined.html");
        const split = splitDataScripts(html)!;
        expect(split.bodies).toEqual([expect.any(String)]);
        const positions = original.map((body) => split.bodies[0].indexOf(body));
        expect(positions.every((position) => position >= 0)).toBe(true);
        expect(positions).toEqual([...positions].sort((a, b) => a - b));
    });

    it("leaves the same data behind as the original scripts", () => {
        const { html, bodies } = combineDataScripts(page(original), "combined.html");
        expect(bodies).toEqual(original);
        expect(dataQueue(splitDataScripts(html)!.bodies)).toEqual(dataQueue(original));
    });

    it("leaves the head's scripts and every script with an address unchanged", () => {
        const { html } = combineDataScripts(page(original), "combined.html");
        expect(html).toContain("<script>var head = 1;</script>");
        expect(html).toContain('<script src="/a.js" async=""></script>');
        expect(html).toContain('<script src="/webpack.js" async=""></script>');
    });

    it("returns a page with no data scripts unchanged, with a note naming the page", () => {
        const plain = "<html><head></head><body><p>No scripts</p></body></html>";
        const result = combineDataScripts(plain, "plain.html");
        expect(result.html).toBe(plain);
        expect(result.note).toMatch(/plain\.html/);
    });

    it("joins pieces safely whatever they end or start with", () => {
        const bodies = [START, "(function () { self.__next_f.push([1, 'x']); })()", "self.__next_f.push([1, 'y']);"];
        expect(dataQueue([combineBodies(bodies)])).toEqual(dataQueue(bodies));
    });
});

describe("externalizeDataScript", () => {
    // What Prettier makes of each original script when it formats them together as a file.
    const PIECES_FORMATTED = [
        "(self.__next_f = self.__next_f || []).push([0]);",
        'self.__next_f.push([1, "one"]);',
        'self.__next_f.push([1, "two"]);',
        'self.__next_f.push([1, "three"]);',
    ];
    const original = [START, ...PIECES];
    const combinedPage = () => combineDataScripts(page(original), "moved.html").html;

    it("moves the data to a file named by the hash of its content and points one plain script element at it", async () => {
        const { html, file } = await externalizeDataScript(combinedPage(), original, "moved.html");
        const name = file.path.match(/^_next\/static\/data\/([0-9a-f]{16})\.js$/)?.[1];
        expect(name, file.path).toBeDefined();
        expect(html).toContain(`<script src="/_next/static/data/${name}.js"></script>`);
        expect(splitDataScripts(html)).toBeNull();
        expect(html).not.toContain(PIECES[0]);
        expect(html).not.toMatch(/src="\/_next\/static\/data\/[^"]+"[^>]*(async|defer)/);
    });

    it("keeps the script in the same place, last in the body", async () => {
        const { html } = await externalizeDataScript(combinedPage(), original, "moved.html");
        expect(html).toMatch(
            /<script src="\/webpack\.js" async=""><\/script><script src="\/_next\/static\/data\/[0-9a-f]{16}\.js"><\/script><\/body>/,
        );
    });

    it("puts a preload hint for the file first in the head", async () => {
        const { html, file } = await externalizeDataScript(combinedPage(), original, "moved.html");
        const address = `/${file.path}`;
        expect(html).toContain(`<head><link rel="preload" as="script" href="${address}"/>`);
    });

    it("writes a formatted file that leaves the same data behind as the original scripts", async () => {
        const { file } = await externalizeDataScript(combinedPage(), original, "moved.html");
        expect(file.content).not.toContain("\t");
        expect(file.content.trim().split("\n")).toEqual([...PIECES_FORMATTED]);
        expect(dataQueue([file.content])).toEqual(dataQueue(original));
    });

    it("gives identical data the same name and different data different names", async () => {
        const first = await externalizeDataScript(combinedPage(), original, "a.html");
        const second = await externalizeDataScript(combinedPage(), original, "b.html");
        expect(second.file.path).toBe(first.file.path);
        const otherData = [START, piece("other")];
        const other = await externalizeDataScript(
            combineDataScripts(page(otherData), "c.html").html,
            otherData,
            "c.html",
        );
        expect(other.file.path).not.toBe(first.file.path);
    });

    it("throws, naming the page, when the file would hold different data", async () => {
        await expect(externalizeDataScript(combinedPage(), [START, PIECES[0]], "wrong.html")).rejects.toThrow(
            /wrong\.html/,
        );
    });
});
