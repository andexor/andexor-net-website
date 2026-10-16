// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import {
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactNode,
    type TextareaHTMLAttributes,
    useState,
} from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: string;
    error?: string;
}

interface FieldCounter {
    id?: string;
    length: number;
    max: number;
}

// The label, required mark, and hint or error line shared by Input and Textarea (spec 073), so the two cannot drift.
// With a counter, the label shares a strip with "X/max" at its right, and the strip's background is a progress bar.
function Field({
    label,
    hint,
    error,
    fieldId,
    required,
    counter,
    children,
}: {
    label?: string;
    hint?: string;
    error?: string;
    fieldId?: string;
    required?: boolean;
    counter?: FieldCounter;
    children: ReactNode;
}) {
    const labelElement = label && (
        <label className="an-label" htmlFor={fieldId}>
            {/* Spec 068: a required field's label ends with an asterisk, drawn by CSS from this empty,
                aria-hidden span, so the label's text and the field's accessible name stay the label alone.
                Screen readers already announce the required state. */}
            {label}
            {required && <span className="an-label__required" aria-hidden="true" />}
        </label>
    );
    const share = counter ? Math.min(1, counter.length / counter.max) : 0;
    return (
        <div className="an-field">
            {counter ? (
                <div
                    className="an-field__head"
                    style={{ "--an-fill": `${share * 100}%` } as CSSProperties}
                    data-near-limit={share >= 0.9 ? "" : undefined}
                >
                    {labelElement}
                    <span id={counter.id} className="an-field__counter">{`${counter.length}/${counter.max}`}</span>
                </div>
            ) : (
                labelElement
            )}
            {children}
            {error ? (
                <span className="an-hint an-hint--error">{error}</span>
            ) : hint ? (
                <span className="an-hint">{hint}</span>
            ) : null}
        </div>
    );
}

function idFromLabel(id?: string, label?: string) {
    return id || (label ? `an-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
}

function controlClass(error?: string, className = "") {
    return ["an-input", error && "an-input--invalid", className].filter(Boolean).join(" ");
}

export function Input({ label, hint, error, id, required, className = "", ...rest }: InputProps) {
    const fieldId = idFromLabel(id, label);
    return (
        <Field label={label} hint={hint} error={error} fieldId={fieldId} required={required}>
            <input
                id={fieldId}
                className={controlClass(error, className)}
                aria-invalid={error ? "true" : undefined}
                required={required}
                {...rest}
            />
        </Field>
    );
}

// Spec 073: a multi-line field that looks and behaves like Input (same an-input class). With maxLength, the browser
// stops input at the limit, and the label strip shows "X/maxLength" and fills like a progress bar. The count is the
// text's length, the same unit the browser's limit uses.
export function Textarea({
    label,
    hint,
    error,
    id,
    required,
    className = "",
    maxLength,
    onChange,
    ...rest
}: TextareaProps) {
    const fieldId = idFromLabel(id, label);
    const [length, setLength] = useState(() => String(rest.value ?? rest.defaultValue ?? "").length);
    const counterId = fieldId ? `${fieldId}-count` : undefined;
    const counter = maxLength === undefined ? undefined : { id: counterId, length, max: maxLength };
    return (
        <Field label={label} hint={hint} error={error} fieldId={fieldId} required={required} counter={counter}>
            <textarea
                id={fieldId}
                className={controlClass(error, className)}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={counter ? counterId : undefined}
                required={required}
                maxLength={maxLength}
                onChange={(event) => {
                    setLength(event.currentTarget.value.length);
                    onChange?.(event);
                }}
                {...rest}
            />
        </Field>
    );
}
