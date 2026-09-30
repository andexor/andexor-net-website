// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Services } from "@/components/marketing/Services";
import { SERVICES } from "@/components/marketing/services-data";

// FR-004: exactly 4 service offerings, each with a title, description, and
// supporting bullet points, matching data-model.md's fixed content set.
describe("Services", () => {
  it("renders exactly 4 service cards", () => {
    render(<Services />);
    const cards = screen.getAllByRole("link");
    expect(cards).toHaveLength(4);
  });

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
});
