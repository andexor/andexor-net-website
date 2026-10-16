// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input, Textarea } from "@/components/ui/Input";

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

// Spec 073: a multi-line field with the same label, asterisk, and styling class as Input.
describe("Textarea", () => {
    it("is a multi-line field tied to its label, with the same look class as Input", () => {
        render(<Textarea label="How can we help you?" id="help" name="help" rows={4} />);
        const field = screen.getByLabelText("How can we help you?");
        expect(field.tagName).toBe("TEXTAREA");
        expect(field).toHaveAttribute("id", "help");
        expect(field).toHaveAttribute("name", "help");
        expect(field).toHaveAttribute("rows", "4");
        expect(field).toHaveClass("an-input");
        expect(field).not.toBeRequired();
        expect(document.querySelector("label")?.querySelector(".an-label__required")).toBeNull();
    });

    it("marks a required label with the hidden asterisk, as Input does", () => {
        render(<Textarea label="Notes" required />);
        expect(screen.getByLabelText("Notes")).toBeRequired();
        expect(document.querySelector("label .an-label__required")).toHaveAttribute("aria-hidden", "true");
    });
});

// Spec 073: with a length limit, Textarea shows "X/limit" and a progress strip behind the label and counter.
describe("Textarea with a length limit", () => {
    function strip() {
        return document.querySelector(".an-field__head") as HTMLElement;
    }

    it("limits the text and shows the count next to the label, in one strip", () => {
        render(<Textarea label="How can we help you?" id="help" maxLength={250} />);
        const field = screen.getByLabelText("How can we help you?");
        expect(field).toHaveAttribute("maxlength", "250");
        const head = strip();
        expect(head).not.toBeNull();
        expect(head.querySelector("label")).not.toBeNull();
        expect(head.querySelector(".an-field__counter")).toHaveTextContent("0/250");
        expect(head.style.getPropertyValue("--an-fill")).toBe("0%");
    });

    it("updates the count and the fill as the text changes", () => {
        render(<Textarea label="Help" id="help" maxLength={250} />);
        const field = screen.getByLabelText("Help");
        fireEvent.change(field, { target: { value: "x".repeat(100) } });
        expect(strip().querySelector(".an-field__counter")).toHaveTextContent("100/250");
        expect(strip().style.getPropertyValue("--an-fill")).toBe("40%");
        fireEvent.change(field, { target: { value: "x".repeat(250) } });
        expect(strip().querySelector(".an-field__counter")).toHaveTextContent("250/250");
        expect(strip().style.getPropertyValue("--an-fill")).toBe("100%");
        fireEvent.change(field, { target: { value: "" } });
        expect(strip().querySelector(".an-field__counter")).toHaveTextContent("0/250");
        expect(strip().style.getPropertyValue("--an-fill")).toBe("0%");
    });

    it("marks the strip near the limit from 90 percent", () => {
        render(<Textarea label="Help" id="help" maxLength={250} />);
        const field = screen.getByLabelText("Help");
        fireEvent.change(field, { target: { value: "x".repeat(224) } });
        expect(strip()).not.toHaveAttribute("data-near-limit");
        fireEvent.change(field, { target: { value: "x".repeat(225) } });
        expect(strip()).toHaveAttribute("data-near-limit");
    });

    it("describes the field by the counter, which is not a live region", () => {
        render(<Textarea label="Help" id="help" maxLength={250} />);
        const counter = document.querySelector(".an-field__counter") as HTMLElement;
        expect(screen.getByLabelText("Help")).toHaveAttribute("aria-describedby", counter.id);
        expect(counter.id).not.toBe("");
        expect(counter).not.toHaveAttribute("aria-live");
    });

    it("shows no counter and no strip when there is no limit", () => {
        render(<Textarea label="Notes" id="notes" />);
        expect(document.querySelector(".an-field__counter")).toBeNull();
        expect(document.querySelector(".an-field__head")).toBeNull();
        expect(screen.getByLabelText("Notes")).not.toHaveAttribute("maxlength");
    });
});
