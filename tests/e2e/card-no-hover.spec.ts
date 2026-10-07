// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 046: a card is not a link or a button, so nothing about it changes when the pointer is over it. A link inside a
// card still changes color on hover.
for (const path of ["/web-development", "/about-us"]) {
    test.describe(`Card hover on ${path}`, () => {
        test("a card looks the same with the pointer over it", async ({ page }) => {
            await page.goto(path);
            const card = page.locator(".an-tile").first();
            await card.scrollIntoViewIfNeeded();
            const read = () =>
                card.evaluate((el) => {
                    const style = getComputedStyle(el);
                    return {
                        transform: style.transform,
                        boxShadow: style.boxShadow,
                        borderColor: style.borderColor,
                        transition: style.transitionProperty,
                    };
                });

            await page.mouse.move(0, 0);
            const rest = await read();
            await card.hover({ position: { x: 4, y: 4 } });
            const hovered = await read();
            expect(hovered).toEqual(rest);
        });

        test("a link inside a card still changes color on hover", async ({ page }) => {
            await page.goto(path);
            const link = page.locator(".an-tile a").first();
            if ((await link.count()) === 0) {
                test.skip(true, "this page has no link inside a card");
            }
            await link.scrollIntoViewIfNeeded();
            await page.mouse.move(0, 0);
            const rest = await link.evaluate((a) => getComputedStyle(a).color);
            await link.hover();
            await expect(link).not.toHaveCSS("color", rest);
        });
    });
}
