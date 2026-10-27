// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "./fixtures";

// Spec 010: each footer entry opens the page of the same name. Spec 062, issue 33, and spec 081: the Terms Of Service,
// Security Policy, and Privacy Policy entries open their pages, whose headings match the link text. Playwright's
// loader here fails on TypeScript type annotations, so callbacks rely on contextual typing.
const PAGES = [
    ["Web Hosting", "/web-hosting"],
    ["Technical SEO", "/technical-seo"],
    ["Agentic Systems", "/agentic-systems"],
    ["Cost Reduction", "/cost-reduction"],
    ["Lead Generation", "/lead-generation"],
    ["Growth Marketing", "/growth-marketing"],
    ["Process Re-engineering", "/process-re-engineering"],
    ["About Us", "/about-us"],
    ["Terms Of Service", "/terms-of-service"],
    ["Security Policy", "/security-policy"],
    ["Privacy Policy", "/privacy-policy"],
];

const START_PAGES = ["/", "/web-development", "/nope"];

// Spec 081: the Company column's order, ending with Privacy Settings, which reopens the cookie banner.
const COMPANY_LINKS = ["About Us", "Terms Of Service", "Security Policy", "Privacy Policy", "Privacy Settings"];

// Spec 081: Cookiebot is stubbed in the tests (see fixtures.ts), so a fake `window.Cookiebot` counts the calls to
// `renew()`, the method that reopens the banner.
async function countRenewCalls(page) {
    await page.addInitScript(() => {
        window.__renewCalls = 0;
        window.Cookiebot = {
            renew: () => {
                window.__renewCalls += 1;
            },
        };
    });
}

test.describe("Footer links", () => {
    test("Do Not Sell or Share reopens the cookie banner and does not move the page", async ({ page }) => {
        await countRenewCalls(page);
        await page.goto("/");
        const link = page
            .locator("footer")
            .getByRole("link", { name: "Do Not Sell or Share My Personal Information", exact: true });
        await link.scrollIntoViewIfNeeded();
        const before = await page.evaluate(() => window.scrollY);
        expect(before).toBeGreaterThan(0);
        await link.click();
        expect(await page.evaluate(() => window.__renewCalls)).toBe(1);
        await expect(page).toHaveURL(/\/$/);
        expect(await page.evaluate(() => window.scrollY)).toBe(before);
    });

    test("Do Not Sell or Share works from the keyboard", async ({ page }) => {
        await countRenewCalls(page);
        await page.goto("/web-development");
        await page
            .locator("footer")
            .getByRole("link", { name: "Do Not Sell or Share My Personal Information", exact: true })
            .focus();
        await page.keyboard.press("Enter");
        expect(await page.evaluate(() => window.__renewCalls)).toBe(1);
        await expect(page).toHaveURL(/\/web-development$/);
    });

    // Spec 083: the built pages carry an HTML comment directly before each cookie link. The raw HTML is read, because
    // the browser does not show comments.
    for (const route of ["/", "/web-development", "/privacy-policy", "/nope"]) {
        test(`${route}: has the For GDPR and For CCPA comments directly before their links`, async ({ request }) => {
            const html = await (await request.get(route)).text();
            expect(html).toMatch(/<!-- For GDPR -->\s*<a\b[^>]*>\s*Privacy Settings\s*<\/a>/);
            expect(html).toMatch(
                /<!-- For CCPA -->\s*<a\b[^>]*>\s*Do Not Sell or Share My Personal Information\s*<\/a>/,
            );
        });
    }

    test("the Company column lists its links in order", async ({ page }) => {
        await page.goto("/");
        const links = page.getByRole("navigation", { name: "COMPANY" }).getByRole("link");
        await expect(links).toHaveText(COMPANY_LINKS);
    });

    test("Privacy Settings reopens the cookie banner and does not move the page", async ({ page }) => {
        await countRenewCalls(page);
        await page.goto("/");
        const link = page.locator("footer").getByRole("link", { name: "Privacy Settings", exact: true });
        await link.scrollIntoViewIfNeeded();
        const before = await page.evaluate(() => window.scrollY);
        expect(before).toBeGreaterThan(0);
        await link.click();
        expect(await page.evaluate(() => window.__renewCalls)).toBe(1);
        await expect(page).toHaveURL(/\/$/);
        expect(await page.evaluate(() => window.scrollY)).toBe(before);
    });

    test("Privacy Settings works from the keyboard", async ({ page }) => {
        await countRenewCalls(page);
        await page.goto("/web-development");
        await page.locator("footer").getByRole("link", { name: "Privacy Settings", exact: true }).focus();
        await page.keyboard.press("Enter");
        expect(await page.evaluate(() => window.__renewCalls)).toBe(1);
        await expect(page).toHaveURL(/\/web-development$/);
    });

    for (const start of START_PAGES) {
        for (const [label, path] of PAGES) {
            test(`footer "${label}" opens ${path} from ${start}`, async ({ page }) => {
                await page.goto(start);
                await page.locator("footer").getByRole("link", { name: label, exact: true }).click();
                await expect(page).toHaveURL(new RegExp(`${path}$`));
                await expect(page.getByRole("heading", { level: 1, name: label, exact: true })).toBeVisible();
            });
        }
    }
});
