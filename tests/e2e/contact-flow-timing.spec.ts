// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// SC-002: open-popup-to-submit completes in under 60 seconds (human-paced
// UX budget). SC-003: the confirmation appears within 10 seconds of "Send"
// (system response-time target).
test("contact flow stays within its timing budgets", async ({ page }) => {
  await page.goto("/");

  const flowStart = Date.now();
  await page.getByRole("button", { name: "Contact Us" }).first().click();
  await page.getByLabel("Full name").fill("Jordan Reyes");
  await page.getByLabel("Work email").fill("jordan@example.com");
  await page.getByLabel("Company website").fill("example.com");
  await page.getByLabel("Primary need").selectOption("Web Development");

  const sendClickedAt = Date.now();
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
  const confirmedAt = Date.now();

  expect(confirmedAt - flowStart).toBeLessThan(60_000);
  expect(confirmedAt - sendClickedAt).toBeLessThan(10_000);
});
