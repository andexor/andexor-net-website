// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BANNED_CODE_POINTS, findBannedQuotes, isCheckedPath } from "../../scripts/quote-rules";
import { fileGroup } from "../../scripts/site-files";

// Spec 040: no curly, smart, or typographic quote appears in any file, as a character or as an HTML reference. Only
// the straight apostrophe and double quote are used. This file builds every banned character from a numeric code
// point, and every reference from parts, so that it contains none of them and passes its own check.
const ROOT = path.resolve(__dirname, "../..");
const character = (code: number) => String.fromCodePoint(code);
const reference = (name: string) => `&${name};`;

describe("findBannedQuotes", () => {
    it("finds each of the eight characters, with its line", () => {
        for (const code of BANNED_CODE_POINTS) {
            const found = findBannedQuotes(`first line\nit${character(code)}s here`);
            expect(found[0]?.line, code.toString(16)).toBe(2);
        }
    });

    it("finds named and numeric references, in any letter case", () => {
        const named = ["l", "r"].flatMap((side) => ["s", "d"].map((kind) => `${side}${kind}quo`));
        for (const name of [...named, "sbquo", "bdquo"]) {
            expect(findBannedQuotes(`a ${reference(name)} b`), name).not.toEqual([]);
            expect(findBannedQuotes(`a ${reference(name.toUpperCase())} b`), name).not.toEqual([]);
        }
        for (const code of BANNED_CODE_POINTS) {
            expect(findBannedQuotes(`a &#${code}; b`), `decimal ${code}`).not.toEqual([]);
            expect(findBannedQuotes(`a &#x${code.toString(16)}; b`), `hex ${code}`).not.toEqual([]);
            expect(findBannedQuotes(`a &#X${code.toString(16).toUpperCase()}; b`), `HEX ${code}`).not.toEqual([]);
        }
    });

    it("allows the straight quotes and the escapes HTML needs", () => {
        const allowed = [`We'll say "hello"`, "&amp; &lt; &gt;", "&#x27; &#39; &quot;", "plain text", ""];
        for (const text of allowed) expect(findBannedQuotes(text), text).toEqual([]);
    });
});

describe("isCheckedPath", () => {
    it("checks source, content, documents, and specs", () => {
        for (const file of [
            "src/app/page.tsx",
            "content/about-us.md",
            "CLAUDE.md",
            "specs/040-straight-quotes-only/spec.md",
        ]) {
            expect(isCheckedPath(file), file).toBe(true);
        }
    });

    it("skips the third-party Code of Conduct files, vendor and build folders, and binary files", () => {
        for (const file of [
            "CODE_OF_CONDUCT.md",
            "CODE_OF_CONDUCT.adoc",
            "node_modules/react/index.js",
            "out/index.html",
            ".next/cache/x.js",
            "public/logo/logo.png",
        ]) {
            expect(isCheckedPath(file), file).toBe(false);
        }
    });
});

describe("repository files", () => {
    const walk = (directory: string, found: string[] = []): string[] => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const full = path.join(directory, entry.name);
            const relative = path.relative(ROOT, full).split(path.sep).join("/");
            if (entry.isDirectory()) {
                if (isCheckedPath(`${relative}/placeholder.txt`)) walk(full, found);
            } else if (isCheckedPath(relative)) {
                found.push(relative);
            }
        }
        return found;
    };

    it("contain no curly quote or reference to one", () => {
        const problems = walk(ROOT).flatMap((file) => {
            let text: string;
            try {
                text = fs.readFileSync(path.join(ROOT, file), "utf8");
            } catch {
                return [];
            }
            return findBannedQuotes(text).map(({ line, found }) => `${file}:${line}: ${found}`);
        });
        expect(problems).toEqual([]);
    });
});

// The built site, when it has been built: every page, the site's own script chunk, and its stylesheet.
describe.skipIf(!fs.existsSync(path.join(ROOT, "out")))("built site", () => {
    const walkOut = (directory: string, found: string[] = []): string[] => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const full = path.join(directory, entry.name);
            if (entry.isDirectory()) walkOut(full, found);
            else found.push(path.relative(ROOT, full).split(path.sep).join("/"));
        }
        return found;
    };
    const siteFiles = () =>
        walkOut(path.join(ROOT, "out")).filter((file) =>
            ["built-html", "built-site-css", "built-site-js", "built-data-js"].includes(fileGroup(file)),
        );

    it("has no curly quote or reference to one in a page, the site script, or the stylesheet", () => {
        const problems = siteFiles().flatMap((file) =>
            findBannedQuotes(fs.readFileSync(path.join(ROOT, file), "utf8")).map(
                ({ line, found }) => `${file}:${line}: ${found}`,
            ),
        );
        expect(problems).toEqual([]);
    });

    it("writes apostrophes in page text as the plain character, not as an escape", () => {
        const escapes = ["&#x27;", "&#39;"];
        const problems = siteFiles()
            .filter((file) => fileGroup(file) === "built-html")
            .flatMap((file) =>
                fs
                    .readFileSync(path.join(ROOT, file), "utf8")
                    .split("\n")
                    .flatMap((line, index) =>
                        escapes.some((escape) => line.includes(escape))
                            ? [`${file}:${index + 1}: escaped apostrophe`]
                            : [],
                    ),
            );
        expect(problems).toEqual([]);
    });
});
