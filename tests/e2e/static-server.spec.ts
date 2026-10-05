// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// server.ts serves the static export. Next.js chunk names contain brackets
// (app/[...slug]/page-*.js), which arrive percent-encoded; if they are not
// decoded the content pages never hydrate and their client components
// do nothing. Playwright's loader here fails on
// TypeScript type annotations, so callbacks rely on contextual typing.
for (const path of ["/", "/web-development", "/nope"]) {
    test(`every script and style on ${path} loads`, async ({ page }) => {
        const failed = Array.from({ length: 0 }, () => "");
        page.on("response", (response) => {
            if (response.status() >= 400 && /\.(js|css)(\?|$)/.test(response.url())) {
                failed.push(`${response.status()} ${response.url()}`);
            }
        });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        expect(failed).toEqual([]);
    });
}

test("never serves a file from outside the site directory", async ({ request }) => {
    for (const path of ["/..%2fpackage.json", "/..%2f..%2fetc%2fpasswd", "/%00", "/%E0%A4%A"]) {
        const response = await request.get(path);
        expect(response.status(), path).toBe(404);
        // package.json's own name line. A bare `"name"` also appears in the page's formatted inline data.
        expect(await response.text(), path).not.toContain('"name": "andexor-net-website"');
    }
});
