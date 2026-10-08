// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 062: the Privacy and Terms links in the Contact Us popup open their pages. The page headings differ from the
// link text. Spec 065: they open in a new tab, so the popup and the typed text stay in the original tab, and the links
// are named "<label>, opens in new tab".
const LEGAL = [
    ["Privacy", "/privacy", "Privacy Policy"],
    ["Terms", "/terms", "Terms Of Service"],
];

test.describe("Contact Us popup legal links", () => {
    for (const [label, path, heading] of LEGAL) {
        test(`popup "${label}" opens ${path} in a new tab and keeps the form`, async ({ page }) => {
            await page.goto("/");
            await page.getByRole("button", { name: "Contact Us" }).first().click();
            const dialog = page.getByRole("dialog", { name: "Contact Us" });
            await dialog.getByLabel("Full name").fill("Jordan Reyes");
            const link = dialog.getByRole("link", { name: `${label}, opens in new tab`, exact: true });
            const [newPage] = await Promise.all([page.context().waitForEvent("page"), link.click()]);
            await newPage.waitForLoadState();
            await expect(newPage).toHaveURL(new RegExp(`${path}$`));
            await expect(newPage.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
            await expect(dialog).toBeVisible();
            await expect(dialog.getByLabel("Full name")).toHaveValue("Jordan Reyes");
            await newPage.close();
        });
    }
});
