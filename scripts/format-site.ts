// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Post-build pass: makes the built site readable (specs/038-readable-generated-code).
// Run after `next build` by `bun run build`. Formats the HTML pages, the site stylesheet, and the
// site's own script chunk. Third-party chunks are left minified.

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { format } from "prettier";
import { combineDataScripts, externalizeDataScript } from "./combine-scripts";
import { formatHtml } from "./format-html";
import { fileGroup } from "./site-files";

const ROOT = join(import.meta.dir, "..");
const OUT = join(ROOT, "out");

const PRETTIER_OPTIONS = { tabWidth: 4, useTabs: false, printWidth: 120 } as const;

async function* walk(directory: string): AsyncGenerator<string> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) yield* walk(path);
        else yield path;
    }
}

// The data files moved out of the pages, by path (relative to `out/`) and content.
const dataFiles = new Map<string, string>();

// One built page: combine the framework's data scripts into one and move it to a file (spec 041), then format the page.
async function formatPage(original: string, name: string): Promise<string> {
    const combined = combineDataScripts(original, name);
    if (combined.note) {
        console.log(combined.note);
        return formatHtml(combined.html, name);
    }
    const moved = await externalizeDataScript(combined.html, combined.bodies, name);
    const existing = dataFiles.get(moved.file.path);
    if (existing !== undefined && existing !== moved.file.content) {
        throw new Error(`${name}: two different data scripts have the same file name (${moved.file.path})`);
    }
    dataFiles.set(moved.file.path, moved.file.content);
    return formatHtml(moved.html, name);
}

async function main(): Promise<void> {
    const changed: Record<string, number> = {};
    for await (const path of walk(OUT)) {
        const name = relative(ROOT, path).split("\\").join("/");
        const group = fileGroup(name);
        if (group !== "built-html" && group !== "built-site-css" && group !== "built-site-js") continue;

        const original = await readFile(path, "utf8");
        const formatted =
            group === "built-html"
                ? await formatPage(original, name)
                : // The ignore files are not read by the API, so `out/` (which .gitignore lists) is formatted.
                  await format(original, { ...PRETTIER_OPTIONS, parser: group === "built-site-css" ? "css" : "babel" });

        // A silent no-op would leave minified output behind, so a file that did not change is an error.
        if (formatted === original) throw new Error(`${name}: formatting changed nothing`);
        await writeFile(path, formatted);
        changed[group] = (changed[group] ?? 0) + 1;
    }
    for (const [path, content] of dataFiles) {
        await mkdir(join(OUT, path, ".."), { recursive: true });
        await writeFile(join(OUT, path), content);
    }
    for (const group of ["built-html", "built-site-css", "built-site-js"]) {
        if (!changed[group]) throw new Error(`No ${group} files were found in out/; did next build run?`);
    }
    console.log(
        `Formatted built site: ${Object.entries(changed)
            .map(([g, n]) => `${n} ${g}`)
            .join(", ")}`,
    );
}

await main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
