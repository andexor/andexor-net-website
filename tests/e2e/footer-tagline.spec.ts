// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 031: the footer tagline is one text piece with no line break and no
// maximum width of its own. Playwright's loader here fails on TypeScript type
// annotations, so callbacks rely on contextual typing.
test.describe("Footer tagline", () => {
  for (const route of ["/", "/web-development"]) {
    test(`${route}: one text piece, no line break, no max-width`, async ({ page }) => {
      await page.goto(route);
      const tagline = page.locator(".an-footer__tagline");
      await expect(tagline.locator("br")).toHaveCount(0);
      const info = await tagline.evaluate((el) => ({
        nodes: el.childNodes.length,
        maxWidth: getComputedStyle(el).maxWidth,
      }));
      expect(info.nodes).toBe(1);
      expect(info.maxWidth).toBe("none");
    });
  }
});
