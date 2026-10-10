// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { Footer } from "@/components/marketing/Footer";
import { Services } from "@/components/marketing/Services";
import { listContentSlugs } from "@/lib/content";

// Spec 002 FR-013 / FR-023 / SC-007: only approved content pages are linked
// from the home page and footer, and the links resolve. The owner approved the
// nine footer pages in spec 010, the service card pages in spec 011, and Privacy and Terms in spec 062, and Security in issue 33. Since spec 048 there is a card
// for each of the eight service pages, in the footer's order.
const CARD_PAGES = [
    "/web-development",
    "/web-hosting",
    "/technical-seo",
    "/agentic-systems",
    "/cost-reduction",
    "/lead-generation",
    "/growth-marketing",
    "/process-re-engineering",
];
const FOOTER_PAGES = [
    "/about-us",
    "/agentic-systems",
    "/cost-reduction",
    "/growth-marketing",
    "/lead-generation",
    "/privacy",
    "/process-re-engineering",
    "/security",
    "/technical-seo",
    "/terms",
    "/web-development",
    "/web-hosting",
];
const APPROVED = [...new Set([...CARD_PAGES, ...FOOTER_PAGES])].sort();

function internalPaths(container: HTMLElement): string[] {
    return [...container.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href") ?? "");
}

describe("links to content pages", () => {
    it("links the approved pages from the service cards and the footer", () => {
        const services = render(<Services />).container;
        expect(internalPaths(services)).toEqual(CARD_PAGES);
        const footer = render(
            <ContactProvider>
                <Footer />
            </ContactProvider>,
        ).container;
        expect(internalPaths(footer).sort()).toEqual(FOOTER_PAGES);
    });

    it("links no page other than the approved ones", () => {
        const services = render(<Services />).container;
        const footer = render(
            <ContactProvider>
                <Footer />
            </ContactProvider>,
        ).container;
        const linked = new Set([...internalPaths(services), ...internalPaths(footer)]);
        const content = new Set(listContentSlugs().map((slug) => "/" + slug.join("/")));
        const contentLinks = [...linked].filter((href) => content.has(href));
        expect(contentLinks.sort()).toEqual(APPROVED);
    });

    it("only links to pages that are published (not drafts)", () => {
        const published = new Set(listContentSlugs().map((slug) => "/" + slug.join("/")));
        for (const href of APPROVED) expect(published.has(href)).toBe(true);
    });
});
