// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 002 US1: reaching and reading the Web Development page.
test("Web Development service card leads to the page", async ({ page }) => {
    await page.goto("/");
    await page
        .getByRole("link", { name: /Web Development/ })
        .first()
        .click();
    await expect(page).toHaveURL(/\/web-development$/);
});

test("footer Web Development link leads to the page", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Web Development" }).click();
    await expect(page).toHaveURL(/\/web-development$/);
});

test.describe("Web Development page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/web-development");
    });

    test("shows the headline, eyebrow, and matching title", async ({ page }) => {
        await expect(page.getByRole("heading", { level: 1, name: "Web Development", exact: true })).toBeVisible();
        await expect(page.getByText("Technical Services", { exact: true })).toBeVisible();
        await expect(page).toHaveTitle("Web Development | Andexor Network");
    });

    test("shows the hero illustration with a text alternative", async ({ page }) => {
        const hero = page.locator(".an-cardhero img");
        await expect(hero).toBeVisible();
        expect(((await hero.getAttribute("alt")) ?? "").length).toBeGreaterThan(0);
    });

    test("shows its cards in reading order", async ({ page }) => {
        const tiles = page.locator("article.an-tile");
        const order = await tiles.evaluateAll((els) =>
            els.map((el) => Number(getComputedStyle(el).getPropertyValue("--i"))).sort((a, b) => a - b),
        );
        expect(order).toEqual(order.map((_, n) => n + 1));
    });

    test("logo returns home and the footer is shown", async ({ page }) => {
        await expect(page.locator("footer")).toBeVisible();
        await page.getByRole("link", { name: "Andexor Network" }).first().click();
        await expect(page).toHaveURL(/\/$/);
    });
});
