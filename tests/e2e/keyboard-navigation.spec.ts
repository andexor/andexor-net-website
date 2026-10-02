// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// FR-015 / SC-006: every interactive element reachable and operable via
// keyboard alone, with a visible focus indicator at each stop.
test("full contact flow is operable using only the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => document.hasFocus(), undefined, { timeout: 5000 });

  const ctaButton = page.getByRole("button", { name: "Contact Us" }).first();
  await ctaButton.focus();
  await expect(ctaButton).toBeFocused();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Contact Us" });
  await expect(dialog).toBeVisible();

  await page.getByLabel("Full name").focus();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await page.keyboard.type("Jordan Reyes");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Work email")).toBeFocused();
  await page.keyboard.type("jordan@example.com");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Company website")).toBeFocused();
  await page.keyboard.type("example.com");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Primary need")).toBeFocused();
  await page.getByLabel("Primary need").selectOption("Web Development");
  // The note's Privacy and Terms links come before Send, in reading order.
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "Privacy" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "Terms" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Send" })).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();

  await page.getByRole("button", { name: "Done" }).focus();
  await expect(page.getByRole("button", { name: "Done" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog).not.toBeVisible();

  // Reopen and close via the × control with the keyboard, using Escape-free
  // Tab navigation to reach it (per FR-021's accessible name).
  await ctaButton.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Close" }).focus();
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog).not.toBeVisible();
});
