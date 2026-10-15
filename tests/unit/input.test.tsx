// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/ui/Input";

// Spec 068: a required Input ends its label with an asterisk that assistive technology does not read.
describe("Input", () => {
    it("marks a required field's label with an asterisk hidden from assistive technology", () => {
        render(<Input label="Name" required />);
        // The exact-match query proves the asterisk is not part of the accessible name.
        const input = screen.getByLabelText("Name");
        expect(input).toBeRequired();
        const label = document.querySelector("label");
        const mark = label?.querySelector(".an-label__required");
        expect(mark).not.toBeNull();
        expect(mark).toHaveAttribute("aria-hidden", "true");
        expect(label?.lastChild).toBe(mark);
        // The glyph is CSS content, so the label's text is still the label alone.
        expect(label).toHaveTextContent(/^Name$/);
    });

    it("shows no mark on an optional field", () => {
        render(<Input label="Phone" />);
        expect(screen.getByLabelText("Phone")).not.toBeRequired();
        const label = document.querySelector("label");
        expect(label?.querySelector(".an-label__required")).toBeNull();
        expect(label).toHaveTextContent(/^Phone$/);
    });
});
