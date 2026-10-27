// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { expect, test } from "./fixtures";

// Specs 078, 081, and 082: Cookiebot's Cookie Declaration is on /privacy-policy only, at the marker in
// content/privacy-policy.md. The page HTML holds an empty slot, not the script element: the browser adds the script after
// hydration, because a script in the HTML can change the page before React hydrates it (error #418, a blank page in
// Cookiebot's automatic blocking mode). The raw HTML is checked, because the browser's own parsing would hide the order.
// The declaration's text is not checked: it comes from Cookiebot. Playwright's loader here fails on TypeScript type
// annotations, so callbacks rely on contextual typing.
const contentDir = path.join(process.cwd(), "content");
const otherRoutes = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md" && f !== "privacy-policy.md")
    .map((f) => "/" + f.replace(/\.md$/, ""));

test.describe("Cookie Declaration", () => {
    test("/privacy-policy: has the slot in the HTML and no script element", async ({ request }) => {
        const html = await (await request.get("/privacy-policy")).text();
        const match = /<div\s+([^>]*\bid="cookie-declaration-slot"[^>]*)>/.exec(html);
        expect(match).not.toBeNull();
        expect(match ? match[1] : "").toContain(
            'data-src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js"',
        );
        expect(html.match(/<div\s+[^>]*\bid="cookie-declaration-slot"/g)).toHaveLength(1);
        expect(html).not.toContain('id="CookieDeclaration"');
    });

    test("/privacy-policy: adds the script after the page loads, with no hydration error", async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto("/privacy-policy");
        await expect(page.locator("script#CookieDeclaration")).toHaveCount(1);
        await expect(page.locator("#cookie-declaration-slot script#CookieDeclaration")).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(errors.filter((message) => /hydrat|#418|#423|#425/i.test(message))).toEqual([]);
    });

    for (const route of ["/", ...otherRoutes]) {
        test(`${route}: has no Cookie Declaration, not even in the footer`, async ({ request }) => {
            const html = await (await request.get(route)).text();
            expect(html).not.toContain("cookie-declaration-slot");
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
