// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 039: the card area is a grid of two equal columns, each a stack of cards in written order, and the spacing
// and edges are what they were before the grid and flexbox columns. The numbers below were measured on the
// Web Development page before this feature (spec 039, task T002): the card area starts 24px from the left edge of
// the page and ends 24px from the right, the gutter between the columns is 24px, and cards are 24px apart (20px when
// there is one column). Edges are measured from the card area's own box, because the page width the browsers report differs by a scrollbar.
// These check where things are, not how many there are. Playwright's loader here fails on TypeScript type
// annotations, so callbacks rely on contextual typing.
const BEFORE = {
    1280: { cardGap: 24, aboveWide: 24, gutter: 24 },
    768: { cardGap: 20, aboveWide: 20 },
    360: { cardGap: 20, aboveWide: 20 },
};
const EDGE = 24;
const WITHIN = 0.6; // pixels

const rect = (locator) =>
    locator.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY, width: r.width };
    });

// The cards of one column, top to bottom, with their written position.
const cardsIn = (column) =>
    column.evaluate((el) =>
        [...el.querySelectorAll(":scope > .an-tile")].map((card) => {
            const r = card.getBoundingClientRect();
            return {
                i: Number(getComputedStyle(card).getPropertyValue("--i")),
                top: r.top + scrollY,
                bottom: r.bottom + scrollY,
            };
        }),
    );

// The card area (`.an-cards`) itself is not changed by spec 039; its padding is the 24px EDGE.
const areaOf = (page) => rect(page.locator(".an-cards"));

const near = (actual, expected) => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(WITHIN);

test.describe("Card grid at 1280px", () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto("/web-development");
    });

    test("has two equal columns on the card area's edges, with the same gutter as before", async ({ page }) => {
        const columns = page.locator(".an-cards__col");
        const [left, right] = await Promise.all([rect(columns.nth(0)), rect(columns.nth(1))]);
        const before = BEFORE[1280];
        const area = await areaOf(page);
        const columnWidth = (area.width - 2 * EDGE - before.gutter) / 2;
        near(left.left, area.left + EDGE);
        near(right.right, area.right - EDGE);
        near(left.width, columnWidth);
        near(right.width, columnWidth);
        near(right.left - left.right, before.gutter);
        near(left.top, right.top);
    });

    test("stacks each column's cards in written order, 24px apart, at their natural height", async ({ page }) => {
        const columns = page.locator(".an-cards__col");
        const [leftCards, rightCards] = await Promise.all([cardsIn(columns.nth(0)), cardsIn(columns.nth(1))]);
        for (const cards of [leftCards, rightCards]) {
            for (let n = 1; n < cards.length; n++) {
                expect(cards[n].i).toBeGreaterThan(cards[n - 1].i);
                near(cards[n].top - cards[n - 1].bottom, BEFORE[1280].cardGap);
            }
        }
        // Everything in the left column was written before everything in the right one.
        expect(leftCards[leftCards.length - 1].i).toBeLessThan(rightCards[0].i);
    });

    test("does not stretch the shorter column to the height of the taller one", async ({ page }) => {
        const columns = page.locator(".an-cards__col");
        const [left, right] = await Promise.all([rect(columns.nth(0)), rect(columns.nth(1))]);
        const [leftCards, rightCards] = await Promise.all([cardsIn(columns.nth(0)), cardsIn(columns.nth(1))]);
        const shorter =
            left.bottom < right.bottom ? { column: left, cards: leftCards } : { column: right, cards: rightCards };
        expect(Math.abs(shorter.column.bottom - shorter.cards[shorter.cards.length - 1].bottom)).toBeLessThanOrEqual(
            WITHIN,
        );
    });

    test("puts the full-width card 24px below both columns, on the card area's edges", async ({ page }) => {
        const columns = page.locator(".an-cards__col");
        const [left, right, wide] = await Promise.all([
            rect(columns.nth(0)),
            rect(columns.nth(1)),
            rect(page.locator(".an-tile--wide").first()),
        ]);
        const area = await areaOf(page);
        near(wide.left, area.left + EDGE);
        near(wide.right, area.right - EDGE);
        near(wide.top - Math.max(left.bottom, right.bottom), BEFORE[1280].aboveWide);
    });
});

for (const width of [768, 360]) {
    test.describe(`Card grid at ${width}px`, () => {
        test("is one column in written order, 20px apart, on the card area's edges", async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/web-development");
            const before = BEFORE[width];
            const area = await areaOf(page);
            const cards = await page.locator("article.an-tile").evaluateAll((els) =>
                els
                    .map((el) => {
                        const r = el.getBoundingClientRect();
                        return {
                            i: Number(getComputedStyle(el).getPropertyValue("--i")),
                            left: r.left,
                            right: r.right,
                            top: r.top + scrollY,
                            bottom: r.bottom + scrollY,
                            wide: el.classList.contains("an-tile--wide"),
                        };
                    })
                    .sort((a, b) => a.i - b.i),
            );
            for (let n = 0; n < cards.length; n++) {
                near(cards[n].left, area.left + EDGE);
                near(cards[n].right, area.right - EDGE);
                if (n > 0) {
                    expect(cards[n].top).toBeGreaterThan(cards[n - 1].top);
                    near(cards[n].top - cards[n - 1].bottom, before.cardGap);
                }
            }
            const last = cards[cards.length - 1];
            expect(last.wide).toBe(true);
            near(last.top - cards[cards.length - 2].bottom, before.aboveWide);
        });
    });
}
