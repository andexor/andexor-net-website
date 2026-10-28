// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Spec 087: the Contact Us form is delivered to the contact service, a web service in a separate repository.
// The request and answer the two sides agree on are in specs/087-contact-form-submit/contracts/contact-service.md.
// This is the only place in the site that spells the address out.

export interface ContactRequest {
    name: string;
    email: string;
    phone: string;
    website: string;
    help: string;
    // Spec 071: the path of the page that opened the popup, not entered by the visitor.
    sourcePath: string;
}

// Fully qualified, as the owner asked, so a local run also sends to the live service.
export const CONTACT_SERVICE_URL = "https://andexor.net/api/contact";

// A request still unanswered after this long is treated as failed (spec 001 SC-003).
export const CONTACT_TIMEOUT_MS = 10_000;

// Posts one request. Resolves when the service answers 200; the body of the answer is never read. Rejects on any
// other status, when the request cannot be sent (network down, CORS refused), when `signal` aborts, and after
// CONTACT_TIMEOUT_MS.
export async function sendContactRequest(request: ContactRequest, signal?: AbortSignal): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
    const abortFromCaller = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener("abort", abortFromCaller);
    try {
        const response = await fetch(CONTACT_SERVICE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "omit",
            body: JSON.stringify(request),
            signal: controller.signal,
        });
        if (response.status !== 200) {
            throw new Error(`The contact service answered with status ${response.status}`);
        }
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abortFromCaller);
    }
}
