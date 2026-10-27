// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findBannedQuotes, isCheckedPath } from "../../scripts/quote-rules";
import { fileGroup } from "../../scripts/site-files";

// Spec 040: no curly, smart, or typographic quote appears in any file, as a character or as an HTML reference. Only
// the straight apostrophe and double quote are used.
const ROOT = path.resolve(__dirname, "../..");

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
            ["built-html", "built-site-css", "built-site-js"].includes(fileGroup(file)),
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
