// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 043: the 32px box is on the link, and the site's own CSS sets nothing on the icon's <svg>.
test.describe("Footer social icon size", () => {
    for (const width of [320, 768, 1440]) {
        test(`links are 32px square with no margin at ${width}px wide`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/");
            const links = page.locator(".an-footer__social-link");
            await links.first().scrollIntoViewIfNeeded();
            for (const link of await links.all()) {
                const box = await link.evaluate((el) => {
                    const style = getComputedStyle(el);
                    return {
                        width: style.width,
                        height: style.height,
                        margin: style.margin,
                        sizeVariable: style.getPropertyValue("--an-social-size").trim(),
                    };
                });
                expect(box).toEqual({ width: "32px", height: "32px", margin: "0px", sizeVariable: "32px" });
            }
        });
    }

    test("the site's own CSS sets no size, margin, or padding on the icon", async ({ page }) => {
        await page.goto("/");
        const rules = await page.evaluate(() => {
            const found = [];
            for (const sheet of Array.from(document.styleSheets)) {
                for (const rule of Array.from(sheet.cssRules)) {
                    if (!(rule instanceof CSSStyleRule) || !rule.selectorText.includes("social")) continue;
                    if (!/svg|icon/.test(rule.selectorText)) continue;
                    found.push(rule.cssText);
                }
            }
            return found;
        });
        expect(rules).toEqual([]);
    });
});
