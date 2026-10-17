// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Services } from "@/components/marketing/Services";
import { SERVICES } from "@/components/marketing/services-data";

// FR-004: each service offering has a title, description, and supporting
// bullet points.
describe("Services", () => {
    // Spec 048: two sections, technical then business, each in the footer's order.
    const TECHNICAL = ["Web Development", "Web Hosting", "Technical SEO", "Agentic Systems"];
    const BUSINESS = ["Cost Reduction", "Process Re-engineering", "Lead Generation", "Growth Marketing"];
    const PAGES: Record<string, string> = {
        "Web Development": "/web-development",
        "Web Hosting": "/web-hosting",
        "Technical SEO": "/technical-seo",
        "Agentic Systems": "/agentic-systems",
        "Cost Reduction": "/cost-reduction",
        "Lead Generation": "/lead-generation",
        "Growth Marketing": "/growth-marketing",
        "Process Re-engineering": "/process-re-engineering",
    };

    it("renders a technical and a business section, each with its own heading and sub-heading", () => {
        render(<Services />);
        const technical = screen.getByRole("region", { name: "Technical services built to scale" });
        const business = screen.getByRole("region", { name: "Business services that drive growth" });
        expect(within(technical).getByRole("heading", { level: 2 })).toBeInTheDocument();
        expect(within(business).getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("puts each card in the section of its kind, in the footer's order", () => {
        render(<Services />);
        const titles = (name: string) =>
            within(screen.getByRole("region", { name }))
                .getAllByRole("heading", { level: 3 })
                .map((h) => h.textContent);
        expect(titles("Technical services built to scale")).toEqual(TECHNICAL);
        expect(titles("Business services that drive growth")).toEqual(BUSINESS);
    });

    // Spec 011: every card links to its page, never to a placeholder.
    it("links each card to its page", () => {
        for (const service of SERVICES) {
            expect(service.href).toBe(PAGES[service.title]);
            expect(["technical", "business"]).toContain(service.kind);
        }
        render(<Services />);
        for (const link of screen.getAllByRole("link")) {
            const title = link.querySelector("h3")?.textContent ?? "";
            expect(link).toHaveAttribute("href", PAGES[title]);
        }
    });
});
