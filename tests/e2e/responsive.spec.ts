// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { devices, expect, test } from "@playwright/test";

// SC-004: no visual defects (overlapping text, cut-off content, unusable
// controls) at viewport widths from 320px to 1920px wide.
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`no horizontal overflow at ${width}px wide`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflowing = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflowing).toBe(false);
  });
}

// FR-020: the site MUST work correctly on recent iPhone, iPad, and Android
// devices — exercised here via Playwright's device-emulation profiles
// (configured as projects in playwright.config.ts) rather than raw
// viewport widths alone.
for (const [name, device] of Object.entries({
  "iPhone 13": devices["iPhone 13"],
  "iPad Pro 11": devices["iPad Pro 11"],
  "Pixel 7": devices["Pixel 7"],
})) {
  test(`homepage and contact flow work on ${name} (device emulation)`, async ({ browser }) => {
    const context = await browser.newContext({ ...device });
    const page = await context.newPage();
    await page.goto("/");

    const overflowing = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflowing).toBe(false);

    await page.getByRole("button", { name: "Contact Us" }).first().tap();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();

    await context.close();
  });
}
