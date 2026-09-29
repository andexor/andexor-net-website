// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

// Spec 002 FR-006 / FR-024: the not-found page uses the site shell and its
// always-dark tokens. The framework default injects `body { background: #fff }`
// for light-mode visitors, which this page must not.
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
});
