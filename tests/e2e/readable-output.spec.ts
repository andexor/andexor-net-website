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
