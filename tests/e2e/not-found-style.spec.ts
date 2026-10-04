// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 006: the not-found page uses the Web Development style hero with the 404
// image, and no card, eyebrow, or grid. It keeps the requested address (no
// redirect) and a 404 status. `/nope` stands for any address the site does not
// have. Playwright's loader here fails on TypeScript type annotations, so
// callbacks rely on contextual typing.
test.describe("Not-found page style", () => {
  test("shows the hero with the 404 image, headline, and link home, without card, eyebrow, or grid", async ({
    page,
  }) => {
    await page.goto("/nope");
    await expect(page).toHaveTitle("Page not found | Andexor Network");
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.getByText("We could not find that page.")).toBeVisible();
    await expect(page.locator(".an-content-header").getByRole("link", { name: "Andexor Network" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(page.locator("footer")).toBeVisible();

    const img = page.locator(".an-cardhero__art img");
    await expect(img).toBeVisible();
    const loaded = await page.evaluate(() => {
      const found = Array.from(document.images).find((i) => i.src.endsWith("/404.png"));
      return Boolean(found && found.complete && found.naturalWidth > 0);
    });
    expect(loaded, "404.png loaded").toBe(true);
    expect(((await img.getAttribute("alt")) ?? "").length).toBeGreaterThan(10);

    const link = page.getByRole("link", { name: "Go to the home page" });
    await expect(link).toHaveAttribute("href", "/");
    for (const selector of [".an-tile", ".an-cards", ".an-cardhero__eyebrow", ".an-cardhero__pattern"]) {
      await expect(page.locator(selector), selector).toHaveCount(0);
    }
  });

  test("the Web Development page keeps its grid and eyebrow", async ({ page }) => {
    await page.goto("/web-development");
    await expect(page.locator(".an-cardhero__pattern")).toHaveCount(1);
    await expect(page.locator(".an-cardhero__eyebrow")).toHaveCount(1);
  });

  // Spec 021: the empty spacer takes the place of the eyebrow, so the headline and
  // tagline sit where they do on a service page, at every hero layout.
  for (const width of [1920, 1280, 768, 375]) {
    test(`headline and tagline line up with a service page at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const positions = [];
      for (const path of ["/cost-reduction", "/nope"]) {
        await page.goto(path);
        positions.push(
          await page.evaluate(() => ({
            h1: (document.querySelector(".an-cardhero h1")?.getBoundingClientRect().top ?? 0) + window.scrollY,
            intro:
              (document.querySelector(".an-cardhero__intro")?.getBoundingClientRect().top ?? 0) +
              window.scrollY,
          })),
        );
      }
      const [service, missing] = positions;
      expect(missing.h1).toBeCloseTo(service.h1, 0);
      expect(missing.intro).toBeCloseTo(service.intro, 0);
    });
  }

  const WIDTHS = [
    ["desktop", 1280],
    ["tablet", 768],
    ["phone", 320],
  ];
  for (const [label, width] of WIDTHS) {
    test(`lays out correctly at ${label} width (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: Number(width), height: 800 });
      await page.goto("/nope");
      const m = await page.evaluate(() => {
        const img = document.querySelector(".an-cardhero__art img");
        const h1 = document.querySelector(".an-cardhero h1");
        const intro = document.querySelector(".an-cardhero__intro");
        const footer = document.querySelector("footer");
        if (!img || !h1 || !intro || !footer) throw new Error("hero parts missing");
        const i = img.getBoundingClientRect();
        const h = h1.getBoundingClientRect();
        return {
          fits: document.documentElement.scrollWidth <= window.innerWidth,
          imgRight: i.right,
          imgBottom: i.bottom,
          h1Left: h.left,
          h1Top: h.top,
          gap: footer.getBoundingClientRect().top - intro.getBoundingClientRect().bottom,
        };
      });
      expect(m.fits, "no horizontal scrolling").toBe(true);
      if (Number(width) === 1280) {
        expect(m.imgRight, "image beside the text").toBeLessThanOrEqual(m.h1Left);
      } else {
        expect(m.imgBottom, "image above the text").toBeLessThanOrEqual(m.h1Top);
      }
      expect(m.gap, "gap above the footer").toBeLessThanOrEqual(160);
    });
  }

  const ADDRESSES = ["/nope", "/nope?ref=1", "/some/deep/missing-page"];
  for (const address of ADDRESSES) {
    test(`${address} keeps its address and answers 404 without a redirect`, async ({ page }) => {
      const response = await page.goto(address);
      expect(response?.status()).toBe(404);
      expect(response?.request().redirectedFrom() ?? null).toBeNull();
      const requested = new URL(address, "http://localhost:3000");
      const now = new URL(page.url());
      expect(now.pathname).toBe(requested.pathname);
      expect(now.search).toBe(requested.search);
      await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    });
  }

  test("the link home goes to the home page", async ({ page }) => {
    await page.goto("/nope");
    await page.getByRole("link", { name: "Go to the home page" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("the link is blue-400 on slate-50 text, changes color on hover, and shows a focus ring", async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/nope");
    const link = page.getByRole("link", { name: "Go to the home page" });
    const paragraph = page.locator(".an-cardhero__intro p");
    expect(await paragraph.evaluate((p) => getComputedStyle(p).color)).toBe("rgb(248, 250, 252)");
    const rest = await link.evaluate((a) => getComputedStyle(a).color);
    expect(rest).toBe("rgb(74, 139, 208)");
    await link.hover();
    const hovered = await link.evaluate((a) => getComputedStyle(a).color);
    expect(hovered).not.toBe(rest);
    if (browserName !== "webkit") {
      await page.keyboard.press("Tab");
      await link.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      expect(await link.evaluate((a) => getComputedStyle(a).boxShadow)).not.toBe("none");
    }
  });
});
