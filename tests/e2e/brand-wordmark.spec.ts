// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 003: single-line "Andexor Network" wordmark (26px) beside the 38px mark in the
// header and footer, one shared lockup on every page; ", Inc." only in the footer.
//
// Note: Playwright's loader in this repo does not accept TypeScript type
// annotations in spec files (see the other specs), so callbacks below rely on
// contextual typing instead.
const PAGES = [
  ["home page", "/"],
  ["Web Development page", "/web-development"],
  ["not-found page", "/nope"],
];

const WIDTHS = [
  ["desktop", 1280],
  ["tablet", 1024],
  ["small tablet", 800],
  ["phone", 320],
];

test.describe("Logo wordmark", () => {
  for (const [name, url] of PAGES) {
    test(`${name}: header/hero and footer show 'Andexor Network' and no 'Network, Inc.' lockup`, async ({
      page,
    }) => {
      await page.goto(url);
      const lockups = page.locator(".an-logo-lockup");
      await expect(lockups).toHaveCount(2);
      for (const lockup of await lockups.all()) {
        await expect(lockup).toHaveText("Andexor Network");
      }
      await expect(page.locator(".an-logo-tagline")).toHaveCount(0);
      // The only "Network, Inc." left on the page is the footer copyright line.
      const inc = page.getByText("Network, Inc.");
      await expect(inc).toHaveCount(1);
      await expect(inc).toContainText("All rights reserved");
    });
  }

  test("page titles say 'Andexor Network' without ', Inc.'", async ({ page }) => {
    for (const [url, title] of [
      ["/", "Andexor Network"],
      ["/nope", "Page not found | Andexor Network"],
    ]) {
      await page.goto(url);
      await expect(page).toHaveTitle(title);
    }
  });

  test("header logo on a content page goes to the home page", async ({ page }) => {
    await page.goto("/web-development");
    await page.locator(".an-content-header").getByRole("link", { name: "Andexor Network" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  for (const [label, width] of WIDTHS) {
    test(`fits on one line with a 38px mark and 26px wordmark at ${label} width (${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: Number(width), height: 800 });
      const checks = [
        ["/web-development", ".an-content-header .an-logo-lockup"],
        ["/web-development", "footer .an-logo-lockup"],
        ["/", "footer .an-logo-lockup"],
      ];
      for (const [url, selector] of checks) {
        await page.goto(url);
        const s = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          const img = el && el.querySelector("img");
          const word = el && el.querySelector(".an-logo-wordmark");
          if (!el || !img || !word || !el.parentElement) throw new Error("incomplete logo lockup");
          const wordRect = word.getBoundingClientRect();
          return {
            markHeight: img.getBoundingClientRect().height,
            fontSize: parseFloat(getComputedStyle(word).fontSize),
            wordHeight: wordRect.height,
            wordRight: wordRect.right,
            parentRight: el.parentElement.getBoundingClientRect().right,
            pageFits: document.documentElement.scrollWidth <= window.innerWidth,
          };
        }, selector);
        expect(s.markHeight, `${url} ${selector} mark size`).toBe(38);
        expect(s.fontSize, `${url} ${selector} wordmark size`).toBe(26);
        expect(s.wordHeight, `${url} ${selector} one line`).toBeLessThanOrEqual(s.fontSize * 1.2);
        expect(s.wordRight, `${url} ${selector} inside its container`).toBeLessThanOrEqual(s.parentRight + 1);
        expect(s.pageFits, `${url} no horizontal scroll`).toBe(true);
      }
    });
  }

  test("the home page hero uses the shared lockup at the design system's larger size, not as a link", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const hero = page.locator("#top .an-logo-lockup");
    await expect(hero).toHaveText("Andexor Network");
    await expect(hero).toHaveClass(/an-logo-lockup--hero/);
    const s = await hero.evaluate((el) => {
      const img = el.querySelector("img");
      const word = el.querySelector(".an-logo-wordmark");
      if (!img || !word) throw new Error("incomplete logo lockup");
      return {
        tag: el.tagName,
        markHeight: img.getBoundingClientRect().height,
        fontSize: parseFloat(getComputedStyle(word).fontSize),
      };
    });
    expect(s.tag).toBe("DIV");
    expect(s.markHeight).toBeGreaterThan(s.fontSize * 1.5);
  });
});
