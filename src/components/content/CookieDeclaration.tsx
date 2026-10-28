// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { useEffect } from "react";

// Spec 082: adds Cookiebot's Cookie Declaration script to the empty slot that src/lib/content.ts leaves at the
// `<!-- cookie-declaration -->` marker, once the page has hydrated. Cookiebot's script writes the declaration beside its
// own element, and if that happens before hydration, React finds a different page than the server sent (error #418).
// The slot's id and `data-src` are set by the marker; a page with no marker has no slot, and this does nothing.
export function CookieDeclaration() {
    useEffect(() => {
        const slot = document.getElementById("cookie-declaration-slot");
        const src = slot?.getAttribute("data-src");
        if (!slot || !src || document.getElementById("CookieDeclaration")) return;

        const toTrustedCookieDeclarationSrc = (value: string): string | null => {
            try {
                const url = new URL(value, window.location.origin);
                const isHttps = url.protocol === "https:";
                const isTrustedHost = url.hostname === "consent.cookiebot.com";
                const isTrustedPath = url.pathname.endsWith("/cd.js");
                return isHttps && isTrustedHost && isTrustedPath ? url.toString() : null;
            } catch {
                return null;
            }
        };

        const trustedSrc = toTrustedCookieDeclarationSrc(src);
        if (!trustedSrc) return;

        const script = document.createElement("script");
        script.id = "CookieDeclaration";
        script.src = trustedSrc;
        script.type = "text/javascript";
        script.async = true;
        slot.appendChild(script);
    }, []);
    return null;
}
