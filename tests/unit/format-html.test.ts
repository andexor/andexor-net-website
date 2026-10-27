// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import {
    WHITESPACE_SCRIPT,
    addPrivacyComments,
    assertSameDom,
    formatHtml,
    plainQuotes,
} from "../../scripts/format-html";

// Rules from specs/038-readable-generated-code/contracts/formatting-rules.md, applied to a small page shaped like
// the Next.js output (one line, no whitespace between elements).
const LONG_TEXT =
    "Some long paragraph text that goes on well past the print width so a formatter would normally wrap it. ".repeat(3);
const PAGE =
    '<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><title>Test</title>' +
    "<noscript><style>body { visibility: visible !important; }</style></noscript></head>" +
    '<body><div hidden=""><!--$--><!--/$--></div><section id="a" class="x"><h1>Hello world</h1>' +
    `<p>${LONG_TEXT}<a href="/x" class="link">link</a>.</p></section>` +
    '<article data-raw-html="" class="an-prose"><p>One <em>two</em>\nthree</p>\n<ul>\n<li>item</li>\n</ul></article>' +
    '<script>self.__next_f.push([1,"a"])</script></body></html>';

// Spec 040: apostrophes and double quotes are written as the plain characters, not as the escapes React writes.
describe("plain quotes", () => {
    const ESCAPED_APOSTROPHE = "&#x27;";
    const page = (body: string) =>
        `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><title>T</title></head><body>${body}</body></html>`;

    it("shows plain apostrophes and quotes in a formatted page, with the same DOM", async () => {
        const output = await formatHtml(
            page(
                `<p>We${ESCAPED_APOSTROPHE}ll say &quot;hi&quot;</p><img src="/a.png" alt="it${ESCAPED_APOSTROPHE}s"/>`,
            ),
            "quotes.html",
        );
        expect(output).toContain(`We'll say "hi"`);
        expect(output).toContain(`alt="it's"`);
        expect(output).not.toContain(ESCAPED_APOSTROPHE);
        expect(output).not.toContain("&quot;");
    });
});

// Spec 083: the footer's two cookie links get a comment each, directly before the link.
describe("addPrivacyComments", () => {
    const PRIVACY = '<a href="#" class="an-footer__col-link">Privacy Settings</a>';
    const DO_NOT_SELL = '<a href="#" class="an-footer__legal-link">Do Not Sell or Share My Personal Information</a>';
    const page = (body: string) => `<html><head></head><body>${body}</body></html>`;
    const both = page(`<footer>${DO_NOT_SELL}<ul><li>${PRIVACY}</li></ul></footer>`);

    it("puts each comment directly before its link and changes nothing else", () => {
        expect(addPrivacyComments(both, "a.html")).toBe(
            page(`<footer><!-- For CCPA -->${DO_NOT_SELL}<ul><li><!-- For GDPR -->${PRIVACY}</li></ul></footer>`),
        );
    });

    it("leaves the same words in the framework's data scripts alone", () => {
        const withData = both.replace("</body>", '<script>self.__next_f.push([1,"Privacy Settings"])</script></body>');
        expect(addPrivacyComments(withData, "a.html")).toContain(
            '<script>self.__next_f.push([1,"Privacy Settings"])</script>',
        );
        expect(addPrivacyComments(withData, "a.html").match(/For GDPR/g)).toHaveLength(1);
    });

    it("stops the build, naming the page, when a link is missing or repeated", () => {
        expect(() => addPrivacyComments(page(DO_NOT_SELL), "missing.html")).toThrow("missing.html");
        expect(() => addPrivacyComments(page(`${DO_NOT_SELL}${PRIVACY}${PRIVACY}`), "twice.html")).toThrow(
            "twice.html",
        );
    });
});
