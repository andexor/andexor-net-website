// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/marketing/Footer";
import { Logo } from "@/components/marketing/Logo";
import NotFound from "@/app/not-found";

// Spec 008: the footer logo is plain branding, not a link, and no lockup links to #top.
// Spec 003: one shared logo lockup with a single-line "Andexor Network"
// wordmark, used by every header, hero, and footer.
describe("Logo", () => {
  it("shows the wordmark once, on one line, with no 'Network, Inc.' text", () => {
    const { container } = render(<Logo href="/" />);
    expect(screen.getAllByText("Andexor Network")).toHaveLength(1);
    expect(container.textContent).toBe("Andexor Network");
    expect(container.textContent).not.toContain("Network, Inc.");
  });

  it("marks the image decorative so the name is announced once", () => {
    const { container } = render(<Logo href="/" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("alt", "");
    expect(screen.getAllByRole("link", { name: "Andexor Network" })).toHaveLength(1);
  });

  it("renders a link to href when one is given", () => {
    render(<Logo href="/" />);
    expect(screen.getByRole("link", { name: "Andexor Network" })).toHaveAttribute("href", "/");
  });

  it("renders no link when href is omitted", () => {
    render(<Logo size="hero" />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Andexor Network")).toBeInTheDocument();
  });

  it("adds modifier classes for the light and hero variants only when asked", () => {
    const { container, rerender } = render(<Logo href="/" />);
    const lockup = () => container.firstElementChild as HTMLElement;
    expect(lockup()).toHaveClass("an-logo-lockup");
    expect(lockup()).not.toHaveClass("an-logo-lockup--light");
    expect(lockup()).not.toHaveClass("an-logo-lockup--hero");
    rerender(<Logo href="/" light size="hero" />);
    expect(lockup()).toHaveClass("an-logo-lockup--light");
    expect(lockup()).toHaveClass("an-logo-lockup--hero");
  });
});

describe("shared lockup", () => {
  it("is the only place that references the logo mark", () => {
    for (const file of [
      "src/components/marketing/Hero.tsx",
      "src/components/marketing/Footer.tsx",
      "src/components/content/ContentPage.tsx",
    ]) {
      expect(readFileSync(file, "utf8"), file).not.toContain("logo-gold.svg");
    }
  });

  it("is used by the footer as plain branding, not a link", () => {
    const { container } = render(<Footer />);
    expect(screen.queryByRole("link", { name: "Andexor Network" })).toBeNull();
    const lockup = container.querySelector(".an-logo-lockup--light");
    expect(lockup).not.toBeNull();
    expect(lockup?.tagName).toBe("DIV");
    expect(lockup?.textContent).toBe("Andexor Network");
    expect(container.querySelectorAll(".an-logo-lockup")).toHaveLength(1);
  });

  it("is used in the header of content pages such as not-found, linking home", () => {
    render(<NotFound />);
    // Only the header logo is a link; the footer logo is plain branding (spec 008).
    const logos = screen.getAllByRole("link", { name: "Andexor Network" });
    expect(logos).toHaveLength(1);
    expect(logos[0]).toHaveAttribute("href", "/");
  });
});
