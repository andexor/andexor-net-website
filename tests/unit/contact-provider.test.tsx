// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ContactProvider, useContact } from "@/components/contact/ContactProvider";

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
        await userEvent.type(screen.getByLabelText("Full name"), "Jordan");
        await userEvent.click(screen.getByRole("button", { name: "Close" }));
        await userEvent.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getByLabelText("Full name")).toHaveValue("");
    });

    it("throws outside a provider", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<Opener />)).toThrow(/ContactProvider/);
        error.mockRestore();
    });
});
