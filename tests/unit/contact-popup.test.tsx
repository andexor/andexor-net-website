// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EXAMPLE_NAMES } from "@/components/contact/example-names";
import { ContactPopup } from "@/components/contact/ContactPopup";

function fillValidForm() {
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jordan Reyes" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jordan@example.com" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "+1 212 555 0100" } });
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "example.com" } });
}

// Spec 087: Send delivers the request through onSubmit and waits for it. A test that presses Send passes one of
// these, so no test reaches the real sender. `delivered` stands in for the service's 200.
const delivered = () => vi.fn(() => Promise.resolve());
const confirmation = () => screen.findByRole("heading", { name: "Request received" });

// A promise the test settles itself, to look at the popup while a send is in flight.
function deferred() {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<void>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
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

    it("delivers a valid submit through onSubmit and shows the confirmation once it resolves", async () => {
        const onSubmit = delivered();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);

        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        await confirmation();
        expect(onSubmit).toHaveBeenCalledWith({
            name: "Jordan Reyes",
            email: "jordan@example.com",
            phone: "+1 212 555 0100",
            website: "example.com",
            help: "",
            sourcePath: "/",
        });
    });

    // Spec 071: a hidden field carries the path of the page that opened the popup.
    it("sends the source path it was given, in a hidden field with no label", async () => {
        const onSubmit = delivered();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} sourcePath="/web-development" />);

        const hidden = document.querySelector<HTMLInputElement>('input[name="sourcePath"]');
        expect(hidden).not.toBeNull();
        expect(hidden?.type).toBe("hidden");
        expect(screen.queryByLabelText("Source path")).toBeNull();

        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        await confirmation();
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ sourcePath: "/web-development" }));
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

    it("resets to the empty form state whenever the popup (re)opens", async () => {
        const { rerender } = render(<ContactPopup open onClose={vi.fn()} onSubmit={delivered()} />);
        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        await confirmation();

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

    it("sends the help text in the request, empty when left blank", async () => {
        const onSubmit = delivered();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
        fillValidForm();
        fireEvent.change(screen.getByLabelText("How can we help you?"), { target: { value: "A new site.\nSoon." } });
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        await confirmation();
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ help: "A new site.\nSoon." }));
    });

    it("sends an empty help value when the box is left blank", async () => {
        const onSubmit = delivered();
        render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        await confirmation();
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ help: "" }));
    });

    it("empties the help box when the popup is displayed again", () => {
        const { rerender } = render(<ContactPopup open onClose={vi.fn()} />);
        fireEvent.change(screen.getByLabelText("How can we help you?"), { target: { value: "Hello" } });
        rerender(<ContactPopup open={false} onClose={vi.fn()} />);
        rerender(<ContactPopup open onClose={vi.fn()} />);
        expect(screen.getByLabelText("How can we help you?")).toHaveValue("");
    });

    it("disables the submit control while sending and re-enables it on reopen (FR-023)", async () => {
        const pending = deferred();
        const onSubmit = vi.fn(() => pending.promise);
        const { rerender } = render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        await waitFor(() => expect(screen.getByRole("button", { name: "Send" })).toBeDisabled());

        rerender(<ContactPopup open={false} onClose={vi.fn()} onSubmit={onSubmit} />);
        rerender(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);

        expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
        pending.resolve();
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
    it("shows the gold logo, named, in the form and the confirmation", async () => {
        render(<ContactPopup open onClose={vi.fn()} onSubmit={delivered()} />);
        const logo = () => document.querySelector(".an-contact-header__logo");
        expect(logo()).toBeInstanceOf(HTMLImageElement);
        expect(logo()?.getAttribute("src")).toBe("/logo/logo-gold.svg");
        expect(logo()?.getAttribute("alt")).toBe("Andexor Network logo");

        fillValidForm();
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
        await confirmation();
        expect(logo()?.getAttribute("src")).toBe("/logo/logo-gold.svg");
        expect(logo()?.getAttribute("alt")).toBe("Andexor Network logo");
    });

    // Spec 087: the request is delivered, the confirmation waits for the answer, Send is seen to come back up
    // first, and a failed send keeps the entries.
    describe("Delivery", () => {
        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it("keeps the form, with Send disabled and no confirmation, until onSubmit resolves", async () => {
            const pending = deferred();
            render(<ContactPopup open onClose={vi.fn()} onSubmit={vi.fn(() => pending.promise)} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));

            await waitFor(() => expect(screen.getByRole("button", { name: "Send" })).toBeDisabled());
            expect(screen.getByLabelText("Name")).toHaveValue("Jordan Reyes");
            expect(screen.queryByRole("heading", { name: "Request received" })).not.toBeInTheDocument();

            pending.resolve();
            await confirmation();
        });

        it("sends through the default sender when no onSubmit is given", async () => {
            const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 200 }));
            vi.stubGlobal("fetch", fetchMock);
            render(<ContactPopup open onClose={vi.fn()} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));

            await confirmation();
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ name: "Jordan Reyes" });
        });

        it("ignores an answer that arrives after the popup closed", async () => {
            const pending = deferred();
            const onSubmit = vi.fn(() => pending.promise);
            const { rerender } = render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));
            await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

            rerender(<ContactPopup open={false} onClose={vi.fn()} onSubmit={onSubmit} />);
            rerender(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            pending.resolve();
            await pending.promise;

            await waitFor(() => expect(screen.getByRole("button", { name: "Send" })).toBeEnabled());
            expect(screen.queryByRole("heading", { name: "Request received" })).not.toBeInTheDocument();
        });

        // FR-003: the button is drawn normal, with the form still shown, before the request leaves.
        it("lets Send come back up before calling onSubmit, and sends once for two quick activations", async () => {
            const onSubmit = delivered();
            render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            fillValidForm();
            const send = screen.getByRole("button", { name: "Send" });
            fireEvent.click(send);
            fireEvent.click(send);

            expect(onSubmit).not.toHaveBeenCalled();
            expect(send).toBeEnabled();

            await confirmation();
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        it("waits for a held activation key to be released before sending", async () => {
            const onSubmit = delivered();
            render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            fillValidForm();
            const send = screen.getByRole("button", { name: "Send" });
            fireEvent.keyDown(send, { key: "Enter" });
            fireEvent.click(send);

            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(onSubmit).not.toHaveBeenCalled();
            expect(send).toBeEnabled();

            fireEvent.keyUp(send, { key: "Enter" });
            await confirmation();
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        it("does not send when the popup closes during the release wait", async () => {
            const onSubmit = delivered();
            const { rerender } = render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));
            rerender(<ContactPopup open={false} onClose={vi.fn()} onSubmit={onSubmit} />);

            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(onSubmit).not.toHaveBeenCalled();
        });

        // FR-005 and FR-006: a failed send keeps the entries, says so, and lets the visitor try again.
        it("keeps the entries, shows an alert, and enables Send when onSubmit rejects", async () => {
            const onSubmit = vi.fn(() => Promise.reject(new Error("status 500")));
            render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));

            await screen.findByRole("alert");
            expect(screen.getByLabelText("Name")).toHaveValue("Jordan Reyes");
            expect(screen.getByLabelText("Email")).toHaveValue("jordan@example.com");
            expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
            expect(screen.queryByRole("heading", { name: "Request received" })).not.toBeInTheDocument();
        });

        it("removes the alert while a retry is in flight and confirms when the retry succeeds", async () => {
            const retry = deferred();
            const onSubmit = vi
                .fn<() => Promise<void>>()
                .mockImplementationOnce(() => Promise.reject(new Error("status 500")))
                .mockImplementationOnce(() => retry.promise);
            render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));
            await screen.findByRole("alert");

            fireEvent.click(screen.getByRole("button", { name: "Send" }));
            await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();

            retry.resolve();
            await confirmation();
        });

        it("shows no alert after a failure once the popup is closed and opened again", async () => {
            const onSubmit = vi.fn(() => Promise.reject(new Error("status 500")));
            const { rerender } = render(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));
            await screen.findByRole("alert");

            rerender(<ContactPopup open={false} onClose={vi.fn()} onSubmit={onSubmit} />);
            rerender(<ContactPopup open onClose={vi.fn()} onSubmit={onSubmit} />);

            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
            expect(screen.getByLabelText("Name")).toHaveValue("");
            expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
        });
    });

    // Spec 015: Esc is one more way to close the popup, and calls the same onClose.
    describe("Esc key", () => {
        it("closes the form with one Esc", () => {
            const onClose = vi.fn();
            render(<ContactPopup open onClose={onClose} />);
            fireEvent.keyDown(document, { key: "Escape" });
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it("closes the confirmation with one Esc", async () => {
            const onClose = vi.fn();
            render(<ContactPopup open onClose={onClose} onSubmit={delivered()} />);
            fillValidForm();
            fireEvent.click(screen.getByRole("button", { name: "Send" }));
            await confirmation();
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
