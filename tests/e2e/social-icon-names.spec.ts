// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 044: the footer's social icons are not hidden from assistive technology and carry their own names. The name is
// on the <svg> (aria-label), not on the <a>, and no alt attribute is written anywhere (it is invalid on these elements).
const NAMES = ["LinkedIn", "X", "GitHub"];

test.describe("Footer social icon names", () => {
    for (const name of NAMES) {
        test(`${name}: the link is named by its icon`, async ({ page }) => {
            await page.goto("/");
            const link = page.locator("footer").getByRole("link", { name, exact: true });
            await link.scrollIntoViewIfNeeded();
            await expect(link).toBeVisible();
            await expect(link).not.toHaveAttribute("aria-label", /.*/);

            const icon = link.locator("svg");
            await expect(icon).toHaveAttribute("aria-label", name);
            await expect(icon).toHaveAttribute("role", "img");
            await expect(icon).not.toHaveAttribute("aria-hidden", "true");
        });
    }

    test("no alt attribute is written on the social links or their icons", async ({ page }) => {
        await page.goto("/");
        const withAlt = page.locator(".an-footer__social-link[alt], .an-footer__social-link [alt]");
        await expect(withAlt).toHaveCount(0);
    });
});
