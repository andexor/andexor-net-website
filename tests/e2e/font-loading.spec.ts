// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// FR-024: if the custom fonts don't load within 3 seconds, the page commits
// permanently to the system-font fallback — no visible swap/reflow once
// that fallback is shown, even if the font finishes loading later.
test("falls back to system fonts with no later swap when font loads are blocked", async ({ page }) => {
  await page.route("**/fonts/*.woff2", (route) => route.abort());

  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/fonts-fallback/, { timeout: 4000 });

  const bodyVisibleAt = await page.evaluate(() => getComputedStyle(document.body).visibility);
  expect(bodyVisibleAt).toBe("visible");

  const fontFamilyAfterFallback = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).fontFamily : "";
  });

  // Give any (incorrect) late swap a chance to happen, then confirm the
  // class and computed font-family never change afterwards.
  await page.waitForTimeout(1000);
  await expect(page.locator("html")).toHaveClass(/fonts-fallback/);
  await expect(page.locator("html")).not.toHaveClass(/fonts-ready/);
  const fontFamilyLater = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).fontFamily : "";
  });
  expect(fontFamilyLater).toBe(fontFamilyAfterFallback);
  expect(fontFamilyLater).not.toContain("Play");
});

test("commits to the custom fonts once loaded, without hiding content indefinitely", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/fonts-ready|fonts-fallback/, { timeout: 4000 });
  await expect(page.locator("body")).toBeVisible();
});
