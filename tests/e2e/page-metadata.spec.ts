// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { expect, test } from "./fixtures";

// Specs 028, 029, 030: on every page the title and the meta description are the H1 text, and only the
// not-found page tells search engines not to index it. Playwright's loader
// here fails on TypeScript type annotations, so callbacks rely on contextual
// typing.
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
            await expect(page).toHaveTitle(h1);
            await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", h1);
        });

        test(`${route}: robots tag only on the not-found page`, async ({ page, request }) => {
            if (route === "/nope") {
                // The build removes the framework's own plain `noindex` from the served HTML, and a small
                // client component removes it again after React puts it back, so both views have one tag.
                const html = await (await request.get(route)).text();
                expect(html.match(/<meta name="robots"[^>]*>/g)).toEqual([
                    '<meta name="robots" content="noindex, nofollow" />',
                ]);
                await page.goto(route);
                const robots = page.locator('meta[name="robots"]');
                await expect(robots).toHaveCount(1);
                await expect(robots).toHaveAttribute("content", "noindex, nofollow");
            } else {
                await page.goto(route);
                await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
            }
        });
    }

    test("an unknown address still answers 404, and robots.txt is served", async ({ request }) => {
        expect((await request.get("/nope")).status()).toBe(404);
        expect([200, 304]).toContain((await request.get("/robots.txt")).status());
    });
});
