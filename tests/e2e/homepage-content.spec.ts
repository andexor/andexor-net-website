// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// User Story 1 Acceptance Scenarios 1-4 (spec.md).
test.describe("Homepage content", () => {
  test("shows the company name and headline above the fold", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#top").getByText("Andexor Network", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Enterprise-grade services at small business prices" }),
    ).toBeVisible();
  });

  test("shows exactly four service offerings with title, description, and bullets", async ({ page }) => {
    await page.goto("/");
    const services = page.locator("#services");
    await services.scrollIntoViewIfNeeded();
    const cards = services.getByRole("link");
    await expect(cards).toHaveCount(4);
    for (const title of ["Web Development", "Technical SEO", "Agentic Systems", "Growth Marketing"]) {
      await expect(services.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test("shows footer navigation groups, social links, and a copyright notice", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByText("TECHNICAL SERVICES")).toBeVisible();
    await expect(footer.getByText("BUSINESS SERVICES")).toBeVisible();
    await expect(footer.getByText("COMPANY")).toBeVisible();
    await expect(footer.getByLabel("linkedin")).toBeVisible();
    await expect(footer.getByLabel("twitter")).toBeVisible();
    await expect(footer.getByLabel("github")).toBeVisible();
    await expect(footer.getByText(/All rights reserved/)).toBeVisible();
  });

  // SC-004 / FR-014: no visual defects from 320px to 1920px wide.
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    test(`renders without horizontal overflow at ${width}px wide`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hasHorizontalScroll).toBe(false);
    });
  }
});
