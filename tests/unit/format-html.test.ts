// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import { WHITESPACE_SCRIPT, assertSameDom, formatHtml } from "../../scripts/format-html";

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

describe("formatHtml", () => {
    it("indents with 4 spaces, never tabs, and never starts a line with >", async () => {
        const output = await formatHtml(PAGE, "test.html");
        expect(output).not.toContain("\t");
        for (const line of output.split("\n")) {
            expect(line, line).not.toMatch(/^\s*>/);
            const indent = line.match(/^ */)![0].length;
            // Text and script bodies may continue a wrapped line, so check tags and attributes only.
            if (/^\s*</.test(line) && !line.includes(WHITESPACE_SCRIPT)) expect(indent % 4, line).toBe(0);
        }
    });

    it("adds the whitespace script once, first in <head>, with no whitespace after it", async () => {
        const output = await formatHtml(PAGE, "test.html");
        expect(output.split(WHITESPACE_SCRIPT).length - 1).toBe(1);
        expect(output).toContain(`<head>${WHITESPACE_SCRIPT}<meta`);
    });

    it("keeps <noscript> content exactly as it was", async () => {
        const output = await formatHtml(PAGE, "test.html");
        expect(output).toContain("<noscript><style>body { visibility: visible !important; }</style></noscript>");
    });

    it("does not re-wrap paragraph text", async () => {
        const output = await formatHtml(PAGE, "test.html");
        expect(output).toContain(LONG_TEXT);
    });

    it("formats a data-raw-html region and keeps the text in it", async () => {
        const output = await formatHtml(PAGE, "test.html");
        expect(output).toMatch(/<article[^>]*data-raw-html=""[^>]*>\n/);
        expect(output.replace(/\s+/g, "")).toContain("<p>One<em>two</em>three</p>");
    });
});

describe("assertSameDom", () => {
    it("names the file when text changes", () => {
        const changed = PAGE.replace("Hello world", "Hello there");
        expect(() => assertSameDom(PAGE, changed, "changed.html")).toThrow(/changed\.html/);
    });

    it("refuses an original that has a newline in text outside a data-raw-html region", () => {
        const risky = PAGE.replace("Hello world", "Hello\nworld");
        expect(() => assertSameDom(risky, risky, "risky.html")).toThrow(/risky\.html.*newline/);
    });

    it("accepts a trailing space before an inline element", async () => {
        const page = PAGE.replace("<h1>Hello world</h1>", '<h1>Hello <a href="/y">world</a></h1>');
        await expect(formatHtml(page, "space.html")).resolves.toContain("Hello");
    });
});
