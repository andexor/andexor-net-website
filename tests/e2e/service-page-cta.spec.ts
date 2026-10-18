// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 074: the Contact Us band at the bottom of the service pages.
test.describe("Service page call to action", () => {
    test("the band sits between the cards and the footer and opens the popup, then returns focus", async ({ page }) => {
        await page.goto("/web-hosting");
        const band = page.locator(".an-cta-band");
        const button = band.getByRole("button", { name: "Contact Us" });
        await button.scrollIntoViewIfNeeded();
        const bottomOf = async (selector) => {
            const box = await page.locator(selector).boundingBox();
            return box ? box.y + box.height : 0;
        };
        const topOf = async (selector) => (await page.locator(selector).boundingBox())?.y ?? 0;
        expect(await topOf(".an-cta-band")).toBeGreaterThanOrEqual(await bottomOf(".an-cards"));
        expect(await topOf("footer")).toBeGreaterThanOrEqual(await bottomOf(".an-cta-band"));

        await button.click();
        await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
        await expect(button).toBeFocused();
    });

    test("a page without cta_heading has no band", async ({ page }) => {
        await page.goto("/about-us");
        await expect(page.locator(".an-cta-band")).not.toBeVisible();
    });
});
