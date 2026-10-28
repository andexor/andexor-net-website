// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { useEffect } from "react";

const DIALOG_ID = "CybotCookiebotDialog";
// The visible Close button has this class and no id. The element with the id ending in E2E is a hidden copy.
const CLOSE_BUTTON_CLASS = "CybotCookiebotBannerCloseButton";

function dialogIsShowing(): boolean {
    const dialog = document.getElementById(DIALOG_ID);
    return !!dialog && getComputedStyle(dialog).display !== "none";
}

function findCloseButton(): HTMLElement | undefined {
    const buttons = document.querySelectorAll<HTMLElement>("#" + DIALOG_ID + " ." + CLOSE_BUTTON_CLASS);
    return Array.from(buttons).find((button) => getComputedStyle(button).display !== "none");
}

// Spec 084: Esc closes the Cookiebot dialog by clicking its own Close button, so the result is exactly what the button
// gives. The dialog is added by Cookiebot's script outside React, so this listens on the document. The key and click
// listeners exist only while the dialog is showing: they are added when Cookiebot reports the dialog displayed (or when
// it is already showing), and removed when the Close button is clicked (by the visitor or by Esc), when an action
// button is used, and on cleanup. It stands aside when another handler used the key and when an input method is
// composing, as the Contact Us popup does (spec 015).
export function CookiebotEscape() {
    useEffect(() => {
        let active = false;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
            if (!dialogIsShowing()) {
                stop();
                return;
            }
            const close = findCloseButton();
            if (!close) return;
            event.preventDefault();
            close.click();
        }

        function handleClick(event: MouseEvent) {
            if (event.target instanceof Element && event.target.closest("." + CLOSE_BUTTON_CLASS)) stop();
        }

        function start() {
            if (active) return;
            active = true;
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("click", handleClick, true);
        }

        function stop() {
            if (!active) return;
            active = false;
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("click", handleClick, true);
        }

        window.addEventListener("CookiebotOnDialogDisplay", start);
        window.addEventListener("CookiebotOnAccept", stop);
        window.addEventListener("CookiebotOnDecline", stop);
        if (dialogIsShowing()) start();

        return () => {
            window.removeEventListener("CookiebotOnDialogDisplay", start);
            window.removeEventListener("CookiebotOnAccept", stop);
            window.removeEventListener("CookiebotOnDecline", stop);
            stop();
        };
    }, []);

    return null;
}
