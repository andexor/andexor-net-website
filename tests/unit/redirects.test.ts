// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { listContentSlugs } from "@/lib/content";
import { MOVED_PAGES } from "./moved-pages";

// Spec 093 FR-006 to FR-008 (issue #118): public/_redirects, which Cloudflare Workers Static Assets reads in
// production, sends every moved page to its new address with a 301, the three moved resource folders likewise, and
// the two section addresses to the home page with a 302 until a landing page exists. Only the twelve moved pages
// need a rule: a page added later under a section never had a root address.
const ROOT = path.resolve(__dirname, "../..");
const RESOURCES = ["fonts", "images", "logo"];
const SECTIONS = ["/services", "/company"];

interface Rule {
    source: string;
    destination: string;
    status: string;
}

function readRules(): Rule[] {
    return fs
        .readFileSync(path.join(ROOT, "public", "_redirects"), "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "" && !line.startsWith("#"))
        .map((line) => {
            const [source, destination, status] = line.split(/\s+/);
            return { source, destination, status };
        });
}

describe("public/_redirects", () => {
    const rules = readRules();
    const published = new Set(listContentSlugs().map((slug) => "/" + slug.join("/")));
    const bySource = (source: string) => rules.filter((rule) => rule.source === source);

    it("sends each moved page to its new address with a 301", () => {
        for (const { old, now } of MOVED_PAGES) {
            expect(bySource(old), old).toEqual([{ source: old, destination: now, status: "301" }]);
        }
    });

    it("sends each moved resource folder to /static/ with a 301", () => {
        for (const folder of RESOURCES) {
            expect(bySource(`/${folder}/*`), folder).toEqual([
                { source: `/${folder}/*`, destination: `/static/${folder}/:splat`, status: "301" },
            ]);
            expect(fs.statSync(path.join(ROOT, "public", "static", folder)).isDirectory(), folder).toBe(true);
        }
    });

    it("sends the section addresses to the home page with a 302 until a landing page exists", () => {
        for (const section of SECTIONS) {
            expect(bySource(section), section).toEqual([{ source: section, destination: "/", status: "302" }]);
        }
    });

    it("points every rule at an address that exists and never at an old one", () => {
        const splats = new Set(RESOURCES.map((folder) => `/static/${folder}/:splat`));
        const old = new Set(MOVED_PAGES.map((page) => page.old));
        for (const { source, destination } of rules) {
            const label = `${source} -> ${destination}`;
            const exists = destination === "/" || splats.has(destination) || published.has(destination);
            expect(exists, label).toBe(true);
            expect(/^\/(fonts|images|logo)\//.test(destination), label).toBe(false);
            expect(old.has(destination), label).toBe(false);
        }
    });

    it("has no rule beyond the moved pages, the resource folders, and the two sections", () => {
        const known = new Set([
            ...MOVED_PAGES.map((page) => page.old),
            ...RESOURCES.map((folder) => `/${folder}/*`),
            ...SECTIONS,
        ]);
        expect(rules.map((rule) => rule.source).filter((source) => !known.has(source))).toEqual([]);
    });
});
