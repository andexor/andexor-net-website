// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

// Specs 028, 029, 030: on every page the title is the H1 text followed by
// " | Andexor Network", the meta description is the H1 text, and only the
// not-found page tells search engines not to index it. Playwright's loader
// here fails on TypeScript type annotations, so callbacks rely on contextual
// typing.
const SUFFIX = " | Andexor Network";
const contentDir = path.join(process.cwd(), "content");
const contentRoutes = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
  .map((f) => "/" + f.replace(/\.md$/, ""));

const pages = ["/", ...contentRoutes, "/nope"];

test.describe("Page metadata", () => {
  for (const route of pages) {
    test(`${route}: title and description match the H1`, async ({ page }) => {
      await page.goto(route);
      const h1 = ((await page.getByRole("heading", { level: 1 }).first().textContent()) ?? "").trim();
      expect(h1).not.toBe("");
      await expect(page).toHaveTitle(h1 + SUFFIX);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", h1);
    });

    test(`${route}: robots tag only on the not-found page`, async ({ page }) => {
      await page.goto(route);
      const robots = page.locator('meta[name="robots"]');
      if (route === "/nope") {
        // The framework adds its own plain `noindex` to its not-found page, so
        // there are two tags. Ours is the one with `nofollow`, and it is there once.
        await expect(page.locator('meta[name="robots"][content="noindex, nofollow"]')).toHaveCount(1);
        const contents = await robots.evaluateAll((els) => els.map((el) => el.getAttribute("content")));
        for (const c of contents) expect(c).toMatch(/^noindex/);
      } else {
        await expect(robots).toHaveCount(0);
      }
    });
  }

  test("an unknown address still answers 404, and there is no robots.txt", async ({ request }) => {
    expect((await request.get("/nope")).status()).toBe(404);
    expect((await request.get("/robots.txt")).status()).toBe(404);
  });
});
