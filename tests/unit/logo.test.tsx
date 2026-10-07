// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { readdirSync, readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { Footer } from "@/components/marketing/Footer";
import { LOGO_ALT, Logo } from "@/components/marketing/Logo";
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

    // Spec 059: the mark is named, so the link's name is the alt text plus the wordmark.
    it("names the image Andexor Network logo", () => {
        const { container } = render(<Logo href="/" />);
        const img = container.querySelector("img");
        expect(img).not.toBeNull();
        expect(LOGO_ALT).toBe("Andexor Network logo");
        expect(img).toHaveAttribute("alt", LOGO_ALT);
        expect(screen.getAllByRole("link", { name: "Andexor Network logo Andexor Network" })).toHaveLength(1);
    });

    it("renders a link to href when one is given", () => {
        render(<Logo href="/" />);
        expect(screen.getByRole("link", { name: "Andexor Network logo Andexor Network" })).toHaveAttribute("href", "/");
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

    // Spec 016: the popup header shows the mark alone, so it is the one other place.
    it("logo-gold.svg is referenced in exactly the lockup and the popup header", () => {
        const files = (readdirSync("src", { recursive: true }) as string[])
            .filter((f) => /\.tsx?$/.test(f))
            .map((f) => "src/" + f)
            .filter((f) => readFileSync(f, "utf8").includes("logo-gold.svg"))
            .sort();
        expect(files).toEqual(["src/components/contact/ContactPopup.tsx", "src/components/marketing/Logo.tsx"]);
    });

    // Spec 059: every image that uses the logo file takes its alt text from LOGO_ALT.
    it("every logo image takes its alt text from LOGO_ALT", () => {
        for (const file of ["src/components/marketing/Logo.tsx", "src/components/contact/ContactPopup.tsx"]) {
            const tags = readFileSync(file, "utf8").match(/<img[^>]*logo-gold\.svg[^>]*>/g) ?? [];
            for (const tag of tags) {
                expect(tag, file).toContain("alt={LOGO_ALT}");
            }
        }
    });

    it("is used by the footer as plain branding, not a link", () => {
        const { container } = render(
            <ContactProvider>
                <Footer />
            </ContactProvider>,
        );
        expect(screen.queryByRole("link", { name: "Andexor Network logo Andexor Network" })).toBeNull();
        const lockup = container.querySelector(".an-logo-lockup--light");
        expect(lockup).not.toBeNull();
        expect(lockup?.tagName).toBe("DIV");
        expect(lockup?.textContent).toBe("Andexor Network");
        expect(container.querySelectorAll(".an-logo-lockup")).toHaveLength(1);
    });

    it("is used in the header of content pages such as not-found, linking home", () => {
        render(
            <ContactProvider>
                <NotFound />
            </ContactProvider>,
        );
        // Only the header logo is a link; the footer logo is plain branding (spec 008).
        const logos = screen.getAllByRole("link", { name: "Andexor Network logo Andexor Network" });
        expect(logos).toHaveLength(1);
        expect(logos[0]).toHaveAttribute("href", "/");
    });
});
