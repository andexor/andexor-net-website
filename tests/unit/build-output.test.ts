// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COOKIEBOT_PRECONNECT } from "../../scripts/format-html";
import { fileGroup, isMinified } from "../../scripts/site-files";
import organization from "../../src/lib/schema/organization.json";
import person from "../../src/lib/schema/ed.json";
import website from "../../src/lib/schema/website.json";
import webPage from "../../src/lib/schema/webpage.json";
import { MOVED_PAGES } from "./moved-pages";

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

    // Spec 086: the browser starts connecting to Cookiebot's banner address while it reads the head.
    it("puts the Cookiebot preconnect link before the Cookiebot script on every page", () => {
        for (const file of files.filter((name) => name.endsWith(".html"))) {
            const html = read(file);
            const link = html.indexOf(COOKIEBOT_PRECONNECT);
            expect(link, file).toBeGreaterThanOrEqual(0);
            expect(link, file).toBeLessThan(html.indexOf('<script id="Cookiebot"'));
        }
    });

    // Spec 090: the home page's head carries the Organization structured data right after the Cookiebot script.
    // Specs 090 and 091: the home page's head carries the Organization and Person structured data right after the
    // Cookiebot script, in that order.
    it("puts the Organization and Person structured data in the home page head, right after the Cookiebot script", () => {
        const html = read("out/index.html");
        const open = '<script type="application/ld+json">';
        expect(html.split(open).length - 1, "four blocks").toBe(4);
        const cookiebot = html.indexOf('<script id="Cookiebot"');
        const cookiebotEnd = html.indexOf("</script>", cookiebot) + "</script>".length;
        expect(html.slice(cookiebotEnd).startsWith(open), "block directly after Cookiebot").toBe(true);
        const [organizationBlock, personBlock, websiteBlock, webPageBlock] = html
            .split(open)
            .slice(1)
            .map((rest) => rest.slice(0, rest.indexOf("</script>")));
        expect(JSON.parse(organizationBlock)).toEqual(organization);
        expect(JSON.parse(personBlock)).toEqual(person);
        expect(JSON.parse(webPageBlock)).toEqual(webPage);
        expect(JSON.parse(websiteBlock)).toEqual(website);
    });

    // Spec 090: only the home page carries the structured data.
    it("puts no Organization structured data on any other built page", () => {
        for (const file of files.filter((name) => name.endsWith(".html") && name !== "out/index.html")) {
            expect(read(file), file).not.toContain('<script type="application/ld+json">');
        }
    });

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

    // Spec 041 (retired): Cookiebot's automatic blocking mode breaks a page whose data script is an external file, so
    // the framework's data stays in inline scripts.
    it("keeps each page's framework data in inline scripts, not an external file", () => {
        const pages = files.filter((file) => fileGroup(file) === "built-html");
        const problems = pages.filter((page) => /<script[^>]*src="[^"]*\/_next\/static\/data\//.test(read(page)));
        expect(problems).toEqual([]);
        expect(files.some((file) => file.startsWith("out/_next/static/data/"))).toBe(false);
    });

    it("leaves third-party chunks as the framework built them", () => {
        // Formatting 700 KB of vendor code would only add bytes; the post-build pass must not touch it.
        const framework = files.find((file) => /chunks\/framework-[^/]+\.js$/.test(file));
        expect(framework, "a framework chunk").toBeDefined();
        expect(isMinified(read(framework!)), `${framework} should stay minified`).toBe(true);
    });

    // Spec 093 FR-005: nothing the site emits names an old address. Pages moved to /services/ and /company/ and
    // resources to /static/ (issue #118); the old addresses only redirect, and only in production.
    it("refers to no old page or resource address", () => {
        const forbidden = [
            '"/fonts/',
            '"/images/',
            '"/logo/',
            'url("/fonts/',
            'url("/images/',
            'url("/logo/',
            "andexor.net/fonts/",
            "andexor.net/images/",
            "andexor.net/logo/",
            ...MOVED_PAGES.flatMap(({ old }) => [`href="${old}"`, `andexor.net${old}"`, `andexor.net${old}/`]),
        ];
        const checked = files.filter((file) => file.endsWith(".html") || fileGroup(file) === "built-site-css");
        expect(checked, "built pages and stylesheets").not.toEqual([]);
        for (const file of checked) {
            const text = read(file);
            for (const needle of forbidden) expect(text, `${file} contains ${needle}`).not.toContain(needle);
        }
    });
});
