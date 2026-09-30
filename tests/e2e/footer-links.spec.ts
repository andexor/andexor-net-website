// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 010: each footer entry opens the page of the same name. Playwright's
// loader here fails on TypeScript type annotations, so callbacks rely on
// contextual typing.
const PAGES = [
  ["Web Hosting", "/web-hosting"],
  ["Technical SEO", "/technical-seo"],
  ["Agentic Systems", "/agentic-systems"],
  ["Cost Reduction", "/cost-reduction"],
  ["Lead Generation", "/lead-generation"],
  ["Growth Marketing", "/growth-marketing"],
  ["Process Re-engineering", "/process-re-engineering"],
  ["About Us", "/about-us"],
];

const START_PAGES = ["/", "/web-development", "/nope"];

// FR-003 (spec 010, amended by spec 014): Privacy and Terms stay placeholders.
// Contact Us opens the contact popup (tests/e2e/footer-contact.spec.ts).
const PLACEHOLDERS = [
  ["Privacy", "#privacy"],
  ["Terms", "#terms"],
];

test.describe("Footer links", () => {
  for (const start of START_PAGES) {
    for (const [label, path] of PAGES) {
      test(`footer "${label}" opens ${path} from ${start}`, async ({ page }) => {
        await page.goto(start);
        await page.locator("footer").getByRole("link", { name: label, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`${path}$`));
        await expect(
          page.getByRole("heading", { level: 1, name: label, exact: true }),
        ).toBeVisible();
      });
    }

    test(`Privacy and Terms are still placeholders on ${start}`, async ({ page }) => {
      await page.goto(start);
      for (const [label, href] of PLACEHOLDERS) {
        const link = page.locator("footer").getByRole("link", { name: label, exact: true });
        await expect(link).toHaveAttribute("href", href);
      }
    });
  }
});
