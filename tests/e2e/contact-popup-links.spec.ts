// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 062: the Privacy and Terms links in the Contact Us popup open their pages. The page headings differ from the
// link text.
const LEGAL = [
    ["Privacy", "/privacy", "Privacy Policy"],
    ["Terms", "/terms", "Terms Of Service"],
];

test.describe("Contact Us popup legal links", () => {
    for (const [label, path, heading] of LEGAL) {
        test(`popup "${label}" opens ${path}`, async ({ page }) => {
            await page.goto("/");
            await page.getByRole("button", { name: "Contact Us" }).first().click();
            const dialog = page.getByRole("dialog", { name: "Contact Us" });
            await dialog.getByRole("link", { name: label, exact: true }).click();
            await expect(page).toHaveURL(new RegExp(`${path}$`));
            await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
        });
    }
});
