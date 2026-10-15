// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ContactProvider, useContact } from "@/components/contact/ContactProvider";

// Spec 071: the provider reads the pathname when the popup opens.
let mockPathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => mockPathname }));

function sourcePathValue() {
    return document.querySelector<HTMLInputElement>('input[name="sourcePath"]')?.value;
}

// Spec 014: one popup per page, opened through useContact(), with focus
// returned to the control that opened it.
function Opener() {
    const { openContact } = useContact();
    return <button onClick={(event) => openContact(event.currentTarget)}>Open</button>;
}

function OpenerNoArg() {
    const { openContact } = useContact();
    return <button onClick={() => openContact()}>Open no arg</button>;
}

function RemovableOpener() {
    const [shown, setShown] = useState(true);
    return (
        <>
            {shown && <Opener />}
            <button onClick={() => setShown(false)}>Remove opener</button>
        </>
    );
}

describe("ContactProvider", () => {
    it("renders no dialog until opened, then exactly one", async () => {
        render(
            <ContactProvider>
                <Opener />
            </ContactProvider>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
        await userEvent.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getAllByRole("dialog", { name: "Contact Us" })).toHaveLength(1);
    });

    it("returns focus to the opener when the close button is used", async () => {
        render(
            <ContactProvider>
                <Opener />
            </ContactProvider>,
        );
        const opener = screen.getByRole("button", { name: "Open" });
        await userEvent.click(opener);
        await userEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(screen.queryByRole("dialog")).toBeNull();
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it("returns focus to the opener when Esc is used", async () => {
        render(
            <ContactProvider>
                <Opener />
            </ContactProvider>,
        );
        const opener = screen.getByRole("button", { name: "Open" });
        await userEvent.click(opener);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it("falls back to the focused element when no opener is passed", async () => {
        render(
            <ContactProvider>
                <OpenerNoArg />
            </ContactProvider>,
        );
        const opener = screen.getByRole("button", { name: "Open no arg" });
        opener.focus();
        await userEvent.click(opener);
        await userEvent.click(screen.getByRole("button", { name: "Close" }));
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it("does not throw or move focus when the opener is gone", async () => {
        render(
            <ContactProvider>
                <RemovableOpener />
            </ContactProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "Open" }));
        await userEvent.click(screen.getByRole("button", { name: "Remove opener" }));
        expect(screen.queryByRole("button", { name: "Open" })).toBeNull();
        await userEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(document.body).toHaveFocus();
    });

    it("shows the empty form when opened again", async () => {
        render(
            <ContactProvider>
                <Opener />
            </ContactProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "Open" }));
        await userEvent.type(screen.getByLabelText("Name"), "Jordan");
        await userEvent.click(screen.getByRole("button", { name: "Close" }));
        await userEvent.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getByLabelText("Name")).toHaveValue("");
    });

    it("puts the home page path in the hidden field", async () => {
        mockPathname = "/";
        render(
            <ContactProvider>
                <OpenerNoArg />
            </ContactProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "Open no arg" }));
        expect(sourcePathValue()).toBe("/");
    });

    it("reads the path again each time the popup opens", async () => {
        mockPathname = "/web-development";
        const { rerender } = render(
            <ContactProvider>
                <OpenerNoArg />
            </ContactProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "Open no arg" }));
        expect(sourcePathValue()).toBe("/web-development");
        await userEvent.click(screen.getByRole("button", { name: "Close" }));

        mockPathname = "/about";
        rerender(
            <ContactProvider>
                <OpenerNoArg />
            </ContactProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "Open no arg" }));
        expect(sourcePathValue()).toBe("/about");
    });

    it("throws outside a provider", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<Opener />)).toThrow(/ContactProvider/);
        error.mockRestore();
    });
});
