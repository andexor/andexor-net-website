// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 072: the Name placeholder is a different example name on different displays of the popup.
test.describe("Name example name", () => {
    test("is a two-word name that is not the old fixed example, and changes between displays", async ({ page }) => {
        await page.goto("/");
        const seen = new Set();
        for (let i = 0; i < 20; i++) {
            await page.getByRole("button", { name: "Contact Us" }).first().click();
            const field = page.getByLabel("Name");
            await expect(field).toBeVisible();
            const placeholder = (await field.getAttribute("placeholder")) ?? "";
            expect(placeholder).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
            expect(placeholder).not.toBe("Jordan Reyes");
            seen.add(placeholder);
            await page.getByRole("button", { name: "Close" }).click();
            await expect(page.getByRole("dialog")).toHaveCount(0);
        }
        expect(seen.size).toBeGreaterThan(1);
    });

    test("stays the same while the popup is open and the visitor types and clears the field", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        const field = page.getByLabel("Name");
        const before = await field.getAttribute("placeholder");
        await field.fill("Ada");
        await field.fill("");
        expect(await field.getAttribute("placeholder")).toBe(before);
    });
});
