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

// Implements the props/state/behavior contract from
// specs/001-homepage-contact-us/contracts/ui-contracts.md.
export function ContactPopup({ open, onClose, onSubmit }: ContactPopupProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // FR-013: reopening the popup always resets to the empty form state.
  // FR-023: the submit control must be enabled whenever the popup opens.
  useEffect(() => {
    if (open) {
      setSent(false);
      setSubmitting(false);
      formRef.current?.reset();
    }
  }, [open]);

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
      <div className="an-contact-panel" onClick={(event) => event.stopPropagation()}>
        <div className="an-contact-header">
          <div aria-hidden="true" className="an-contact-header__glow" />
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset, no next/image optimization needed for static export */}
          <img src="/logo/logo-gold.svg" alt="" className="an-contact-header__logo" />
          <div className="an-contact-header__title">Contact Us</div>
          <button onClick={onClose} aria-label="Close" className="an-contact-header__close">
            <X size={20} aria-hidden="true" />
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
            <Button variant="primary" className="an-contact-confirmation__done" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form ref={formRef} className="an-contact-form" onSubmit={handleSubmit}>
            <Input name="fullName" label="Full name" placeholder="Jordan Reyes" required />
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
            <Button
              type="submit"
              variant="accent"
              block
              size="lg"
              rightIcon={<ArrowRight size={18} aria-hidden="true" />}
              disabled={submitting}
            >
              Send
            </Button>
            <p className="an-contact-form__note">
              No obligation. We never share your personal information.{" "}
              <span className="an-contact-form__legal">
                <a href="#privacy">Privacy</a> | <a href="#terms">Terms</a>
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
