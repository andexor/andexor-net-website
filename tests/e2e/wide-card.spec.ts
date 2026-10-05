// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 033: on the Web Development page the card after the `---` follows the
// two columns at full width, and its list flows in two columns that fold to one
// when narrow. These check where things are, not how many there are. Playwright's
// loader here fails on TypeScript type annotations, so callbacks rely on
// contextual typing.
const box = (locator) =>
    locator.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    });

test.describe("Wide closing card", () => {
    for (const width of [1280, 1920]) {
        test(`spans both columns below them at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/web-development");
            const wide = page.locator(".an-tile--wide").first();
            const cols = page.locator(".an-cards__col");
            const [w, left, right] = await Promise.all([box(wide), box(cols.nth(0)), box(cols.nth(1))]);
            expect(Math.abs(w.left - left.left)).toBeLessThan(2);
            expect(Math.abs(w.right - right.right)).toBeLessThan(2);
            expect(w.top).toBeGreaterThanOrEqual(Math.max(left.bottom, right.bottom) - 1);
        });

        test(`its list flows in two columns at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/web-development");
            const items = page.locator(".an-tile--wide li");
            const first = await box(items.first());
            const last = await box(items.last());
            expect(last.left).toBeGreaterThan(first.left + 100);
            expect(last.top).toBeLessThan(first.top + 400);
        });
    }

    test("the list folds into one column when narrow, and back when wide", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto("/web-development");
        const items = page.locator(".an-tile--wide li");
        await page.setViewportSize({ width: 360, height: 900 });
        const narrowFirst = await box(items.first());
        const narrowLast = await box(items.last());
        expect(Math.abs(narrowLast.left - narrowFirst.left)).toBeLessThan(2);
        expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
        ).toBe(true);
        await page.setViewportSize({ width: 1280, height: 900 });
        const wideFirst = await box(items.first());
        const wideLast = await box(items.last());
        expect(wideLast.left).toBeGreaterThan(wideFirst.left + 100);
    });

    test("is the last card when the cards stack on a phone", async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 800 });
        await page.goto("/web-development");
        const tiles = page.locator("article.an-tile");
        const wide = await box(page.locator(".an-tile--wide").first());
        const lastTile = await box(tiles.last());
        expect(wide.top).toBeGreaterThanOrEqual(lastTile.top - 1);
        const widths = await tiles.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().width)));
        expect(new Set(widths).size).toBe(1);
    });
});
