// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// User Story 1 Acceptance Scenarios 1-4 (spec.md).
test.describe("Homepage content", () => {
    test("shows the company name and headline above the fold", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("#top").getByText("Andexor Network", { exact: true })).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    const TECHNICAL = [
        ["Web Development", "/web-development"],
        ["Web Hosting", "/web-hosting"],
        ["Technical SEO", "/technical-seo"],
        ["Agentic Systems", "/agentic-systems"],
    ];
    const BUSINESS = [
        ["Cost Reduction", "/cost-reduction"],
        ["Lead Generation", "/lead-generation"],
        ["Growth Marketing", "/growth-marketing"],
        ["Process Re-engineering", "/process-re-engineering"],
    ];

    test("shows each service offering with its title", async ({ page }) => {
        await page.goto("/");
        const main = page.locator(".an-services");
        for (const [title] of [...TECHNICAL, ...BUSINESS]) {
            await expect(main.getByRole("heading", { name: title, exact: true })).toBeVisible();
        }
    });

    // Spec 048: technical cards in one section, business cards in another, each in the footer's order.
    test("groups the cards by kind, in the order the footer lists them", async ({ page }) => {
        await page.goto("/");
        const footerTitles = async (heading) =>
            page
                .locator("footer .an-footer__col-heading", { hasText: heading })
                .locator("xpath=following-sibling::ul")
                .getByRole("link")
                .allTextContents();
        const cardTitles = async (name) =>
            page.getByRole("region", { name }).getByRole("heading", { level: 3 }).allTextContents();
        expect(await cardTitles("Technical services built to scale")).toEqual(await footerTitles("TECHNICAL SERVICES"));
        expect(await cardTitles("Business services that drive growth")).toEqual(
            await footerTitles("BUSINESS SERVICES"),
        );
        expect(await cardTitles("Technical services built to scale")).toEqual(TECHNICAL.map(([title]) => title));
        expect(await cardTitles("Business services that drive growth")).toEqual(BUSINESS.map(([title]) => title));
    });

    // Spec 011: each card opens its page, and the same page as the footer entry of the same name.
    for (const [title, path] of [...TECHNICAL, ...BUSINESS]) {
        test(`the ${title} card opens ${path}, like the footer link`, async ({ page }) => {
            await page.goto("/");
            const card = page
                .locator(".an-services")
                .getByRole("link")
                .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
            const footerLink = page.locator("footer").getByRole("link", { name: title, exact: true });
            expect(await card.getAttribute("href")).toBe(path);
            expect(await footerLink.getAttribute("href")).toBe(path);
            await card.click();
            await expect(page).toHaveURL(new RegExp(`${path}$`));
            await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible();
        });
    }

    // Spec 049: the service cards show no badge. Spec 050: the title is in the top row, so the row is at least as tall as
    // the icon tile, and taller when a title wraps onto two lines.
    test("service cards have no badge", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".an-badge")).toHaveCount(0);
        const rows = await page.locator(".an-services__card-top").evaluateAll((tops) =>
            tops.map((top) => ({
                row: top.getBoundingClientRect().height,
                tile: top.querySelector(".an-services__icon-tile").getBoundingClientRect().height,
            })),
        );
        for (const { row, tile } of rows) {
            expect(row).toBeGreaterThanOrEqual(tile);
        }
    });

    test("shows footer social links", async ({ page }) => {
        await page.goto("/");
        const footer = page.locator("footer");
        await footer.scrollIntoViewIfNeeded();
        await expect(
            footer.getByRole("link", { name: "LinkedIn logo, Andexor profile, opens in new tab", exact: true }),
        ).toBeVisible();
        await expect(
            footer.getByRole("link", { name: "X logo, Andexor profile, opens in new tab", exact: true }),
        ).toBeVisible();
        await expect(
            footer.getByRole("link", { name: "GitHub logo, Andexor organization, opens in new tab", exact: true }),
        ).toBeVisible();
    });

    // SC-004 / FR-014: no visual defects from 320px to 1920px wide.
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
        test(`renders without horizontal overflow at ${width}px wide`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/");
            const hasHorizontalScroll = await page.evaluate(
                () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            );
            expect(hasHorizontalScroll).toBe(false);
        });
    }
});
