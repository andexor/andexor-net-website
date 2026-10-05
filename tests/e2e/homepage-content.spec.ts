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

    test("shows each service offering with its title", async ({ page }) => {
        await page.goto("/");
        const services = page.locator("#services");
        await services.scrollIntoViewIfNeeded();
        for (const title of ["Web Development", "Technical SEO", "Agentic Systems", "Growth Marketing"]) {
            await expect(services.getByRole("heading", { name: title })).toBeVisible();
        }
    });

    // Spec 011: each card opens its page, and the same page as the footer entry
    // of the same name. The footer has more entries than there are cards.
    for (const [title, path] of [
        ["Web Development", "/web-development"],
        ["Technical SEO", "/technical-seo"],
        ["Agentic Systems", "/agentic-systems"],
        ["Growth Marketing", "/growth-marketing"],
    ]) {
        test(`the ${title} card opens ${path}, like the footer link`, async ({ page }) => {
            await page.goto("/");
            const card = page
                .locator("#services")
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

    test("shows footer social links", async ({ page }) => {
        await page.goto("/");
        const footer = page.locator("footer");
        await footer.scrollIntoViewIfNeeded();
        await expect(footer.getByLabel("linkedin")).toBeVisible();
        await expect(footer.getByLabel("twitter")).toBeVisible();
        await expect(footer.getByLabel("github")).toBeVisible();
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
