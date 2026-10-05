// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PRIMARY_NEED_GROUPS, PRIMARY_NEED_OTHER } from "./primary-need-options";

export interface ContactRequest {
    fullName: string;
    workEmail: string;
    companyWebsite: string;
    primaryNeed: string;
}

export interface ContactPopupProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (request: ContactRequest) => void;
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Implements the props/state/behavior contract from
// specs/001-homepage-contact-us/contracts/ui-contracts.md.
export function ContactPopup({ open, onClose, onSubmit }: ContactPopupProps) {
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // FR-013: reopening the popup always resets to the empty form state.
    // FR-023: the submit control must be enabled whenever the popup opens.
    useEffect(() => {
        if (open) {
            setSent(false);
            setSubmitting(false);
            formRef.current?.reset();
        }
    }, [open]);

    // Spec 036: when the confirmation appears, OK gets the focus. It is done here
    // and not with autoFocus because the form's Send button was just clicked: after
    // a mouse click the browser would not count a focus set by script as
    // keyboard-visible, so the focus ring would be missing. focusVisible asks for
    // the ring; the .an-contact-confirmation__ok:focus rule backs it up where the
    // option is unsupported.
    useEffect(() => {
        if (!open || !sent) return;
        panelRef.current
            ?.querySelector<HTMLElement>(".an-contact-confirmation__ok")
            ?.focus({ focusVisible: true } as FocusOptions);
    }, [open, sent]);

    // Spec 015: Esc is one more way to close the popup and calls the same
    // onClose as the close button. The listener is on the document because focus
    // may still be on the trigger behind the scrim. It stands aside when another
    // handler used the key, when an input method is composing, and while the
    // "Primary need" list is expanded (Chromium sends no Esc to the page then;
    // Firefox does, so the :open check is what keeps the list's Esc its own).
    useEffect(() => {
        if (!open) return;
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
            let listOpen = false;
            try {
                listOpen = Boolean(document.getElementById("primaryNeed")?.matches(":open"));
            } catch {
                // Browsers that do not know :open throw a SyntaxError; treat as closed.
            }
            if (listOpen) return;
            onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    // Keyboard focus stays inside the popup. Tab and Shift+Tab cycle through the
    // popup's controls with Close last, so Tab after the Send button reaches
    // Close, and Tab after Close wraps to the first form field. If focus is
    // somewhere else (the page behind the popup), the next Tab brings it in.
    useEffect(() => {
        if (!open) return;
        function handleTab(event: KeyboardEvent) {
            if (event.key !== "Tab" || event.defaultPrevented || event.isComposing) return;
            const panel = panelRef.current;
            if (!panel) return;
            const close = panel.querySelector<HTMLElement>(".an-contact-header__close");
            const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el !== close);
            if (close) items.push(close);
            if (items.length === 0) return;
            event.preventDefault();
            const index = items.indexOf(document.activeElement as HTMLElement);
            const step = event.shiftKey ? -1 : 1;
            const next =
                index === -1 ? (event.shiftKey ? items.length - 1 : 0) : (index + step + items.length) % items.length;
            items[next].focus();
        }
        document.addEventListener("keydown", handleTab);
        return () => document.removeEventListener("keydown", handleTab);
    }, [open]);

    // The page behind the popup is made inert while it is open, so nothing there
    // can take focus (keyboard, click, or script) and screen readers skip it.
    // The siblings of the popup's scrim are the page; their prior state is put
    // back on close.
    useEffect(() => {
        if (!open) return;
        const scrim = panelRef.current?.closest(".an-contact-scrim");
        const siblings = Array.from(scrim?.parentElement?.children ?? []).filter(
            (el): el is HTMLElement => el instanceof HTMLElement && el !== scrim && !el.inert,
        );
        for (const el of siblings) el.inert = true;
        return () => {
            for (const el of siblings) el.inert = false;
        };
    }, [open]);

    if (!open) {
        return null;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // FR-023: disable the submit control immediately on a valid "Send"
        // activation to prevent duplicate submissions.
        setSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const request: ContactRequest = {
            fullName: String(formData.get("fullName") ?? ""),
            workEmail: String(formData.get("workEmail") ?? ""),
            companyWebsite: String(formData.get("companyWebsite") ?? ""),
            primaryNeed: String(formData.get("primaryNeed") ?? ""),
        };

        // FR-018: no network request is made; this demonstrates the full
        // request/confirmation experience client-side only.
        onSubmit?.(request);
        setSent(true);
    }

    return (
        <div className="an-contact-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label="Contact Us">
            <div ref={panelRef} className="an-contact-panel" onClick={(event) => event.stopPropagation()}>
                <div className="an-contact-header">
                    <div aria-hidden="true" className="an-contact-header__glow" />
                    {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset, no next/image optimization needed for static export */}
                    <img src="/logo/logo-gold.svg" alt="" className="an-contact-header__logo" />
                    <div className="an-contact-header__title">Contact Us</div>
                    <button onClick={onClose} aria-label="Close" className="an-contact-header__close">
                        <X size={22} strokeWidth={3} aria-hidden="true" />
                    </button>
                </div>

                {sent ? (
                    <div className="an-contact-confirmation">
                        <div className="an-contact-confirmation__icon">
                            <Check size={28} strokeWidth={2.5} aria-hidden="true" />
                        </div>
                        <h3 className="an-contact-confirmation__heading">Request received</h3>
                        <p className="an-contact-confirmation__body">
                            Thanks for reaching out. A strategist will review your site and contact you soon.
                        </p>
                        <Button variant="accent" size="lg" className="an-contact-confirmation__ok" onClick={onClose}>
                            OK
                        </Button>
                    </div>
                ) : (
                    <form ref={formRef} className="an-contact-form" onSubmit={handleSubmit}>
                        {/* The form mounts each time the popup opens, so autoFocus moves keyboard focus into the dialog. */}
                        <Input name="fullName" label="Full name" placeholder="Jordan Reyes" required autoFocus />
                        <Input
                            name="workEmail"
                            label="Work email"
                            type="email"
                            inputMode="email"
                            placeholder="you@company.com"
                            required
                        />
                        <Input name="companyWebsite" label="Company website" placeholder="company.com" required />
                        <div className="an-field">
                            <label className="an-label" htmlFor="primaryNeed">
                                Primary need
                            </label>
                            <select id="primaryNeed" name="primaryNeed" className="an-input" defaultValue="" required>
                                <option value="" disabled>
                                    Select a service…
                                </option>
                                {PRIMARY_NEED_GROUPS.map((group) => (
                                    <optgroup key={group.label} label={group.label}>
                                        {group.options.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                                <option value={PRIMARY_NEED_OTHER}>{PRIMARY_NEED_OTHER}</option>
                            </select>
                        </div>
                        <p className="an-contact-form__note">
                            No obligation. We never share your personal information.{" "}
                            <span className="an-contact-form__legal">
                                <a href="#privacy">Privacy</a> | <a href="#terms">Terms</a>
                            </span>
                        </p>
                        <Button
                            type="submit"
                            variant="accent"
                            size="lg"
                            rightIcon={<ArrowRight size={18} aria-hidden="true" />}
                            disabled={submitting}
                        >
                            Send
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
