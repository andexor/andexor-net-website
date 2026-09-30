// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Spec 014: the footer's "Contact Us" opens the one Contact Us popup, on every
// page that shows the footer. Playwright's loader here fails on TypeScript type
// annotations, so callbacks rely on contextual typing.
test.describe("Footer Contact Us on the home page", () => {
  test("opens the same popup as the hero button, and only one", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("button", { name: "Contact Us" }).click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(1);
    for (const field of ["Full name", "Work email", "Company website", "Primary need"]) {
      await expect(page.getByLabel(field)).toBeVisible();
    }
  });

  test("does not navigate or scroll", async ({ page }) => {
    await page.goto("/");
    const footerButton = page.locator("footer").getByRole("button", { name: "Contact Us" });
    await footerButton.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await footerButton.click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    await expect(page).toHaveURL(/\/$/);
  });

  test("sending from the footer-opened popup shows the confirmation", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("button", { name: "Contact Us" }).click();
    await page.getByLabel("Full name").fill("Jordan Reyes");
    await page.getByLabel("Work email").fill("jordan@example.com");
    await page.getByLabel("Company website").fill("example.com");
    await page.getByLabel("Primary need").selectOption("Web Development");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
  });

  test("closing returns focus to the footer entry (Close, Done, and Esc)", async ({ page }) => {
    await page.goto("/");
    const footerButton = page.locator("footer").getByRole("button", { name: "Contact Us" });

    await footerButton.click();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(footerButton).toBeFocused();

    await footerButton.click();
    await page.getByLabel("Full name").fill("Jordan Reyes");
    await page.getByLabel("Work email").fill("jordan@example.com");
    await page.getByLabel("Company website").fill("example.com");
    await page.getByLabel("Primary need").selectOption("Web Development");
    await page.getByRole("button", { name: "Send" }).click();
    await page.getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(footerButton).toBeFocused();

    await footerButton.click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(footerButton).toBeFocused();
  });

  test("works from the keyboard with Enter and Space, and opens again after closing", async ({
    page,
  }) => {
    await page.goto("/");
    const footerButton = page.locator("footer").getByRole("button", { name: "Contact Us" });
    await footerButton.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(footerButton).toBeFocused();
    await page.keyboard.press("Space");
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
  });
});

for (const start of ["/", "/web-development", "/nope"]) {
  test.describe(`Footer Contact Us label and look on ${start}`, () => {
    test("reads Contact Us and is a dialog button, not a link", async ({ page }) => {
      await page.goto(start);
      const footer = page.locator("footer");
      await expect(footer.locator("ul.an-footer__col-list").last().locator("li")).toHaveText([
        "About Us",
        "Contact Us",
      ]);
      await expect(footer.getByText("Contact", { exact: true })).toHaveCount(0);
      const button = footer.getByRole("button", { name: "Contact Us" });
      await expect(button).toHaveAttribute("aria-haspopup", "dialog");
      await expect(button).not.toHaveAttribute("href", /.*/);
      await expect(footer.getByRole("link", { name: "Contact Us" })).toHaveCount(0);
    });

    test("is never underlined, and looks like the other footer entries", async ({ page }) => {
      await page.goto(start);
      const footer = page.locator("footer");
      const button = footer.getByRole("button", { name: "Contact Us" });
      const link = footer.getByRole("link", { name: "About Us" });
      await button.scrollIntoViewIfNeeded();
      const style = () => button.evaluate((el) => getComputedStyle(el).textDecorationLine);
      expect(await style()).toBe("none");
      const restColor = await button.evaluate((el) => getComputedStyle(el).color);
      expect(await button.evaluate((el) => getComputedStyle(el).fontSize)).toBe(
        await link.evaluate((el) => getComputedStyle(el).fontSize),
      );
      expect(restColor).toBe(await link.evaluate((el) => getComputedStyle(el).color));
      await button.hover();
      expect(await style()).toBe("none");
      expect(await button.evaluate((el) => getComputedStyle(el).color)).not.toBe(restColor);
      await page.mouse.move(0, 0);
      await button.focus();
      expect(await style()).toBe("none");
    });
  });
}

for (const start of ["/web-development", "/nope"]) {
  test.describe(`Footer Contact Us on ${start}`, () => {
    test("opens the popup on that page without navigating, and focus returns on close", async ({
      page,
    }) => {
      await page.goto(start);
      const footerButton = page.locator("footer").getByRole("button", { name: "Contact Us" });
      await footerButton.click();
      await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
      await expect(page.getByRole("dialog")).toHaveCount(1);
      await expect(page).toHaveURL(new RegExp(`${start}$`));
      await page.getByRole("button", { name: "Close" }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(footerButton).toBeFocused();
    });

    test("sending shows the confirmation, and Esc leaves the same page", async ({ page }) => {
      await page.goto(start);
      await page.locator("footer").getByRole("button", { name: "Contact Us" }).click();
      await page.getByLabel("Full name").fill("Jordan Reyes");
      await page.getByLabel("Work email").fill("jordan@example.com");
      await page.getByLabel("Company website").fill("example.com");
      await page.getByLabel("Primary need").selectOption("Web Development");
      await page.getByRole("button", { name: "Send" }).click();
      await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page).toHaveURL(new RegExp(`${start}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  });
}

test("the popup opened on a content page has no WCAG 2.1 AA violations", async ({ page }) => {
  await page.goto("/web-development");
  await page.locator("footer").getByRole("button", { name: "Contact Us" }).click();
  await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
