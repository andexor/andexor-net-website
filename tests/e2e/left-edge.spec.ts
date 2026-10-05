// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 009: every page has the same left edge, whether or not it scrolls.
//
// History: measured 2026-09-30 in Chromium with visible (classic) scrollbars at
// 1365px wide, the left edge was 15px on `/` and `/web-development` and 22.5px
// on `/nope`, because a 15px scrollbar takes width from a page that scrolls.
// `html { scrollbar-gutter: stable }` in src/styles/globals.css fixes that. The
// owner decided classic scrollbars are essentially obsolete, so they are no
// longer tested here (a test with a visible-scrollbar Chromium was removed).
// This test keeps the layout with hidden or overlay scrollbars unchanged and
// consistent. `/nope` stands for any address the site does not have.
//
// Playwright's loader in this repo fails on TypeScript type annotations, so
// this file relies on contextual typing.
const PAGES = ["/", "/web-development", "/nope"];

// Runs in the browser: the left edge of the header (content pages) or hero
// (home page) container, the footer grid, the first card, and the scrollbar
// width.
const measure = () => {
    const left = (selector = "") => {
        const el = document.querySelector(selector);
        return el ? Math.round(el.getBoundingClientRect().left * 10) / 10 : null;
    };
    return {
        top: left(".an-content-header__inner, .an-hero__inner"),
        footer: left("footer .an-footer__grid"),
        card: left(".an-tile"),
        scrollbar: window.innerWidth - document.documentElement.clientWidth,
    };
};

test.describe("Consistent left edge", () => {
    test("with hidden or overlay scrollbars, every page has the same left edge, unchanged from before", async ({
        page,
    }, testInfo) => {
        await page.setViewportSize({ width: 1600, height: 900 });
        const found = new Map();
        for (const url of PAGES) {
            await page.goto(url);
            found.set(url, await page.evaluate(measure));
        }
        const home = found.get("/");
        const context = JSON.stringify(Array.from(found));
        expect(found.get("/web-development").top, `header ${context}`).toBe(home.top);
        expect(found.get("/nope").top, `header ${context}`).toBe(home.top);
        // With overlay scrollbars the reserved gutter is 0, so the container is
        // centered in the full window: (1600 - 1320) / 2 = 140, the value before this
        // change (FR-006). Headless desktop Chromium hides its scrollbar but still
        // reserves the classic 15px gutter, a state real users never see, so there
        // only the equality above is asserted.
        if (testInfo.project.name !== "chromium") {
            expect(home.top, `header ${context}`).toBe(140);
        }
    });
});
