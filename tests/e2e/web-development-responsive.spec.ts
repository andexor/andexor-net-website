// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 002 FR-017 / FR-019 / SC-006: the card page reflows from 320px to 1920px.
for (const width of [320, 768, 1920]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/web-development");
    const overflowing = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflowing).toBe(false);
  });
}

test("wide viewport shows two staggered columns", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/web-development");
  const columns = page.locator(".an-cards__col");
  await expect(columns).toHaveCount(2);
  const [a, b] = await Promise.all([columns.nth(0).boundingBox(), columns.nth(1).boundingBox()]);
  expect(a && b && a.x < b.x).toBe(true);
});

test("narrow viewport stacks cards in reading order at equal width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/web-development");
  const boxes = await page.locator("article.an-tile").evaluateAll((els) =>
    els
      .map((el) => ({
        i: Number(getComputedStyle(el).getPropertyValue("--i")),
        r: el.getBoundingClientRect(),
      }))
      .sort((a, b) => a.i - b.i)
      .map(({ r }) => ({ x: Math.round(r.x), width: Math.round(r.width), y: r.y })),
  );
  expect(new Set(boxes.map((b) => b.width)).size).toBe(1);
  expect(new Set(boxes.map((b) => b.x)).size).toBe(1);
  for (let n = 1; n < boxes.length; n++) expect(boxes[n].y).toBeGreaterThan(boxes[n - 1].y);
});

test("hero fades into the page background", async ({ page }) => {
  await page.goto("/web-development");
  const bg = await page
    .locator(".an-cardhero")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bg).toContain("linear-gradient");
});
