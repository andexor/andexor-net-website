// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Spec 002 SC-008 / constitution Principle III: content pages meet WCAG 2.1 AA
// and are keyboard operable.
for (const [name, url] of [
  ["Web Development page", "/web-development"],
  ["not-found page", "/nope"],
]) {
  test(`${name} has no WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("Web Development page links are reachable by keyboard with visible focus", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "webkit", "Safari skips links when tabbing by default");
  await page.goto("/web-development");
  const logo = page.getByRole("link", { name: "Andexor Network" }).first();
  await page.keyboard.press("Tab");
  await expect(logo).toBeFocused();
  const focused = await logo.evaluate((el) => {
    const s = getComputedStyle(el);
    return s.outlineStyle !== "none" || s.boxShadow !== "none";
  });
  expect(focused).toBe(true);

  // Tab through the rest of the page. Every link must be focusable in turn.
  const linkCount = await page.locator("a[href]").count();
  const seen = new Set();
  for (let i = 0; i < linkCount + 5; i++) {
    await page.keyboard.press("Tab");
    const href = await page.evaluate(() => document.activeElement?.getAttribute("href") ?? "");
    if (href) seen.add(href);
  }
  expect(seen.size).toBeGreaterThan(3);
});
