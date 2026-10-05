// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { Metadata } from "next";
import { ContentPage } from "@/components/content/ContentPage";

export const metadata: Metadata = {
    title: "Page not found | Andexor Network",
    description: "Page not found",
    // Every unknown address is served by this page, so keep them out of search
    // results (spec 030). Renders <meta name="robots" content="noindex, nofollow">.
    robots: { index: false, follow: false },
};

// Replaces the framework's default 404, which injects its own light
// `body { background: #fff }` and would break the always-dark rule. It uses the
// Web Development page's hero with the 404 image and no cards, eyebrow, or backdrop pattern
// (specs/006-not-found-page-style). The address is never redirected: the static
// server answers unknown addresses with this page and a 404 status.
export default function NotFound() {
    return (
        <ContentPage
            html=""
            cards={{
                image: {
                    src: "/404.png",
                    alt: "Gold isometric laptop showing 404 next to a magnifying glass with a question mark",
                },
                headingHtml: "Page not found",
                introHtml: `<p>We could not find that page. <a href="/">Go to the home page</a>.</p>`,
                cardsHtml: "",
            }}
        />
    );
}
