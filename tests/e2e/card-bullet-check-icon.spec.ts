// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Specs 051, 052, and 053: each bullet in a home page service card starts with the FontAwesome square-check icon, 24 by
// 24 pixels, centered against its text, with 14px bullet text equal to the card description's size, in --gold-300, with its square layer fully clear so only the check mark shows, on a transparent background,
// hidden from assistive technology, with the text 8px after it. These check the icons that are found, not how many
// there are. Playwright's loader here fails on TypeScript type annotations, so none are used.
for (const width of [1440, 360]) {
    test(`bullet icons are the clear-square FontAwesome square-check at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/");
        const bullets = await page.locator(".an-services__bullet").evaluateAll((items) => {
            const probe = document.createElement("span");
            probe.style.color = "var(--gold-300)";
            document.body.appendChild(probe);
            const gold = getComputedStyle(probe).color;
            probe.remove();
            return items.map((item) => {
                const svg = item.querySelector("svg");
                const text = item.querySelector("span");
                const icon = svg ? svg.getBoundingClientRect() : null;
                const card = item.closest(".an-services__card");
                const cardBox = card.getBoundingClientRect();
                const itemBox = item.getBoundingClientRect();
                const bodySize = getComputedStyle(card.querySelector(".an-services__card-body")).fontSize;
                const secondary = svg ? svg.querySelector(".fa-secondary") : null;
                const primary = svg ? svg.querySelector(".fa-primary") : null;
                return {
                    name: item.textContent,
                    hasSvg: svg !== null,
                    isSquareCheck: svg !== null && svg.classList.contains("fa-square-check"),
                    isPlainCheck: svg !== null && svg.classList.contains("fa-check"),
                    width: icon ? icon.width : 0,
                    height: icon ? icon.height : 0,
                    ariaHidden: svg ? svg.getAttribute("aria-hidden") : null,
                    color: svg ? getComputedStyle(svg).color : "",
                    gold,
                    svgBackground: svg ? getComputedStyle(svg).backgroundColor : "",
                    bulletBackground: getComputedStyle(item).backgroundColor,
                    secondaryOpacity: secondary ? getComputedStyle(secondary).opacity : null,
                    primaryOpacity: primary ? getComputedStyle(primary).opacity : null,
                    textSize: text ? getComputedStyle(text).fontSize : "",
                    bodySize,
                    centerOffset: icon ? Math.abs(icon.top + icon.height / 2 - (itemBox.top + itemBox.height / 2)) : 99,
                    insideCard: itemBox.right <= cardBox.right + 0.5,
                    textGap: icon && text ? text.getBoundingClientRect().left - icon.right : null,
                };
            });
        });
        for (const bullet of bullets) {
            expect(bullet.hasSvg, `${bullet.name}: has an icon`).toBe(true);
            expect(bullet.isSquareCheck, `${bullet.name}: icon is the FontAwesome square-check`).toBe(true);
            expect(bullet.isPlainCheck, `${bullet.name}: icon is not the plain check`).toBe(false);
            expect(Math.abs(bullet.width - 24), `${bullet.name}: width`).toBeLessThanOrEqual(0.5);
            expect(Math.abs(bullet.height - 24), `${bullet.name}: height`).toBeLessThanOrEqual(0.5);
            expect(bullet.ariaHidden, `${bullet.name}: aria-hidden`).toBe("true");
            expect(bullet.color, `${bullet.name}: color`).toBe(bullet.gold);
            expect(bullet.svgBackground, `${bullet.name}: icon background`).toBe("rgba(0, 0, 0, 0)");
            expect(bullet.bulletBackground, `${bullet.name}: bullet background`).toBe("rgba(0, 0, 0, 0)");
            expect(bullet.secondaryOpacity, `${bullet.name}: square layer is clear`).toBe("0");
            expect(bullet.primaryOpacity, `${bullet.name}: check mark is solid`).toBe("1");
            expect(bullet.textSize, `${bullet.name}: text size`).toBe("14px");
            expect(bullet.textSize, `${bullet.name}: text size matches the description`).toBe(bullet.bodySize);
            expect(bullet.centerOffset, `${bullet.name}: icon is centered`).toBeLessThanOrEqual(1);
            expect(bullet.insideCard, `${bullet.name}: bullet is inside the card`).toBe(true);
            expect(Math.abs(bullet.textGap - 8), `${bullet.name}: gap to text`).toBeLessThanOrEqual(1);
        }
    });
}
