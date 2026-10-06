// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 043: the 48px box is on the link, and the icon's <svg> inherits it through the override rules in marketing.css.
// The link has no border (its edge is a box-shadow ring), so the icon is the full 48px.
test.describe("Footer social icon size", () => {
    for (const width of [320, 768, 1440]) {
        test(`links are 48px square and icons fill them at ${width}px wide`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/");
            const links = page.locator(".an-footer__social-link");
            await links.first().scrollIntoViewIfNeeded();
            for (const link of await links.all()) {
                const sizes = await link.evaluate((el) => {
                    const style = getComputedStyle(el);
                    const icon = getComputedStyle(el.querySelector("svg"));
                    return {
                        link: [style.width, style.height, style.margin],
                        icon: [icon.width, icon.height],
                        sizeVariable: style.getPropertyValue("--an-social-size").trim(),
                    };
                });
                expect(sizes).toEqual({
                    link: ["48px", "48px", "0px"],
                    icon: ["48px", "48px"],
                    sizeVariable: "48px",
                });
            }
        });
    }

    // The pattern: one rule per icon, named from the <svg>'s two classes joined with a dot.
    test("every social icon has an override rule named from its classes", async ({ page }) => {
        await page.goto("/");
        const classLists = await page
            .locator(".an-footer__social-link svg")
            .evaluateAll((svgs) => svgs.map((svg) => svg.getAttribute("class")));
        const selectors = await page.evaluate(() => {
            const found = [];
            for (const sheet of Array.from(document.styleSheets)) {
                for (const rule of Array.from(sheet.cssRules)) {
                    if (rule instanceof CSSStyleRule) found.push(...rule.selectorText.split(",").map((s) => s.trim()));
                }
            }
            return found;
        });
        for (const classList of classLists) {
            const classes = classList
                .split(" ")
                .filter((name) => name.startsWith("svg-inline--fa") || name.startsWith("fa-"));
            expect(selectors).toContain("." + classes.join("."));
        }
    });
});
