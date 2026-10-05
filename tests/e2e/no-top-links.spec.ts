// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 008: the footer logo is plain branding (not a link, no tab stop), and no
// link anywhere goes to #top. `/nope` stands for any address the site does not
// have. Playwright's loader here fails on TypeScript type annotations, so
// callbacks rely on contextual typing.
const PAGES = ["/", "/web-development", "/nope"];

test.describe("No links to #top", () => {
    for (const url of PAGES) {
        test(`no link on ${url} goes to #top`, async ({ page }) => {
            await page.goto(url);
            const topLinks = await page.evaluate(() =>
                Array.from(document.querySelectorAll("a"))
                    .filter((a) => a.hasAttribute("href") && new URL(a.href).hash === "#top")
                    .map((a) => a.outerHTML.slice(0, 80)),
            );
            expect(topLinks).toEqual([]);
        });

        test(`the footer logo on ${url} is a plain block, not a link, in its light color`, async ({ page }) => {
            await page.goto(url);
            const lockup = page.locator("footer .an-logo-lockup");
            await expect(lockup).toHaveCount(1);
            await expect(lockup).toHaveText("Andexor Network");
            const info = await lockup.evaluate((el) => {
                const word = el.querySelector(".an-logo-wordmark");
                if (!word) throw new Error("wordmark missing");
                return {
                    tag: el.tagName,
                    insideLink: el.closest("a") !== null,
                    wordmarkColor: getComputedStyle(word).color,
                };
            });
            expect(info.tag).toBe("DIV");
            expect(info.insideLink).toBe(false);
            expect(info.wordmarkColor).toBe("rgb(255, 255, 255)");
        });
    }

    test("clicking the footer logo does not scroll or change the address", async ({ page }) => {
        await page.goto("/");
        const lockup = page.locator("footer .an-logo-lockup");
        await lockup.scrollIntoViewIfNeeded();
        const before = await page.evaluate(() => window.scrollY);
        await lockup.click();
        expect(await page.evaluate(() => window.scrollY)).toBe(before);
        expect(new URL(page.url()).hash).toBe("");
    });

    test("tabbing through the home page never focuses the footer logo", async ({ page, browserName }) => {
        test.skip(browserName === "webkit", "Safari skips links when tabbing by default");
        await page.goto("/");
        for (let i = 0; i < 80; i++) {
            await page.keyboard.press("Tab");
            const inFooterLogo = await page.evaluate(() => {
                const active = document.activeElement;
                return active !== null && active.closest("footer .an-logo-lockup") !== null;
            });
            expect(inFooterLogo, `tab stop ${i}`).toBe(false);
        }
    });

    test("the header logo on a content page still goes to the home page", async ({ page }) => {
        await page.goto("/web-development");
        const header = page.locator(".an-content-header .an-logo-lockup");
        expect(await header.evaluate((el) => el.tagName)).toBe("A");
        await expect(header).toHaveAttribute("href", "/");
    });

    test("the home page hero logo is a plain block", async ({ page }) => {
        await page.goto("/");
        expect(await page.locator("#top .an-logo-lockup").evaluate((el) => el.tagName)).toBe("DIV");
    });
});
