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

// Spec 062 and issue 33: Privacy, Terms, and Security open their pages. The page headings differ from the link text.
const LEGAL = [
    ["Privacy", "/privacy", "Privacy Policy"],
    ["Terms", "/terms", "Terms Of Service"],
    ["Security", "/security", "Security Policy"],
];

test.describe("Footer links", () => {
    for (const start of START_PAGES) {
        for (const [label, path] of PAGES) {
            test(`footer "${label}" opens ${path} from ${start}`, async ({ page }) => {
                await page.goto(start);
                await page.locator("footer").getByRole("link", { name: label, exact: true }).click();
                await expect(page).toHaveURL(new RegExp(`${path}$`));
                await expect(page.getByRole("heading", { level: 1, name: label, exact: true })).toBeVisible();
            });
        }

        for (const [label, path, heading] of LEGAL) {
            test(`footer "${label}" opens ${path} from ${start}`, async ({ page }) => {
                await page.goto(start);
                await page.locator("footer").getByRole("link", { name: label, exact: true }).click();
                await expect(page).toHaveURL(new RegExp(`${path}$`));
                await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
            });
        }
    }
});
