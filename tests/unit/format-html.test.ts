// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import { WHITESPACE_SCRIPT, assertSameDom, formatHtml, plainQuotes } from "../../scripts/format-html";

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
