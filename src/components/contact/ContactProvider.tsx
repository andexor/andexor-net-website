// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ContactPopup } from "./ContactPopup";

interface ContactContextValue {
    // Opens the one Contact Us popup. `opener` is the control to give focus back
    // to on close; the footer button passes itself because Safari and Firefox on
    // macOS do not focus a button when it is clicked. Other triggers omit it and
    // the focused element is used.
    openContact: (opener?: HTMLElement | null) => void;
}

const ContactContext = createContext<ContactContextValue | null>(null);

// Spec 014: the Contact Us popup is rendered once, in the root layout, so every
// page that shows the footer (home, content pages, not-found) can open it.
export function ContactProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const returnFocusRef = useRef<HTMLElement | null>(null);

    const openContact = useCallback((opener?: HTMLElement | null) => {
        returnFocusRef.current =
            opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
        setOpen(true);
    }, []);

    const closeContact = useCallback(() => {
        setOpen(false);
    }, []);

    // Runs after the popup has unmounted, so the opener can take focus back.
    useEffect(() => {
        if (open) return;
        const opener = returnFocusRef.current;
        returnFocusRef.current = null;
        if (opener && opener.isConnected) opener.focus();
    }, [open]);

    const value = useMemo(() => ({ openContact }), [openContact]);

    return (
        <ContactContext.Provider value={value}>
            {children}
            <ContactPopup open={open} onClose={closeContact} />
        </ContactContext.Provider>
    );
}

export function useContact(): ContactContextValue {
    const value = useContext(ContactContext);
    if (!value) {
        throw new Error("useContact must be used inside ContactProvider");
    }
    return value;
}
