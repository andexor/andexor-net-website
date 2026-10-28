// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it, vi } from "vitest";
import { COOKIE_DECLARATION_SLOT, COOKIE_DECLARATION_SRC, getContentPage, renderMarkdown } from "@/lib/content";

// Specs 078 and 082: the marker line becomes an empty slot that holds the Cookie Declaration script's address, and
// nothing else gets raw HTML through. The script element itself is added by the browser after hydration.
describe("cookie declaration marker", () => {
    it("turns the marker into the slot, not a script element", async () => {
        const html = await renderMarkdown("# Cookies\n\n<!-- cookie-declaration -->\n\nAfter.\n");
        expect(html).toMatch(new RegExp(`<div[^>]*\\bid="${COOKIE_DECLARATION_SLOT}"`));
        expect(html).toContain(`data-src="${COOKIE_DECLARATION_SRC}"`);
        expect(html).not.toContain("<script");
        expect(html.indexOf(COOKIE_DECLARATION_SLOT)).toBeGreaterThan(html.indexOf("<h1"));
        expect(html.indexOf(COOKIE_DECLARATION_SLOT)).toBeLessThan(html.indexOf("After."));
    });

    it("uses only the first marker on a page", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const html = await renderMarkdown("<!-- cookie-declaration -->\n\ntext\n\n<!-- cookie-declaration -->\n");
        warn.mockRestore();
        expect(html.indexOf(COOKIE_DECLARATION_SLOT)).toBe(html.lastIndexOf(COOKIE_DECLARATION_SLOT));
    });

    it("still drops other comments and raw scripts", async () => {
        const html = await renderMarkdown(
            '<!-- note -->\n\n<script src="https://example.com/x.js"></script>\n\ntext\n',
        );
        expect(html).not.toContain("<script");
        expect(html).not.toContain("example.com");
    });

    it("is present in the real Privacy Policy page", async () => {
        const page = await getContentPage(["privacy-policy"]);
        expect(`${page?.html}${page?.cards?.cardsHtml}`).toContain(`id="${COOKIE_DECLARATION_SLOT}"`);
    });
});
