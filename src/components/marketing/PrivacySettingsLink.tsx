// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import type { MouseEvent, ReactNode } from "react";

// Spec 081: the Privacy Settings link in the footer's Company column opens the Cookiebot banner again, so a visitor can
// change their consent from any page. Cookiebot's own snippet is `<a onclick="window.Cookiebot.renew()" href="#">`; here
// the click is handled by React and its default is prevented, so the page does not jump to the top. When Cookiebot has
// not loaded (blocked by the browser, or stubbed in the tests), the click does nothing. Spec 083: the Do Not Sell or
// Share My Personal Information link under the copyright line is the same control with other text and class, so the two
// links behave exactly alike.
declare global {
    interface Window {
        Cookiebot?: { renew: () => void };
    }
}

export function PrivacySettingsLink({ className, children }: { className?: string; children: ReactNode }) {
    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.Cookiebot?.renew();
    };
    return (
        <a href="#" className={className} onClick={onClick}>
            {children}
        </a>
    );
}
