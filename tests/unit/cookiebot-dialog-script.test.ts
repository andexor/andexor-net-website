// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { COOKIEBOT_DIALOG_SCRIPT } from "../../scripts/format-html";

// Spec 082: Cookiebot adds its dialog to the start of <body>. If React has not hydrated yet, it matches that element to
// the hidden <div> Next.js puts first and fails with error #418. The injected script moves Cookiebot's elements to the
// end of <body> as they are added.
const code = COOKIEBOT_DIALOG_SCRIPT.replace(/^<script>/, "").replace(/<\/script>$/, "");

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const ids = () => Array.from(document.body.children).map((element) => element.id || element.tagName.toLowerCase());

function addAtStart(id: string) {
    const element = document.createElement("div");
    element.id = id;
    document.body.insertBefore(element, document.body.firstChild);
}

// The script keeps its observer to itself, so each test collects the ones it creates and disconnects them afterward.
const OriginalObserver = globalThis.MutationObserver;
const created: MutationObserver[] = [];

describe("Cookiebot dialog script", () => {
    beforeEach(() => {
        globalThis.MutationObserver = class extends OriginalObserver {
            constructor(callback: MutationCallback) {
                super(callback);
                created.push(this);
            }
        };
        document.body.innerHTML = '<div hidden=""></div><div id="top"></div><script></script>';
        new Function(code)();
    });

    afterEach(() => {
        created.splice(0).forEach((observer) => observer.disconnect());
        globalThis.MutationObserver = OriginalObserver;
    });

    it("keeps the page's own first element first when Cookiebot adds its dialog at the start of the body", async () => {
        addAtStart("CybotCookiebotDialogBodyUnderlay");
        addAtStart("CybotCookiebotDialog");
        await tick();
        expect(ids().slice(0, 2)).toEqual(["div", "top"]);
        expect(ids().slice(-2).sort()).toEqual(["CybotCookiebotDialog", "CybotCookiebotDialogBodyUnderlay"]);
    });

    it("leaves a Cookiebot element that is already last, and other elements at the start, where they are", async () => {
        const dialog = document.createElement("div");
        dialog.id = "CybotCookiebotDialog";
        document.body.appendChild(dialog);
        addAtStart("something-else");
        await tick();
        expect(ids()).toEqual(["something-else", "div", "top", "script", "CybotCookiebotDialog"]);
    });
});
