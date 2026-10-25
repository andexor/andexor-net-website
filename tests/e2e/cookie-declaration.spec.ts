// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { expect, test } from "./fixtures";

// Spec 077: every page with the footer has Cookiebot's Cookie Declaration script right after the copyright line and
// before the social icons, and the page does not scroll sideways because of it. The raw HTML is checked, because the
// browser's own parsing would hide the order. The declaration's text is not checked: it comes from Cookiebot.
// Playwright's loader here fails on TypeScript type annotations, so callbacks rely on contextual typing.
const contentDir = path.join(process.cwd(), "content");
const contentRoutes = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => "/" + f.replace(/\.md$/, ""));

const pages = ["/", ...contentRoutes];

test.describe("Cookie Declaration", () => {
    for (const route of pages) {
        test(`${route}: follows the copyright line, before the social icons`, async ({ request }) => {
            const html = await (await request.get(route)).text();
            const after = html.slice(html.indexOf('class="an-footer__copyright"'));
            const match =
                /^[^>]*>[^<]*<\/p>\s*<div data-raw-html="">\s*<script\s+([^>]*)><\/script>\s*<\/div>\s*<div class="an-footer__social-row">/.exec(
                    after,
                );
            expect(match).not.toBeNull();
            const attributes = match ? match[1] : "";
            expect(attributes).toContain('id="CookieDeclaration"');
            expect(attributes).toContain(
                'src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js"',
            );
            expect(attributes).toContain('type="text/javascript"');
            expect(attributes).toMatch(/\basync\b/);
        });

        test(`${route}: does not scroll sideways on a phone, and the footer still works`, async ({ page }) => {
            await page.setViewportSize({ width: 360, height: 800 });
            await page.goto(route);
            await page.waitForLoadState("networkidle");
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
            expect(overflow).toBeLessThanOrEqual(0);
            const footer = page.getByRole("contentinfo");
            await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();
            await expect(footer.locator(".an-footer__social-link").first()).toBeVisible();
        });
    }
});
