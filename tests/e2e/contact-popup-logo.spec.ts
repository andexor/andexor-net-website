// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 016: the Contact Us popup header shows the gold logo on a transparent
// background, at the same size and place as before. Playwright's loader here
// fails on TypeScript type annotations, so callbacks rely on contextual typing.
test.describe("Popup header logo", () => {
  test("from the hero on /: gold, loaded, 34px, no box, 12px left of the title", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    const logo = page.locator(".an-contact-header__logo");
    const title = page.locator(".an-contact-header__title");
    await expect(logo).toHaveAttribute("src", "/logo/logo-gold.svg");
    await expect(logo).toHaveAttribute("alt", "");
    expect(
      await logo.evaluate(
        (el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0,
      ),
    ).toBe(true);
    const box = (await logo.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 };
    expect(box.width).toBeCloseTo(34, 0);
    expect(box.height).toBeCloseTo(34, 0);
    expect(await logo.evaluate((img) => getComputedStyle(img).backgroundColor)).toBe(
      "rgba(0, 0, 0, 0)",
    );
    expect(await logo.evaluate((img) => getComputedStyle(img).borderRadius)).toBe("0px");
    const titleBox = (await title.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 };
    expect(titleBox.x - (box.x + box.width)).toBeCloseTo(12, 0);
  });

  test("from the footer on /web-development: the same gold logo, loaded", async ({ page }) => {
    await page.goto("/web-development");
    await page.locator("footer").getByRole("button", { name: "Contact Us" }).click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    const logo = page.locator(".an-contact-header__logo");
    await expect(logo).toHaveAttribute("src", "/logo/logo-gold.svg");
    await expect(logo).toHaveAttribute("alt", "");
    expect(
      await logo.evaluate(
        (el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0,
      ),
    ).toBe(true);
    const box = (await logo.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 };
    expect(box.width).toBeCloseTo(34, 0);
    expect(box.height).toBeCloseTo(34, 0);
  });

  test("the confirmation state shows the same gold logo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await page.getByLabel("Full name").fill("Jordan Reyes");
    await page.getByLabel("Work email").fill("jordan@example.com");
    await page.getByLabel("Company website").fill("example.com");
    await page.getByLabel("Primary need").selectOption("Web Development");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
    const logo = page.locator(".an-contact-header__logo");
    await expect(logo).toHaveAttribute("src", "/logo/logo-gold.svg");
    expect(
      await logo.evaluate(
        (el) => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0,
      ),
    ).toBe(true);
  });
});
