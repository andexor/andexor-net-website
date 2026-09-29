// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// The site always renders the dark look, whatever the OS color-scheme
// preference is (deliberate divergence from FR-016; see src/styles/tokens/colors.css).
test("looks the same in light and dark OS color-scheme preferences", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const lightBodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  const darkBodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  expect(lightBodyBg).toBe(darkBodyBg);
  expect(darkBodyBg).toBe("rgb(10, 19, 34)");
});

test("provides no manual light/dark toggle control", async ({ page }) => {
  await page.goto("/");
  const toggleCandidates = page.getByRole("button", { name: /dark mode|light mode|theme/i });
  await expect(toggleCandidates).toHaveCount(0);
});
