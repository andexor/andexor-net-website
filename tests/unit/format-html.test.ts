// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import { COOKIEBOT_SCRIPT, WHITESPACE_SCRIPT, addPrivacyComments, formatHtml } from "../../scripts/format-html";
import organization from "../../src/lib/schema/organization.json";
import person from "../../src/lib/schema/ed.json";
import website from "../../src/lib/schema/website.json";
import webPage from "../../src/lib/schema/webpage.json";

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

// Spec 090: the home page's head carries the Organization structured data, between the Cookiebot script and the
// whitespace script, and only when the formatter is asked for it.
describe("organization structured data", () => {
    const JSON_LD_OPEN = '<script type="application/ld+json">';
    const page =
        '<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><title>T</title></head><body><p>Hi</p></body></html>';
    const countBlocks = (html: string) => html.split(JSON_LD_OPEN).length - 1;

    it("adds the Organization and Person blocks after the Cookiebot script and before the whitespace script, with the source data", async () => {
        const output = await formatHtml(page, "index.html", { jsonLD: true });
        expect(countBlocks(output)).toBe(4);
        const [organizationBlock, personBlock, websiteBlock, webPageBlock] = output
            .split(JSON_LD_OPEN)
            .slice(1)
            .map((rest) => rest.slice(0, rest.indexOf("</script>")));
        expect(output.indexOf(COOKIEBOT_SCRIPT)).toBeLessThan(output.indexOf(JSON_LD_OPEN));
        expect(JSON.parse(organizationBlock)).toEqual(organization);
        expect(JSON.parse(personBlock)).toEqual(person);
        expect(JSON.parse(webPageBlock)).toEqual(webPage);
        expect(JSON.parse(websiteBlock)).toEqual(website);
        expect(output.indexOf(webPageBlock)).toBeLessThan(output.indexOf(WHITESPACE_SCRIPT));
    });

    it("adds no block when the option is not given, and the page still passes the DOM check", async () => {
        const output = await formatHtml(page, "about.html");
        expect(countBlocks(output)).toBe(0);
    });
});
