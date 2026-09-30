// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { chromium, expect, test } from "@playwright/test";

// Spec 009: every page has the same left edge, whether or not it scrolls.
//
// Why this test exists: measured 2026-09-30 in Chromium with visible
// scrollbars at 1365px wide, the left edge was 15px on `/` and
// `/web-development` and 22.5px on `/nope`. A classic 15px scrollbar takes
// width from a page that scrolls, so its centered content sits 7.5px further
// left than on a short page. No stylesheet contains those numbers. Headless
// browsers hide scrollbars by default, which is why this never showed up in the
// other tests; the first test below launches its own Chromium with scrollbars
// visible. `/nope` stands for any address the site does not have.
//
// Playwright's loader in this repo fails on TypeScript type annotations, so
// this file relies on contextual typing.
const PAGES = ["/", "/web-development", "/nope"];

// Runs in the browser: the left edge of the header (content pages) or hero
// (home page) container, the footer grid, the first card, and the scrollbar
// width.
const measure = () => {
  const left = (selector = "") => {
    const el = document.querySelector(selector);
    return el ? Math.round(el.getBoundingClientRect().left * 10) / 10 : null;
  };
  return {
    top: left(".an-content-header__inner, .an-hero__inner"),
    footer: left("footer .an-footer__grid"),
    card: left(".an-tile"),
    scrollbar: window.innerWidth - document.documentElement.clientWidth,
  };
};

test.describe("Consistent left edge", () => {
  test("with visible scrollbars, every page has the same left edge at every width", async ({ baseURL }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "uses its own Chromium with visible scrollbars");
    const browser = await chromium.launch({
      ignoreDefaultArgs: ["--hide-scrollbars"],
      args: ["--disable-features=OverlayScrollbar,OverlayScrollbars"],
    });
    try {
      for (const width of [320, 768, 1365, 1440, 1600]) {
        const page = await browser.newPage({
          viewport: { width, height: 800 },
          baseURL: baseURL ?? "http://localhost:3000",
        });
        const found = new Map();
        for (const url of PAGES) {
          await page.goto(url);
          found.set(url, await page.evaluate(measure));
        }
        await page.close();
        const home = found.get("/");
        const webDev = found.get("/web-development");
        const notFound = found.get("/nope");

        // The test would prove nothing if scrollbars were hidden.
        if (width === 1365) {
          expect(webDev.scrollbar, "scrollbar width on /web-development at 1365px").toBeGreaterThan(0);
        }
        const context = `at ${width}px: ${JSON.stringify(Array.from(found))}`;
        expect(webDev.top, `header ${context}`).toBe(home.top);
        expect(notFound.top, `header ${context}`).toBe(home.top);
        expect(webDev.footer, `footer ${context}`).toBe(home.footer);
        expect(notFound.footer, `footer ${context}`).toBe(home.footer);
        // Cards line up with the header: same container plus its 24px padding.
        expect(webDev.card, `card ${context}`).toBe(webDev.top + 24);
      }
    } finally {
      await browser.close();
    }
  });

  test("with hidden or overlay scrollbars, every page has the same left edge, unchanged from before", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    const found = new Map();
    for (const url of PAGES) {
      await page.goto(url);
      found.set(url, await page.evaluate(measure));
    }
    const home = found.get("/");
    const context = JSON.stringify(Array.from(found));
    expect(found.get("/web-development").top, `header ${context}`).toBe(home.top);
    expect(found.get("/nope").top, `header ${context}`).toBe(home.top);
    // With overlay scrollbars the reserved gutter is 0, so the container is
    // centered in the full window: (1600 - 1320) / 2 = 140, the value before this
    // change (FR-006). Headless desktop Chromium hides its scrollbar but still
    // reserves the classic 15px gutter, a state real users never see, so there
    // only the equality above is asserted.
    if (testInfo.project.name !== "chromium") {
      expect(home.top, `header ${context}`).toBe(140);
    }
  });
});
