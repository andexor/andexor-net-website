// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Services } from "@/components/marketing/Services";
import { SERVICES } from "@/components/marketing/services-data";

// FR-004: each service offering has a title, description, and supporting
// bullet points.
describe("Services", () => {
  it("renders each service's title, description, and bullets", () => {
    render(<Services />);
    for (const service of SERVICES) {
      expect(screen.getByRole("heading", { name: service.title, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(service.description)).toBeInTheDocument();
      for (const bullet of service.bullets) {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      }
    }
  });

  it("renders the fixed service set: Web Development, Technical SEO, Agentic Systems, Growth Marketing", () => {
    render(<Services />);
    expect(screen.getByRole("heading", { name: "Web Development" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Technical SEO" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Agentic Systems" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Growth Marketing" })).toBeInTheDocument();
  });

  // Spec 011: every card links to its page, never to a placeholder.
  it("links each card to its page", () => {
    const pages: Record<string, string> = {
      "Web Development": "/web-development",
      "Technical SEO": "/technical-seo",
      "Agentic Systems": "/agentic-systems",
      "Growth Marketing": "/growth-marketing",
    };
    for (const service of SERVICES) {
      expect(service.href).toBe(pages[service.title]);
      expect(service.href.startsWith("/")).toBe(true);
    }
    render(<Services />);
    for (const link of screen.getAllByRole("link")) {
      const title = link.querySelector("h3")?.textContent ?? "";
      expect(link).toHaveAttribute("href", pages[title]);
    }
  });
});
