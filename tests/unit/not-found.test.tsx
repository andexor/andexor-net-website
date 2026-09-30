// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

// Spec 002 FR-006 / FR-024: the not-found page uses the site shell and its
// always-dark tokens. The framework default injects `body { background: #fff }`
// for light-mode visitors, which this page must not.
// Spec 006 FR-001 to FR-005: it uses the Web Development style hero with the
// 404 image, and no card, eyebrow, or grid.
describe("NotFound", () => {
  it("shows a headline and a link home inside the site shell", () => {
    const { container } = render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to the home page" })).toHaveAttribute("href", "/");
    expect(container.querySelector("footer")).not.toBeNull();
  });

  it("injects no page-level color styles of its own", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector("style")).toBeNull();
  });

  it("shows the 404 illustration with a text description", () => {
    const { container } = render(<NotFound />);
    const img = container.querySelector(".an-cardhero__art img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/404.png");
    expect(img?.getAttribute("alt")?.length).toBeGreaterThan(10);
  });

  it("uses the hero without a card, eyebrow, or grid", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector("section.an-cardhero.an-cardhero--solo")).not.toBeNull();
    for (const selector of [".an-tile", ".an-cards", ".an-cardhero__eyebrow", ".an-cardhero__grid"]) {
      expect(container.querySelector(selector), selector).toBeNull();
    }
  });

  it("keeps the explanation sentence beside the link", () => {
    render(<NotFound />);
    expect(screen.getByText(/We could not find that page\./)).toBeInTheDocument();
  });
});
