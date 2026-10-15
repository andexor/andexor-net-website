// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
}

export function Input({ label, hint, error, id, required, className = "", ...rest }: InputProps) {
    const fieldId = id || (label ? `an-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
    return (
        <div className="an-field">
            {label && (
                <label className="an-label" htmlFor={fieldId}>
                    {/* Spec 068: a required field's label ends with an asterisk, drawn by CSS from this empty,
                        aria-hidden span, so the label's text and the field's accessible name stay the label alone.
                        Screen readers already announce the required state. */}
                    {label}
                    {required && <span className="an-label__required" aria-hidden="true" />}
                </label>
            )}
            <input
                id={fieldId}
                className={["an-input", error && "an-input--invalid", className].filter(Boolean).join(" ")}
                aria-invalid={error ? "true" : undefined}
                required={required}
                {...rest}
            />
            {error ? (
                <span className="an-hint an-hint--error">{error}</span>
            ) : hint ? (
                <span className="an-hint">{hint}</span>
            ) : null}
        </div>
    );
}
