// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 063: the icon beside each home page service card's title has a label that says what the picture shows. The label
// is an aria-label on the <svg>, because an inline SVG has no alt attribute. The icon is exposed as an image (not
// hidden). The bullet check marks stay hidden. Playwright's loader here fails on TypeScript type annotations, so none
// are used.
const LABELS = [
    ["Web Development", "source code icon"],
    ["Web Hosting", "web servers icon"],
    ["Technical SEO", "magnifying glass icon"],
    ["Agentic Systems", "A.I. chip icon"],
    ["Cost Reduction", "line chart trending down icon"],
    ["Lead Generation", "sales funnel icon"],
    ["Growth Marketing", "line chart trending up icon"],
    ["Process Re-engineering", "roadmap icon"],
];

test.describe("Service card icon labels", () => {
    for (const [title, label] of LABELS) {
        test(`${title}: the title icon is labeled "${label}"`, async ({ page }) => {
            await page.goto("/");
            const card = page
                .locator(".an-services__card")
                .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
            const icon = card.locator(".an-services__icon-tile svg");
            await expect(icon).toHaveAttribute("aria-label", label);
            await expect(icon).toHaveAttribute("role", "img");
            await expect(icon).not.toHaveAttribute("aria-hidden", "true");
        });
    }

    test("no alt attribute is written in the cards, and the bullet icons stay hidden", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".an-services__card [alt]")).toHaveCount(0);
        const bulletIcons = await page
            .locator(".an-services__bullet svg")
            .evaluateAll((icons) => icons.map((icon) => icon.getAttribute("aria-hidden")));
        for (const hidden of bulletIcons) {
            expect(hidden).toBe("true");
        }
    });
});
