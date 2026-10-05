// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 038 SC-005: formatting the built site changes nothing a visitor sees. The baselines in
// visual-parity.spec.ts-snapshots/ were captured from a build of `main` before this feature. Delete this file and
// that folder once the owner accepts the change. Playwright's loader here fails on TypeScript type annotations,
// so callbacks rely on contextual typing.
const PAGES = [
    { name: "home", path: "/" },
    { name: "web-development", path: "/web-development" },
    { name: "not-found", path: "/nope" },
];
const WIDTHS = [360, 768, 1280];

test.describe("Visual parity with the unformatted build", () => {
    for (const { name, path } of PAGES) {
        for (const width of WIDTHS) {
            test(`${name} at ${width}px looks the same`, async ({ page }) => {
                await page.setViewportSize({ width, height: 900 });
                await page.goto(path, { waitUntil: "networkidle" });
                await page.evaluate(() => document.fonts.ready);
                await expect(page).toHaveScreenshot(`${name}-${width}.png`, { fullPage: true, animations: "disabled" });
            });
        }
    }
});
