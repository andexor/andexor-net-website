// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { expect, test } from "./fixtures";

// Specs 078 and 081: Cookiebot's Cookie Declaration script is on /privacy-policy only, at the marker in
// content/privacy-policy.md, and the page does not scroll sideways on a phone. The raw HTML is checked, because the
// browser's own parsing would hide the order.
// The declaration's text is not checked: it comes from Cookiebot. Playwright's loader here fails on TypeScript type
// annotations, so callbacks rely on contextual typing.
const contentDir = path.join(process.cwd(), "content");
const otherRoutes = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md" && f !== "privacy-policy.md")
    .map((f) => "/" + f.replace(/\.md$/, ""));

test.describe("Cookie Declaration", () => {
    test("/privacy-policy: has the script element", async ({ request }) => {
        const html = await (await request.get("/privacy-policy")).text();
        const match = /<script\s+([^>]*\bid="CookieDeclaration"[^>]*)><\/script>/.exec(html);
        expect(match).not.toBeNull();
        const attributes = match ? match[1] : "";
        expect(attributes).toContain('src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js"');
        expect(attributes).toContain('type="text/javascript"');
        expect(attributes).toMatch(/\basync\b/);
        expect(html.indexOf('id="CookieDeclaration"')).toBe(html.lastIndexOf('id="CookieDeclaration"'));
    });

    for (const route of ["/", ...otherRoutes]) {
        test(`${route}: has no Cookie Declaration, not even in the footer`, async ({ request }) => {
            const html = await (await request.get(route)).text();
            expect(html).not.toContain("CookieDeclaration");
        });
    }

    test("/privacy-policy: does not scroll sideways on a phone, and the footer still works", async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 800 });
        await page.goto("/privacy-policy");
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
        const footer = page.getByRole("contentinfo");
        await expect(footer.getByRole("link", { name: "Privacy Policy", exact: true })).toBeVisible();
        await expect(footer.locator(".an-footer__social-link").first()).toBeVisible();
    });
});
