// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { faArrowUpRightFromSquare, faSquareCheck, faSquareX } from "@awesome.me/kit-0a6c11d394/icons/duotone/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { randomExampleName } from "./example-names";
import { LOGO_ALT } from "@/components/marketing/Logo";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { type ContactRequest, sendContactRequest } from "@/lib/contact-service";

export type { ContactRequest };

export interface ContactPopupProps {
    open: boolean;
    onClose: () => void;
    sourcePath?: string;
    // Spec 087: delivers the request. Resolving means delivered; rejecting means failed. The default posts to the
    // contact service (specs/087-contact-form-submit/contracts/ui-contract.md).
    onSubmit?: (request: ContactRequest) => Promise<void> | void;
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Spec 072: the Name placeholder is a random example name. The form mounts each time the popup is displayed, so
// the name is chosen once per display and stays the same while the visitor types and clears the field.
function FullNameInput() {
    const [exampleName] = useState(randomExampleName);
    return <Input name="name" label="Name" autoComplete="name" placeholder={exampleName} required autoFocus />;
}

// Spec 087: resolves once the form's Send button is drawn in its normal, unpressed state. It waits while the
// button matches :active (mouse button or finger down) or an activation key is held, then one more frame so the
// unpressed state has been painted before the request leaves. Chrome fires click on Enter keydown, so submit can
// run while Enter is still held; Space fires on keyup. Resolves at once if the form is gone (the popup closed).
function whenReleased(form: HTMLFormElement, keyHeld: () => boolean): Promise<void> {
    return new Promise((resolve) => {
        function check() {
            const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
            if (form.isConnected && ((button !== null && button.matches(":active")) || keyHeld())) {
                requestAnimationFrame(check);
                return;
            }
            requestAnimationFrame(() => resolve());
        }
        requestAnimationFrame(check);
    });
}

// Implements the props/state/behavior contract from
// specs/001-homepage-contact-us/contracts/ui-contracts.md, as amended by
// specs/087-contact-form-submit/contracts/ui-contract.md.
export function ContactPopup({ open, onClose, sourcePath = "/", onSubmit = sendContactRequest }: ContactPopupProps) {
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [failed, setFailed] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    // Spec 087: set from the moment Send is activated until the send settles, so a second activation during the
    // release wait is ignored (spec 001 FR-023 asks for no duplicate submissions).
    const busyRef = useRef(false);
    // The request in flight, aborted when the popup closes so a late answer changes nothing (spec 087 FR-008).
    const controllerRef = useRef<AbortController | null>(null);
    // Whether Enter or Space is held, for whenReleased.
    const activationKeyDownRef = useRef(false);

    // FR-013: reopening the popup always resets to the empty form state.
    // FR-023: the submit control must be enabled whenever the popup opens.
    // Spec 087: closing abandons a request in flight.
    useEffect(() => {
        if (open) {
            setSent(false);
            setSubmitting(false);
            setFailed(false);
            formRef.current?.reset();
            return;
        }
        controllerRef.current?.abort();
        controllerRef.current = null;
        busyRef.current = false;
    }, [open]);

    useEffect(() => () => controllerRef.current?.abort(), []);

    // Spec 087: tracks the activation keys while the popup is open, for whenReleased.
    useEffect(() => {
        if (!open) return;
        function track(event: KeyboardEvent) {
            if (event.key !== "Enter" && event.key !== " ") return;
            activationKeyDownRef.current = event.type === "keydown";
        }
        document.addEventListener("keydown", track);
        document.addEventListener("keyup", track);
        return () => {
            activationKeyDownRef.current = false;
            document.removeEventListener("keydown", track);
            document.removeEventListener("keyup", track);
        };
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
    // handler used the key and when an input method is composing.
    useEffect(() => {
        if (!open) return;
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
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

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busyRef.current) return;
        busyRef.current = true;
        setFailed(false);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const request: ContactRequest = {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            website: String(formData.get("website") ?? ""),
            help: String(formData.get("help") ?? ""),
            sourcePath: String(formData.get("sourcePath") ?? ""),
        };

        // Spec 087 FR-003: the visitor sees Send come back up before anything is sent. Send stays enabled and
        // drawn normal during this wait; busyRef keeps a second activation out.
        await whenReleased(form, () => activationKeyDownRef.current);
        if (!form.isConnected) {
            // Closed during the wait: nothing is sent.
            busyRef.current = false;
            return;
        }

        // Spec 001 FR-023: Send is disabled while the request is in flight. A disabled button never looks
        // pressed (.an-btn:disabled sets transform: none, and the pressed rule is :not(:disabled):active).
        setSubmitting(true);
        const controller = new AbortController();
        controllerRef.current = controller;
        try {
            // Spec 087 FR-002: the confirmation follows a 200 from the service, nothing less.
            if (onSubmit === sendContactRequest) await sendContactRequest(request, controller.signal);
            else await onSubmit(request);
            if (controller.signal.aborted) return;
            setSent(true);
        } catch {
            // Spec 087 FR-005: keep the form and the entries, say so, and let the visitor try again.
            if (controller.signal.aborted) return;
            setSubmitting(false);
            setFailed(true);
        } finally {
            if (controllerRef.current === controller) {
                controllerRef.current = null;
                busyRef.current = false;
            }
        }
    }

    return (
        <div className="an-contact-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label="Contact Us">
            <div ref={panelRef} className="an-contact-panel" onClick={(event) => event.stopPropagation()}>
                <div className="an-contact-header">
                    <div aria-hidden="true" className="an-contact-header__glow" />
                    {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset, no next/image optimization needed for static export */}
                    <img src="/logo/logo-gold.svg" alt={LOGO_ALT} className="an-contact-header__logo" />
                    <div className="an-contact-header__title">Contact Us</div>
                    <button onClick={onClose} aria-label="Close" className="an-contact-header__close">
                        <FontAwesomeIcon icon={faSquareX} aria-hidden="true" />
                    </button>
                </div>

                {sent ? (
                    <div className="an-contact-confirmation">
                        <div className="an-contact-confirmation__icon">
                            <FontAwesomeIcon icon={faSquareCheck} aria-hidden="true" />
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
                        <FullNameInput />
                        <Input
                            name="email"
                            label="Email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="you@company.com"
                            required
                        />
                        {/* Spec 068: optional. type="tel" brings up the keypad on phones; no format is enforced. */}
                        <Input
                            name="phone"
                            label="Phone"
                            type="tel"
                            autoComplete="tel-national"
                            placeholder="404-555-1212"
                        />
                        <Input name="website" label="Website" autoComplete="url" placeholder="example.com" />
                        {/* Spec 073: optional, four lines, at most 250 characters with a count. The id is set because the label would make a long one. */}
                        <Textarea id="help" name="help" label="How can we help you?" rows={4} maxLength={250} />
                        {/* Spec 071: not shown and not focusable; carries the page that opened the popup. */}
                        <input type="hidden" name="sourcePath" value={sourcePath} />
                        <p className="an-contact-form__note">
                            We never sell your personal information.{" "}
                            <span className="an-contact-form__legal">
                                {/* Ordinary links, opened in a new tab (spec 065) so the form stays. Each icon follows its link (spec 066). */}
                                <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Privacy, opens in new tab"
                                >
                                    Privacy
                                </a>
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
                                {" | "}
                                <a
                                    href="/terms-of-service"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Terms, opens in new tab"
                                >
                                    Terms
                                </a>
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
                            </span>
                        </p>
                        {/* Spec 087: shown only after a failed send. role="alert" announces it without moving focus. */}
                        {failed && (
                            <p role="alert" className="an-contact-form__note an-contact-form__error">
                                We could not send your request. Please try again.
                            </p>
                        )}
                        <Button type="submit" variant="accent" size="lg" disabled={submitting}>
                            Send
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
