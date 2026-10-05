// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 038: the built HTML is pretty-printed, and a small script strips the whitespace that adds before React
// hydrates. If the formatting ever breaks hydration, React logs a minified error (#418) and re-renders the page,
// so each page type is loaded several times and must log no console or page errors. Playwright's loader here
// fails on TypeScript type annotations, so callbacks rely on contextual typing.
const PAGES = ["/", "/web-development", "/about-us", "/nope"];
const LOADS_PER_PAGE = 5;

test.describe("Readable output keeps pages healthy", () => {
    for (const path of PAGES) {
        test(`${path} hydrates without errors on every load`, async ({ page }) => {
            const problems = [""].filter(Boolean); // a string[] without a type annotation (see the note above)
            page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
            page.on("console", (message) => {
                // The not-found page's own 404 response is logged as a failed resource; that is expected.
                if (message.type() === "error" && !message.text().includes("404")) {
                    problems.push(`console: ${message.text()}`);
                }
            });

            for (let load = 0; load < LOADS_PER_PAGE; load++) {
                await page.goto(path, { waitUntil: "networkidle" });
            }
            expect(problems).toEqual([]);
        });

        test(`${path} has no whitespace-only text between elements once loaded`, async ({ page }) => {
            await page.goto(path, { waitUntil: "networkidle" });
            const leftover = await page.evaluate(() => {
                const found = [];
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    const parent = node.parentElement;
                    if (!parent || parent.closest("pre, textarea, script, style, noscript, [data-raw-html]")) continue;
                    if (/^\s*\n\s*$/.test(node.textContent ?? "")) found.push(parent.tagName);
                }
                return found;
            });
            expect(leftover).toEqual([]);
        });
    }
});

// Spec 041: the page's data is in one file the page refers to. These check that the page still works with it: it
// becomes interactive on a slow connection, and a page reached through a link works.
test.describe("Page data in an external file", () => {
    test("the Contact button works within the time budget on a slow connection", async ({ browser, browserName }) => {
        test.skip(browserName !== "chromium", "network throttling needs Chromium");
        const context = await browser.newContext();
        const page = await context.newPage();
        const session = await context.newCDPSession(page);
        await session.send("Network.enable");
        await session.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: 150,
            downloadThroughput: (1.6 * 1024 * 1024) / 8,
            uploadThroughput: (750 * 1024) / 8,
        });
        const dataRequests = [""].filter(Boolean);
        page.on("request", (request) => {
            if (/\/_next\/static\/data\/[0-9a-f]{16}\.js$/.test(request.url())) dataRequests.push(request.url());
        });
        const started = Date.now();
        await page.goto("/", { waitUntil: "commit" });
        const button = page.getByRole("button", { name: "Contact Us" }).first();
        await button.waitFor({ state: "visible" });
        while (!(await page.getByLabel("Full name").isVisible())) {
            await button.click();
            await page.waitForTimeout(25);
        }
        expect(Date.now() - started).toBeLessThan(5000);
        expect(dataRequests.length > 0).toBe(true);
        await context.close();
    });

    test("a page reached through a link loads its own data file and logs no errors", async ({ page }) => {
        // The site's links are ordinary links, so each click loads the next page fully, with its own data file.
        const problems = [""].filter(Boolean);
        const dataRequests = [""].filter(Boolean);
        page.on("pageerror", (error) => problems.push(error.message));
        page.on("console", (message) => {
            if (message.type() === "error") problems.push(message.text());
        });
        page.on("request", (request) => {
            if (/\/_next\/static\/data\/[0-9a-f]{16}\.js$/.test(request.url())) dataRequests.push(request.url());
        });
        await page.goto("/", { waitUntil: "networkidle" });
        const homeData = dataRequests.length > 0 ? dataRequests[dataRequests.length - 1] : "";
        await page.locator('a[href="/web-development"]').first().click();
        await expect(page.getByRole("heading", { level: 1, name: "Web Development" })).toBeVisible();
        await page.waitForLoadState("networkidle");
        const pageData = dataRequests.length > 0 ? dataRequests[dataRequests.length - 1] : "";
        expect(homeData).not.toBe("");
        expect(pageData).not.toBe("");
        expect(pageData).not.toBe(homeData);
        expect(problems).toEqual([]);
    });
});
