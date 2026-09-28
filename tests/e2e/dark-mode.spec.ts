// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// FR-016 / SC-007: appearance follows the OS color-scheme preference
// automatically, with no manual toggle.
test("adapts to a dark OS color-scheme preference automatically", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const lightBodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  const darkBodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  expect(darkBodyBg).not.toBe(lightBodyBg);
});

test("provides no manual light/dark toggle control", async ({ page }) => {
  await page.goto("/");
  const toggleCandidates = page.getByRole("button", { name: /dark mode|light mode|theme/i });
  await expect(toggleCandidates).toHaveCount(0);
});
