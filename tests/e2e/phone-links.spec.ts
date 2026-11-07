// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "./fixtures";

// Spec 092: every visible copy of the company's phone number on the policy pages is a tel: link. The number in the
// JSON-LD structured data is not visible text, so script elements are skipped. Playwright's loader here fails on
// TypeScript type annotations, so callbacks rely on contextual typing.
const NUMBER = "+14043511440";
const PAGES = ["/privacy-policy", "/security-policy", "/terms-of-service"];

test.describe("Phone links", () => {
    for (const url of PAGES) {
        test(`every visible phone number on ${url} is a tel: link`, async ({ page }) => {
            await page.goto(url);
            const bare = await page.evaluate((number) => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                const found = [];
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (!node.textContent.includes(number)) continue;
                    if (node.parentElement.closest("script, style")) continue;
                    const link = node.parentElement.closest("a");
                    if (link?.getAttribute("href") !== `tel:${number}`) found.push(node.textContent);
                }
                return found;
            }, NUMBER);
            expect(bare).toEqual([]);
        });
    }

    test("a phone link on the Privacy Policy is not underlined on hover or focus", async ({ page }) => {
        await page.goto("/privacy-policy");
        const link = page.locator(`a[href="tel:${NUMBER}"]`).first();
        await link.hover();
        expect(await link.evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe("none");

        // Real Tab presses from the top of the page, not a programmatic focus call.
        for (let i = 0; i < 300; i++) {
            if (await link.evaluate((a) => a === document.activeElement)) break;
            await page.keyboard.press("Tab");
        }
        expect(await link.evaluate((a) => a.matches(":focus-visible"))).toBe(true);
        expect(await link.evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe("none");
    });
});
