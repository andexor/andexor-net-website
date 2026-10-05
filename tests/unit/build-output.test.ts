// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fileGroup, isMinified } from "../../scripts/site-files";

// Spec 038 FR-002, FR-003, FR-005, FR-006: in the built site, the site's own CSS and script code are readable and
// separate from the third-party code. This reads `out/`, so it runs only after `bun run build`.
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "out");

// Strings that only the site's own code contains.
const SITE_MARKERS = ["an-hero", "ContactProvider"];

function builtFiles(): string[] {
    const found: string[] = [];
    const walk = (directory: string) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const full = path.join(directory, entry.name);
            if (entry.isDirectory()) walk(full);
            else found.push(path.relative(ROOT, full).split(path.sep).join("/"));
        }
    };
    walk(OUT);
    return found;
}

describe.skipIf(!fs.existsSync(OUT))("built site", () => {
    const files = fs.existsSync(OUT) ? builtFiles() : [];
    const read = (file: string) => fs.readFileSync(path.join(ROOT, file), "utf8");

    it("keeps the site's own script code in a readable file of its own", () => {
        const siteScripts = files.filter((file) => fileGroup(file) === "built-site-js");
        expect(siteScripts, "a site-*.js chunk").not.toEqual([]);
        for (const file of siteScripts) {
            const text = read(file);
            expect(isMinified(text), `${file} is minified`).toBe(false);
            expect(text, `${file} should hold site code`).toContain("ContactProvider");
        }
    });

    it("keeps the site's own CSS readable", () => {
        const stylesheets = files.filter((file) => fileGroup(file) === "built-site-css");
        expect(stylesheets, "a site stylesheet").not.toEqual([]);
        for (const file of stylesheets) expect(isMinified(read(file)), `${file} is minified`).toBe(false);
    });

    it("keeps site code out of every third-party chunk", () => {
        for (const file of files.filter((name) => fileGroup(name) === "built-third-party-js")) {
            const text = read(file);
            for (const marker of SITE_MARKERS)
                expect(text, `${file} contains site code (${marker})`).not.toContain(marker);
        }
    });

    it("leaves third-party chunks as the framework built them", () => {
        // Formatting 700 KB of vendor code would only add bytes; the post-build pass must not touch it.
        const framework = files.find((file) => /chunks\/framework-[^/]+\.js$/.test(file));
        expect(framework, "a framework chunk").toBeDefined();
        expect(isMinified(read(framework!)), `${framework} should stay minified`).toBe(true);
    });
});
