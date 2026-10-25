// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it, vi } from "vitest";
import { COOKIE_DECLARATION_SRC, getContentPage, renderMarkdown } from "@/lib/content";

// Spec 078: the marker line becomes the Cookie Declaration script element, and nothing else gets raw HTML through.
describe("cookie declaration marker", () => {
    it("turns the marker into the script element", async () => {
        const html = await renderMarkdown("# Cookies\n\n<!-- cookie-declaration -->\n\nAfter.\n");
        expect(html).toMatch(/<script[^>]*\bid="CookieDeclaration"/);
        expect(html).toContain(`src="${COOKIE_DECLARATION_SRC}"`);
        expect(html).toContain('type="text/javascript"');
        expect(html).toMatch(/<script[^>]*\basync\b/);
        expect(html.indexOf("<script")).toBeGreaterThan(html.indexOf("<h1"));
        expect(html.indexOf("<script")).toBeLessThan(html.indexOf("After."));
    });

    it("uses only the first marker on a page", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const html = await renderMarkdown("<!-- cookie-declaration -->\n\ntext\n\n<!-- cookie-declaration -->\n");
        warn.mockRestore();
        expect(html.indexOf('id="CookieDeclaration"')).toBe(html.lastIndexOf('id="CookieDeclaration"'));
    });

    it("still drops other comments and raw scripts", async () => {
        const html = await renderMarkdown(
            '<!-- note -->\n\n<script src="https://example.com/x.js"></script>\n\ntext\n',
        );
        expect(html).not.toContain("<script");
        expect(html).not.toContain("example.com");
    });

    it("is present in the real Cookies page", async () => {
        const page = await getContentPage(["cookies"]);
        expect(`${page?.html}${page?.cards?.cardsHtml}`).toMatch(/<script[^>]*\bid="CookieDeclaration"/);
    });
});
