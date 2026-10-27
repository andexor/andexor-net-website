// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Post-build pass: makes the built site readable (specs/038-readable-generated-code).
// Run after `next build` by `bun run build`. Formats the HTML pages, the site stylesheet, and the
// site's own script chunk. Third-party chunks are left minified.

import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { format } from "prettier";
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

// Next.js adds its own plain `noindex` robots tag to the not-found page. The page sets "noindex, nofollow" itself
// (spec 030), so the plain one is removed and the page keeps exactly one robots tag.
const FRAMEWORK_NOINDEX = /<meta name="robots" content="noindex"\s*\/?>/g;

function removeFrameworkNoindex(html: string, name: string): string {
    const found = html.match(FRAMEWORK_NOINDEX)?.length ?? 0;
    if (found !== 1) throw new Error(`${name}: expected 1 framework noindex tag, found ${found}`);
    return html.replace(FRAMEWORK_NOINDEX, "");
}

// One built page: format it. The framework's data scripts stay inline, where Next.js wrote them: Cookiebot's automatic
// blocking mode breaks a page whose data script is an external file (spec 041, retired).
async function formatPage(source: string, name: string): Promise<string> {
    const original = name === "out/404.html" ? removeFrameworkNoindex(source, name) : source;
    return formatHtml(original, name);
}

// Next.js writes a React Server Components payload beside each page (`about-us.txt` beside `about-us.html`) for
// client-side navigation with next/link and for prefetching. The site's links are ordinary anchors (spec 041), so
// nothing ever requests them, and they are removed after the pages are formatted. A .txt file with no page of the same
// name, such as robots.txt or .well-known/security.txt, is not a payload and stays.
async function removePagePayloads(pages: Set<string>, textFiles: string[]): Promise<number> {
    let removed = 0;
    for (const path of textFiles) {
        if (!pages.has(path.slice(0, -".txt".length))) continue;
        await unlink(path);
        removed += 1;
    }
    return removed;
}

async function main(): Promise<void> {
    const changed: Record<string, number> = {};
    const pages = new Set<string>();
    const textFiles: string[] = [];
    for await (const path of walk(OUT)) {
        if (path.endsWith(".html")) pages.add(path.slice(0, -".html".length));
        else if (path.endsWith(".txt")) textFiles.push(path);
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
    for (const group of ["built-html", "built-site-css", "built-site-js"]) {
        if (!changed[group]) throw new Error(`No ${group} files were found in out/; did next build run?`);
    }
    const removed = await removePagePayloads(pages, textFiles);
    console.log(
        `Formatted built site: ${Object.entries(changed)
            .map(([g, n]) => `${n} ${g}`)
            .join(", ")}; removed ${removed} page payload .txt files`,
    );
}

await main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
