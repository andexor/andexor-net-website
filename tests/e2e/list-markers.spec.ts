// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

// Spec 032: list items in content page cards show a round bullet, and the home
// page's service cards keep their checkmarks. The marker is a mask image on
// the item's ::before, so the test reads the mask's shape. Playwright's loader
// here fails on TypeScript type annotations, so callbacks rely on contextual
// typing.
const contentRoutes = fs
    .readdirSync(path.join(process.cwd(), "content"))
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => "/" + f.replace(/\.md$/, ""));

function markerShapes(selector) {
    return Array.from(document.querySelectorAll(selector)).map((el) => {
        const cs = getComputedStyle(el, "::before");
        const mask = cs.maskImage && cs.maskImage !== "none" ? cs.maskImage : cs.webkitMaskImage;
        return decodeURIComponent(mask || "");
    });
}

test.describe("List markers", () => {
    for (const route of contentRoutes) {
        test(`${route}: card lists use a round bullet, not a checkmark`, async ({ page }) => {
            await page.goto(route);
            const shapes = await page.evaluate(markerShapes, ".an-tile li");
            for (const shape of shapes) {
                expect(shape).toContain("<circle");
                expect(shape).not.toContain("<path");
            }
        });
    }

    test("the home page service cards keep their checkmarks", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("svg.an-services__bullet-icon").first()).toBeVisible();
        await expect(page.locator(".an-tile li")).toHaveCount(0);
    });
});
