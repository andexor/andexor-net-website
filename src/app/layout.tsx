// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";

// Spec 042: the stylesheet is imported above, so FontAwesome must not inject its own at runtime.
config.autoAddCss = false;

export const metadata: Metadata = {
    // The defaults are the home page's (specs 028, 029): the title and meta
    // description are the headline text, and the title adds " | Andexor Network".
    // The not-found page and the content pages set their own.
    title: "Enterprise services for small business | Andexor Network",
    description: "Enterprise services for small business",
    manifest: "/site.webmanifest",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png" }],
    },
};

// FR-024: wait up to 3 seconds for the custom fonts to load before painting
// text in them; if they aren't ready in time, permanently commit to the
// system-font fallback for this page view (never swap later). This script
// must run before first paint, so it stays a plain inline <script>, not a
// deferred/async one. See src/styles/fonts.css for the CSS half of this.
const FONT_LOADER_SCRIPT = `
(function () {
    var docEl = document.documentElement;
    function decide(ready) {
        docEl.classList.add(ready ? "fonts-ready" : "fonts-fallback");
    }
    if (!("fonts" in document)) {
        decide(true);
        return;
    }
    var settled = false;
    function settle(ready) {
        if (settled) return;
        settled = true;
        decide(ready);
    }
    Promise.all([
        document.fonts.load('700 60px Play'),
        document.fonts.load('400 16px Roboto'),
        document.fonts.load('600 12px "Source Code Pro"'),
    ])
        .then(function () {
            settle(true);
        })
        .catch(function () {
            settle(false);
        });
    setTimeout(function () {
        settle(false);
    }, 3000);
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <script dangerouslySetInnerHTML={{ __html: FONT_LOADER_SCRIPT }} />
                <noscript>
                    <style>{`body { visibility: visible !important; }`}</style>
                </noscript>
            </head>
            <body>
                <ContactProvider>{children}</ContactProvider>
            </body>
        </html>
    );
}
