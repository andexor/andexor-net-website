// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 007: no link is underlined, at rest, on hover, or on focus. Body and
// card links stay distinguishable by color (--blue-400 on --slate-50 text) and
// change color on hover. Playwright's loader here fails on TypeScript type
// annotations, so callbacks rely on contextual typing.
const PAGES = ["/", "/web-development", "/nope"];

test.describe("Link style", () => {
    for (const url of PAGES) {
        test(`no link on ${url} is underlined at rest`, async ({ page }) => {
            await page.goto(url);
            const underlined = await page.evaluate(() =>
                Array.from(document.querySelectorAll("a"))
                    .filter((a) => getComputedStyle(a).textDecorationLine !== "none")
                    .map((a) => a.outerHTML.slice(0, 80)),
            );
            expect(underlined).toEqual([]);
        });
    }

    test("the link on the not-found page has no underline on hover or focus", async ({ page }) => {
        await page.goto("/nope");
        const link = page.getByRole("link", { name: "Go to the home page" });
        await link.hover();
        expect(await link.evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe("none");
        await link.focus();
        expect(await link.evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe("none");
    });

    test("a link that wraps across two lines has no underline on a narrow screen", async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await page.goto("/nope");
        const link = page.getByRole("link", { name: "Go to the home page" });
        expect(await link.evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe("none");
    });

    test("every body, card, and footer link is not underlined on hover", async ({ page }) => {
        for (const url of ["/web-development", "/nope", "/"]) {
            await page.goto(url);
            const links = page.locator(".an-prose a, .an-tile a, .an-cardhero__intro a, footer a");
            const count = await links.count();
            for (let i = 0; i < count; i++) {
                const link = links.nth(i);
                if (!(await link.isVisible())) continue;
                await link.hover();
                const line = await link.evaluate((a) => getComputedStyle(a).textDecorationLine);
                expect(line, `${url} link ${i}`).toBe("none");
            }
        }
    });

    test("the not-found link is blue-400 on slate-50 text, and changes color on hover", async ({ page }) => {
        await page.goto("/nope");
        const link = page.getByRole("link", { name: "Go to the home page" });
        // The not-found page's text sits in the hero intro (spec 006), which uses the same colors as .an-prose and .an-tile.
        const paragraph = page.locator(".an-cardhero__intro p");
        expect(await paragraph.evaluate((p) => getComputedStyle(p).color)).toBe("rgb(248, 250, 252)");
        const rest = await link.evaluate((a) => getComputedStyle(a).color);
        expect(rest).toBe("rgb(74, 139, 208)");
        await link.hover();
        const hovered = await link.evaluate((a) => getComputedStyle(a).color);
        expect(hovered).toBe("rgb(143, 182, 226)");
        expect(hovered).not.toBe(rest);
    });

    test("card links change color on hover", async ({ page }) => {
        await page.goto("/web-development");
        const links = page.locator(".an-tile a");
        // The Web Development cards have no links today; this covers ones added later.
        test.skip((await links.count()) === 0, "no links in cards on this page yet");
        const link = links.first();
        const rest = await link.evaluate((a) => getComputedStyle(a).color);
        await link.hover();
        expect(await link.evaluate((a) => getComputedStyle(a).color)).not.toBe(rest);
    });

    test("every body and card link shows a focus ring when tabbed to", async ({ page, browserName }) => {
        test.skip(browserName === "webkit", "Safari skips links when tabbing by default");
        for (const url of ["/nope", "/web-development"]) {
            await page.goto(url);
            const count = await page.locator(".an-prose a, .an-tile a, .an-cardhero__intro a").count();
            for (let i = 0; i < count; i++) {
                const link = page.locator(".an-prose a, .an-tile a, .an-cardhero__intro a").nth(i);
                await link.focus();
                await page.keyboard.press("Tab");
                await page.keyboard.press("Shift+Tab");
                const shadow = await link.evaluate((a) => getComputedStyle(a).boxShadow);
                expect(shadow, `${url} link ${i}`).not.toBe("none");
            }
        }
    });
});
