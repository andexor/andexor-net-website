// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

const CARDS = [
  "Need a new website?",
  "Is it time for a re-design?",
  "Need a simple brochure site?",
  "Want a blog?",
  "How about some cool forms, right on your website?",
  "Want to setup an e-commerce shop?",
  "Got a site that loads too slow?",
  "Need a web application?",
  "How about an AI agent?",
];

// Spec 002 US1: reaching and reading the Web Development page.
test("Web Development service card leads to the page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Web Development/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/web-development$/);
});

test("footer Web Development link leads to the page", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").getByRole("link", { name: "Web Development" }).click();
  await expect(page).toHaveURL(/\/web-development$/);
});

test.describe("Web Development page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/web-development");
  });

  test("shows the headline, eyebrow, and matching title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Web Development", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Technical services", { exact: true })).toBeVisible();
    await expect(page).toHaveTitle("Web Development | Andexor Network, Inc.");
  });

  test("shows the hero illustration with a text alternative", async ({ page }) => {
    const hero = page.locator(".an-cardhero img");
    await expect(hero).toBeVisible();
    expect(((await hero.getAttribute("alt")) ?? "").length).toBeGreaterThan(0);
  });

  test("shows nine cards in order, with the last two featured", async ({ page }) => {
    const headings = page.locator("article.an-tile h2");
    await expect(headings).toHaveCount(CARDS.length);
    const byReadingOrder = await page
      .locator("article.an-tile")
      .evaluateAll((els) =>
        els
          .sort(
            (a, b) =>
              Number(getComputedStyle(a).getPropertyValue("--i")) -
              Number(getComputedStyle(b).getPropertyValue("--i")),
          )
          .map((el) => el.querySelector("h2")?.textContent),
      );
    expect(byReadingOrder).toEqual(CARDS);
    const featured = await page.locator("article.an-tile--ink h2").allTextContents();
    expect(featured.sort()).toEqual(["How about an AI agent?", "Need a web application?"]);
  });

  test("lists the web application capabilities", async ({ page }) => {
    const card = page.locator("article.an-tile", { hasText: "Need a web application?" });
    await expect(card.getByRole("listitem")).toHaveCount(9);
  });

  test("logo returns home and the footer is shown", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
    await page.getByRole("link", { name: "Andexor Network" }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});

// Spec 002 FR-006: unknown addresses show the site's not-found page.
test("unknown address shows the not-found page", async ({ page }) => {
  const response = await page.goto("/nope");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Go to the home page" }).click();
  await expect(page).toHaveURL(/\/$/);
});
