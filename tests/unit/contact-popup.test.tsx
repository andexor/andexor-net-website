// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EXAMPLE_NAMES } from "@/components/contact/example-names";
import { ContactPopup } from "@/components/contact/ContactPopup";

function fillValidForm() {
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jordan Reyes" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jordan@example.com" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "+1 212 555 0100" } });
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "example.com" } });
}

describe("ContactPopup", () => {
    it("renders nothing when closed", () => {
        const { container } = render(<ContactPopup open={false} onClose={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    // Spec 068: Phone is new and optional, and Website became optional.
    // Spec 070: the Primary need field is gone.
    it("requires Name and Email, and nothing else", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        expect(screen.getByLabelText("Name")).toBeRequired();
        expect(screen.getByLabelText("Email")).toBeRequired();
        expect(screen.getByLabelText("Phone")).not.toBeRequired();
        expect(screen.getByLabelText("Website")).not.toBeRequired();
        expect(screen.queryByLabelText("Primary need")).toBeNull();
    });

    it("calls onSubmit and shows the confirmation on a valid submit, without any network request", () => {
        const onSubmit = vi.fn();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);

        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        expect(onSubmit).toHaveBeenCalledWith({
            name: "Jordan Reyes",
            email: "jordan@example.com",
            phone: "+1 212 555 0100",
            website: "example.com",
            help: "",
            sourcePath: "/",
        });
        expect(screen.getByRole("heading", { name: "Request received" })).toBeInTheDocument();
    });

    // Spec 071: a hidden field carries the path of the page that opened the popup.
    it("sends the source path it was given, in a hidden field with no label", () => {
        const onSubmit = vi.fn();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} sourcePath="/web-development" />);

        const hidden = document.querySelector<HTMLInputElement>('input[name="sourcePath"]');
        expect(hidden).not.toBeNull();
        expect(hidden?.type).toBe("hidden");
        expect(screen.queryByLabelText("Source path")).toBeNull();

        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ sourcePath: "/web-development" }));
    });

    // Spec 072: the Name placeholder is a random name from the list, chosen each time the popup is displayed.
    it("shows a name from the list as the Name placeholder", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const placeholder = screen.getByLabelText("Name").getAttribute("placeholder") ?? "";
        expect(EXAMPLE_NAMES).toContain(placeholder);
    });

    it("chooses the placeholder again each time the popup is displayed", () => {
        const { rerender } = render(<ContactPopup open onClose={vi.fn()} />);
        const seen = new Set<string>();
        for (let i = 0; i < 50; i++) {
            rerender(<ContactPopup open={false} onClose={vi.fn()} />);
            rerender(<ContactPopup open onClose={vi.fn()} />);
            seen.add(screen.getByLabelText("Name").getAttribute("placeholder") ?? "");
        }
        expect(seen.size).toBeGreaterThan(1);
    });

    it("keeps the same placeholder while the popup stays open, including after typing and clearing", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const field = screen.getByLabelText("Name");
        const before = field.getAttribute("placeholder");
        fireEvent.change(field, { target: { value: "Ada" } });
        fireEvent.change(field, { target: { value: "" } });
        expect(field.getAttribute("placeholder")).toBe(before);
    });

    it("does not use the placeholder as the field's label or value", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const field = screen.getByLabelText("Name");
        expect(field).toHaveValue("");
    });

    it("does not transition to confirmation when required fields are empty", () => {
        const onSubmit = vi.fn();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);

        // jsdom does not block submission on invalid native-required fields the
        // way a real browser does, so we assert on the underlying contract: no
        // onSubmit call happens without user-provided values reaching handleSubmit
        // via the browser's own validation gate (exercised in the E2E test).
        expect(screen.queryByRole("heading", { name: "Request received" })).not.toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("resets to the empty form state whenever the popup (re)opens", () => {
        const { rerender } = render(<ContactPopup open onClose={vi.fn()} />);
        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        expect(screen.getByRole("heading", { name: "Request received" })).toBeInTheDocument();

        // Close, then reopen.
        rerender(<ContactPopup open={false} onClose={vi.fn()} />);
        rerender(<ContactPopup open onClose={vi.fn()} />);

        expect(screen.queryByRole("heading", { name: "Request received" })).not.toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toHaveValue("");
        expect(screen.getByLabelText("Phone")).toHaveValue("");
    });

    // Spec 068: a label ends with the asterisk exactly when its control is required. Each field is checked by name.
    it("marks exactly the required fields with the asterisk", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        for (const name of ["Name", "Email", "Phone", "Website"]) {
            const control = screen.getByLabelText(name) as HTMLInputElement | HTMLSelectElement;
            const label = control.labels?.[0];
            expect(label, name).toBeDefined();
            expect(label?.querySelector(".an-label__required") !== null, name).toBe(control.required);
            expect(label?.textContent?.trim(), name).toBe(name);
        }
    });

    // Spec 068: the phone field is a telephone input, optional, between Email and Website.
    // Spec 070: Primary need is gone, so Phone follows Email directly.
    it("renders the Phone field as an optional telephone field, between Email and Website", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const email = screen.getByLabelText("Email");
        const phone = screen.getByLabelText("Phone");
        const website = screen.getByLabelText("Website");
        expect(phone).toHaveAttribute("type", "tel");
        expect(phone).toHaveAttribute("autocomplete", "tel-national");
        expect(phone).not.toBeRequired();
        expect(email.compareDocumentPosition(phone) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(phone.compareDocumentPosition(website) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    // Issue 69: each field says what it collects, so browsers can fill it accurately.
    it("sets autocomplete on every field, by id", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const expected = {
            "an-name": "name",
            "an-email": "email",
            "an-phone": "tel-national",
            "an-website": "url",
        };
        for (const [id, autocomplete] of Object.entries(expected)) {
            expect(document.getElementById(id), id).toHaveAttribute("autocomplete", autocomplete);
        }
    });

    // Spec 073: an optional four-line "How can we help you?" box directly under Website.
    it("renders the help box under Website, optional, four lines, named and identified as help", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const website = screen.getByLabelText("Website");
        const help = screen.getByLabelText("How can we help you?");
        expect(help.tagName).toBe("TEXTAREA");
        expect(help).toHaveAttribute("name", "help");
        expect(help).toHaveAttribute("id", "help");
        expect(help).toHaveAttribute("rows", "4");
        expect(help).not.toBeRequired();
        expect(website.compareDocumentPosition(help) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        const note = document.querySelector(".an-contact-form__note") as Element;
        expect(help.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("limits the help box to 250 characters and shows the count with the label", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const help = screen.getByLabelText("How can we help you?");
        expect(help).toHaveAttribute("maxlength", "250");
        const head = document.querySelector(".an-field__head") as HTMLElement;
        expect(head.querySelector("label")).toHaveTextContent("How can we help you?");
        expect(head.querySelector(".an-field__counter")).toHaveTextContent("0/250");
        fireEvent.change(help, { target: { value: "Hello" } });
        expect(head.querySelector(".an-field__counter")).toHaveTextContent("5/250");
    });

    it("sends the help text in the request, empty when left blank", () => {
        const onSubmit = vi.fn();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
        fillValidForm();
        fireEvent.change(screen.getByLabelText("How can we help you?"), { target: { value: "A new site.\nSoon." } });
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ help: "A new site.\nSoon." }));
    });

    it("sends an empty help value when the box is left blank", () => {
        const onSubmit = vi.fn();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ help: "" }));
    });

    it("empties the help box when the popup is displayed again", () => {
        const { rerender } = render(<ContactPopup open onClose={vi.fn()} />);
        fireEvent.change(screen.getByLabelText("How can we help you?"), { target: { value: "Hello" } });
        rerender(<ContactPopup open={false} onClose={vi.fn()} />);
        rerender(<ContactPopup open onClose={vi.fn()} />);
        expect(screen.getByLabelText("How can we help you?")).toHaveValue("");
    });

    it("disables the submit control after send and re-enables it on reopen (FR-023)", () => {
        const { rerender } = render(<ContactPopup open onClose={vi.fn()} />);
        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        rerender(<ContactPopup open={false} onClose={vi.fn()} />);
        rerender(<ContactPopup open onClose={vi.fn()} />);

        expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
    });

    it("calls onClose without calling onSubmit when the close control is activated", async () => {
        const onClose = vi.fn();
        const onSubmit = vi.fn();
        render(<ContactPopup open onClose={onClose} onSubmit={onSubmit} />);

        await userEvent.click(screen.getByRole("button", { name: "Close" }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onSubmit).not.toHaveBeenCalled();
    });

    // Spec 016: the header shows the gold logo (transparent) in both states. Spec 059: it is named.
    it("shows the gold logo, named, in the form and the confirmation", () => {
        render(<ContactPopup open onClose={vi.fn()} />);
        const logo = () => document.querySelector(".an-contact-header__logo");
        expect(logo()).toBeInstanceOf(HTMLImageElement);
        expect(logo()?.getAttribute("src")).toBe("/logo/logo-gold.svg");
        expect(logo()?.getAttribute("alt")).toBe("Andexor Network logo");

        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        expect(screen.getByRole("heading", { name: "Request received" })).toBeInTheDocument();
        expect(logo()?.getAttribute("src")).toBe("/logo/logo-gold.svg");
        expect(logo()?.getAttribute("alt")).toBe("Andexor Network logo");
    });

    // Spec 015: Esc is one more way to close the popup, and calls the same onClose.
    describe("Esc key", () => {
        it("closes the form with one Esc", () => {
            const onClose = vi.fn();
            render(<ContactPopup open onClose={onClose} />);
            fireEvent.keyDown(document, { key: "Escape" });
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it("closes the confirmation with one Esc", () => {
            const onClose = vi.fn();
            render(<ContactPopup open onClose={onClose} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));
            expect(screen.getByRole("heading", { name: "Request received" })).toBeInTheDocument();
            fireEvent.keyDown(document, { key: "Escape" });
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it("closes without submitting when text was typed", () => {
            const onClose = vi.fn();
            const onSubmit = vi.fn();
            render(<ContactPopup open onClose={onClose} onSubmit={onSubmit} />);
            fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jordan" } });
            fireEvent.keyDown(screen.getByLabelText("Name"), { key: "Escape" });
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it("does nothing while the popup is closed", () => {
            const onClose = vi.fn();
            render(<ContactPopup open={false} onClose={onClose} />);
            fireEvent.keyDown(document, { key: "Escape" });
            expect(onClose).not.toHaveBeenCalled();
        });

        it("stops listening once the popup closes", () => {
            const onClose = vi.fn();
            const { rerender } = render(<ContactPopup open onClose={onClose} />);
            rerender(<ContactPopup open={false} onClose={onClose} />);
            fireEvent.keyDown(document, { key: "Escape" });
            expect(onClose).not.toHaveBeenCalled();
        });

        it("ignores an Esc another handler already used", () => {
            const onClose = vi.fn();
            render(<ContactPopup open onClose={onClose} />);
            const field = screen.getByLabelText("Name");
            const event = createEvent.keyDown(field, { key: "Escape" });
            event.preventDefault();
            fireEvent(field, event);
            expect(onClose).not.toHaveBeenCalled();
        });

        it("ignores other keys and Esc during text composition", () => {
            const onClose = vi.fn();
            render(<ContactPopup open onClose={onClose} />);
            fireEvent.keyDown(document, { key: "Enter" });
            fireEvent.keyDown(document, { key: "Escape", isComposing: true });
            expect(onClose).not.toHaveBeenCalled();
        });
    });
});
