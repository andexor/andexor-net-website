// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 047: a home page service card gets a 2px gold ring on hover, does not move, and keeps its border color. While
// pressed it moves 2px right and 2px down, like the buttons. The gold is resolved from the token on the page, so this
// test names the token and not a literal color value.
test.describe("Service card hover", () => {
    test("hover shows a gold ring without moving, and press moves the card 2px right and down", async ({ page }) => {
        await page.goto("/");
        const gold = await page.evaluate(() => {
            const probe = document.createElement("span");
            probe.style.color = "var(--gold-500)";
            document.body.appendChild(probe);
            const color = getComputedStyle(probe).color;
            probe.remove();
            return color;
        });

        const card = page.locator(".an-services__card").first();
        await card.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        const rest = await card.evaluate((el) => {
            const style = getComputedStyle(el);
            return { transform: style.transform, borderColor: style.borderColor, boxShadow: style.boxShadow };
        });

        await card.hover({ position: { x: 8, y: 8 } });
        await expect(card).toHaveCSS("box-shadow", `${gold} 0px 0px 0px 2px`);
        await expect(card).toHaveCSS("transform", rest.transform);
        await expect(card).toHaveCSS("border-color", rest.borderColor);

        await page.mouse.down();
        await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 2, 2)");
        await expect(card).toHaveCSS("box-shadow", `${gold} 0px 0px 0px 2px`);
        await expect(card).toHaveCSS("border-color", rest.borderColor);

        // Move away before releasing, so the release does not follow the link.
        await page.mouse.move(0, 0);
        await page.mouse.up();
    });

    test("the card returns to rest when the pointer leaves", async ({ page }) => {
        await page.goto("/");
        const card = page.locator(".an-services__card").first();
        await card.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        const rest = await card.evaluate((el) => {
            const style = getComputedStyle(el);
            return { transform: style.transform, boxShadow: style.boxShadow };
        });

        await card.hover({ position: { x: 8, y: 8 } });
        await expect(card).not.toHaveCSS("box-shadow", rest.boxShadow);
        await page.mouse.move(0, 0);
        await expect(card).toHaveCSS("box-shadow", rest.boxShadow);
        await expect(card).toHaveCSS("transform", rest.transform);
    });
});
