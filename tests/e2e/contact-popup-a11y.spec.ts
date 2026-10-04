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

  test("keyboard focus moves to the Full name field when the popup opens", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeFocused();
  });

  test("Tab stays inside the popup: Send, then Close, then back to Full name", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => document.hasFocus(), undefined, { timeout: 5000 });
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Contact Us" });
    await expect(page.getByLabel("Full name")).toBeFocused();
    const order = [
      dialog.getByLabel("Work email"),
      dialog.getByLabel("Company website"),
      dialog.getByLabel("Primary need"),
      dialog.getByRole("link", { name: "Privacy" }),
      dialog.getByRole("link", { name: "Terms" }),
      dialog.getByRole("button", { name: "Send" }),
      dialog.getByRole("button", { name: "Close" }),
      dialog.getByLabel("Full name"),
    ];
    for (const stop of order) {
      await page.keyboard.press("Tab");
      await expect(stop).toBeFocused();
    }
    // Backwards from the first field goes to Close, then to Send.
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Send" })).toBeFocused();
  });

  test("the confirmation state focuses OK, and focus moves only between OK and Close", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => document.hasFocus(), undefined, { timeout: 5000 });
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await page.getByLabel("Full name").fill("Jordan Reyes");
    await page.getByLabel("Work email").fill("jordan@example.com");
    await page.getByLabel("Company website").fill("example.com");
    await page.getByLabel("Primary need").selectOption("Web Development");
    await page.getByRole("button", { name: "Send" }).click();
    const dialog = page.getByRole("dialog", { name: "Contact Us" });
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
    const ok = dialog.getByRole("button", { name: "OK" });
    const close = dialog.getByRole("button", { name: "Close" });
    await expect(ok).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(ok).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(ok).toBeFocused();
  });

  test("when focus is behind the popup, the next Tab brings it in", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => document.hasFocus(), undefined, { timeout: 5000 });
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Full name")).toBeFocused();
  });

  test("the page behind the popup cannot take focus while it is open", async ({ page }) => {
    await page.goto("/");
    const behind = page.locator("footer a").first();
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    await behind.evaluate((el) => el.focus());
    await expect(behind).not.toBeFocused();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await behind.evaluate((el) => el.focus());
    await expect(behind).toBeFocused();
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
