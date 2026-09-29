// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/marketing/Footer";
import { Services } from "@/components/marketing/Services";
import { listContentSlugs } from "@/lib/content";

// Spec 002 FR-013 / FR-023 / SC-007: only approved content pages are linked
// from the home page and footer, and the Web Development links resolve.
const APPROVED = ["/web-development"];

function internalPaths(container: HTMLElement): string[] {
  return [...container.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href") ?? "");
}

describe("links to content pages", () => {
  it("links Web Development from the service card and the footer", () => {
    const services = render(<Services />).container;
    expect(internalPaths(services)).toEqual(APPROVED);
    const footer = render(<Footer />).container;
    expect(internalPaths(footer)).toContain("/web-development");
  });

  it("links no page other than the approved ones", () => {
    const services = render(<Services />).container;
    const footer = render(<Footer />).container;
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
