// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// FR-025: the contact popup MUST conform to WCAG 2.1 Level AA, in both its
// form state and its confirmation state.
test.describe("ContactPopup accessibility", () => {
  test("form state has no WCAG 2.1 AA violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  });

  test("confirmation state has no WCAG 2.1 AA violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await page.getByLabel("Full name").fill("Jordan Reyes");
    await page.getByLabel("Work email").fill("jordan@example.com");
    await page.getByLabel("Company website").fill("example.com");
    await page.getByLabel("Primary need").selectOption("Web Development");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
});
