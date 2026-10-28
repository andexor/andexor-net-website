// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { expect, test } from "./fixtures";

// Spec 076: every built page has the Cookiebot script as the first script in <head>, with no async or defer, so its
// automatic blocking runs before any other script. Spec 086 puts a preconnect link in front of it, which is not a script. The raw HTML is checked, because the browser's own parsing would
// hide the order. Playwright's loader here fails on TypeScript type annotations, so callbacks rely on contextual typing.
const contentDir = path.join(process.cwd(), "content");
const contentRoutes = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => "/" + f.replace(/\.md$/, ""));

const pages = ["/", ...contentRoutes, "/nope"];

test.describe("Cookiebot script", () => {
    for (const route of pages) {
        test(`${route}: is the first script in head`, async ({ request }) => {
            const response = await request.get(route);
            const html = await response.text();
            const head = html
                .slice(html.indexOf("<head>") + "<head>".length)
                .replace(/^\s*<link rel="preconnect"[^>]*>/, "");
            const element = /^\s*<script ([^>]*)><\/script>/.exec(head);
            expect(element).not.toBeNull();
            const attributes = element ? element[1] : "";
            expect(attributes).toContain('id="Cookiebot"');
            expect(attributes).toContain('src="https://consent.cookiebot.com/uc.js"');
            expect(attributes).toContain('data-cbid="ba75dc6a-d85e-4740-891e-dd0cc31a62dd"');
            expect(attributes).toContain('data-blockingmode="auto"');
            expect(attributes).toContain('type="text/javascript"');
            expect(attributes).not.toMatch(/\b(async|defer)\b/);
        });
    }
});
