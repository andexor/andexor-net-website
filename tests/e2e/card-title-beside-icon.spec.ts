// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 050: in each home page service card the title is in the top row, to the right of the icon with a gap, centered
// against it, left-aligned, and inside the card. These check where things are, not how many cards there are.
// Playwright's loader here fails on TypeScript type annotations, so none are used.
for (const width of [1440, 360]) {
    test(`service card titles sit beside the icon at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/");
        const cards = await page.locator(".an-services__card").evaluateAll((els) =>
            els.map((card) => {
                const top = card.querySelector(".an-services__card-top");
                const tile = card.querySelector(".an-services__icon-tile").getBoundingClientRect();
                const h3 = card.querySelector("h3");
                const title = h3.getBoundingClientRect();
                const box = card.getBoundingClientRect();
                const style = getComputedStyle(h3);
                return {
                    name: h3.textContent,
                    inTop: top.contains(h3),
                    gap: title.left - tile.right,
                    insideCard: title.right <= box.right && title.left >= box.left,
                    textAlign: style.textAlign,
                    oneLine: title.height <= parseFloat(style.lineHeight) * 1.5,
                    centerOffset: Math.abs(title.top + title.height / 2 - (tile.top + tile.height / 2)),
                    tileWidth: tile.width,
                    tileHeight: tile.height,
                };
            }),
        );
        for (const card of cards) {
            expect(card.inTop, `${card.name}: title is inside the top row`).toBe(true);
            expect(card.gap, `${card.name}: gap to the icon`).toBeGreaterThanOrEqual(12);
            expect(card.insideCard, `${card.name}: title is inside the card`).toBe(true);
            expect(["left", "start"], `${card.name}: text-align`).toContain(card.textAlign);
            expect(card.tileWidth, `${card.name}: icon width`).toBe(48);
            expect(card.tileHeight, `${card.name}: icon height`).toBe(48);
            if (card.oneLine) {
                expect(card.centerOffset, `${card.name}: vertical centering`).toBeLessThanOrEqual(1);
            }
        }
    });
}
