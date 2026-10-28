// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    CONTACT_SERVICE_URL,
    CONTACT_TIMEOUT_MS,
    type ContactRequest,
    sendContactRequest,
} from "@/lib/contact-service";

const request: ContactRequest = {
    name: "Jordan Reyes",
    email: "jordan@example.com",
    phone: "",
    website: "example.com",
    help: "",
    sourcePath: "/web-development",
};

// Spec 087, contracts/contact-service.md.
describe("sendContactRequest", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        fetchMock.mockReset();
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    // The Playwright fixture (tests/e2e/fixtures.ts) repeats this literal, because e2e files do not import site code.
    it("uses the fully-qualified service address", () => {
        expect(CONTACT_SERVICE_URL).toBe("https://andexor.net/api/contact");
    });

    it("posts the six fields as JSON, without credentials, and resolves on 200", async () => {
        fetchMock.mockResolvedValue(new Response("", { status: 200 }));

        await expect(sendContactRequest(request)).resolves.toBeUndefined();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe(CONTACT_SERVICE_URL);
        expect(init.method).toBe("POST");
        expect(init.headers).toEqual({ "Content-Type": "application/json" });
        expect(init.credentials).toBe("omit");
        expect(JSON.parse(init.body)).toEqual(request);
    });

    it.each([201, 400, 500])("rejects on status %i", async (status) => {
        fetchMock.mockResolvedValue(new Response("", { status }));
        await expect(sendContactRequest(request)).rejects.toThrow(String(status));
    });

    it("rejects when the request cannot be sent", async () => {
        fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
        await expect(sendContactRequest(request)).rejects.toThrow("Failed to fetch");
    });

    it("aborts and rejects when the service does not answer within the limit", async () => {
        vi.useFakeTimers();
        fetchMock.mockImplementation(
            (_url: string, init: RequestInit) =>
                new Promise((_resolve, reject) => {
                    init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
                }),
        );

        const pending = sendContactRequest(request);
        const failure = expect(pending).rejects.toThrow("Aborted");
        await vi.advanceTimersByTimeAsync(CONTACT_TIMEOUT_MS);
        await failure;
        expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(true);
    });

    it("aborts the request when the caller's signal aborts", async () => {
        fetchMock.mockImplementation(
            (_url: string, init: RequestInit) =>
                new Promise((_resolve, reject) => {
                    init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
                }),
        );
        const controller = new AbortController();

        const pending = sendContactRequest(request, controller.signal);
        controller.abort();

        await expect(pending).rejects.toThrow("Aborted");
    });
});
