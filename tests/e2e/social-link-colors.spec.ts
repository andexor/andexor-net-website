// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 045: the footer social links are blue-300 at rest, blue-200 on hover, and blue-400 while pressed. The press
// color wins when the pointer is also over the link. The expected colors are resolved from the tokens on the page, so
// this test names the tokens and not literal color values.
test.describe("Footer social link colors", () => {
    test("rest, hover, and press colors, with no underline", async ({ page }) => {
        await page.goto("/");
        const tokenColor = (token) =>
            page.evaluate((name) => {
                const probe = document.createElement("span");
                probe.style.color = `var(${name})`;
                document.body.appendChild(probe);
                const color = getComputedStyle(probe).color;
                probe.remove();
                return color;
            }, token);
        const rest = await tokenColor("--blue-300");
        const hover = await tokenColor("--blue-200");
        const press = await tokenColor("--blue-400");

        const links = page.locator(".an-footer__social-link");
        await links.first().scrollIntoViewIfNeeded();
        for (const link of await links.all()) {
            await page.mouse.move(0, 0);
            await expect(link).toHaveCSS("color", rest);

            await link.hover();
            await expect(link).toHaveCSS("color", hover);
            await expect(link).toHaveCSS("text-decoration-line", "none");

            await page.mouse.down();
            await expect(link).toHaveCSS("color", press);
            await expect(link).toHaveCSS("text-decoration-line", "none");

            await page.mouse.up();
            await page.mouse.move(0, 0);
            await expect(link).toHaveCSS("color", rest);
        }
    });
});
