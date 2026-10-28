// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "./fixtures";

// Spec 084: Esc closes the Cookiebot dialog by clicking its Close button. Cookiebot is stubbed in the tests (see
// fixtures.ts), so a stand-in dialog with the dialog id and Close button class Cookiebot uses (the button has a class and no id) is added to the page, and the event Cookiebot fires
// when it shows the dialog is dispatched. Playwright's loader here fails on TypeScript type annotations, so callbacks
// rely on contextual typing.
async function showStandInDialog(page) {
    // The component's listeners start in an effect, so wait until React has hydrated the page.
    await page.waitForFunction(() =>
        Array.from(document.body.querySelectorAll("*")).some((el) =>
            Object.keys(el).some((key) => key.startsWith("__reactFiber$")),
        ),
    );
    await page.evaluate(() => {
        const w = window;
        let dialog = document.getElementById("CybotCookiebotDialog");
        if (!dialog) {
            w.__closeClicks = 0;
            dialog = document.createElement("div");
            dialog.id = "CybotCookiebotDialog";
            const close = document.createElement("button");
            close.className = "CybotCookiebotBannerCloseButton";
            close.textContent = "Close";
            close.addEventListener("click", () => {
                w.__closeClicks += 1;
                dialog.style.display = "none";
            });
            dialog.appendChild(close);
            document.body.appendChild(dialog);
        }
        dialog.style.display = "block";
        window.dispatchEvent(new Event("CookiebotOnDialogDisplay"));
    });
}

const closeClicks = (page) => page.evaluate(() => window.__closeClicks);
const dialogHidden = (page) =>
    page.evaluate(() => document.getElementById("CybotCookiebotDialog")?.style.display === "none");

test.describe("Esc closes the Cookiebot dialog", () => {
    test("clicks Close once and the dialog closes, with focus on the page", async ({ page }) => {
        await page.goto("/");
        await showStandInDialog(page);
        await page.keyboard.press("Escape");
        expect(await closeClicks(page)).toBe(1);
        expect(await dialogHidden(page)).toBe(true);
    });

    test("works with focus on the Close button and on a link behind the dialog", async ({ page }) => {
        await page.goto("/");
        await showStandInDialog(page);
        await page.locator(".CybotCookiebotBannerCloseButton").focus();
        await page.keyboard.press("Escape");
        expect(await closeClicks(page)).toBe(1);

        await showStandInDialog(page);
        await page.getByRole("link").first().focus();
        await page.keyboard.press("Escape");
        expect(await closeClicks(page)).toBe(2);
    });

    test("works again when the dialog is shown again", async ({ page }) => {
        await page.goto("/");
        await showStandInDialog(page);
        await page.keyboard.press("Escape");
        await showStandInDialog(page);
        await page.keyboard.press("Escape");
        expect(await closeClicks(page)).toBe(2);
        expect(await dialogHidden(page)).toBe(true);
    });

    test("does nothing before any dialog is shown", async ({ page }) => {
        await page.goto("/");
        await page.keyboard.press("Escape");
        await expect(page).toHaveURL(/\/$/);
        expect(await page.evaluate(() => document.getElementById("CybotCookiebotDialog"))).toBeNull();
    });

    test("does nothing after the Close button is clicked with the mouse", async ({ page }) => {
        await page.goto("/");
        await showStandInDialog(page);
        await page.locator(".CybotCookiebotBannerCloseButton").click();
        expect(await closeClicks(page)).toBe(1);
        // Show the dialog without the display event, so only a leftover listener could react.
        await page.evaluate(() => {
            document.getElementById("CybotCookiebotDialog").style.display = "block";
        });
        await page.keyboard.press("Escape");
        expect(await closeClicks(page)).toBe(1);
    });

    test("does nothing after an action button is used", async ({ page }) => {
        await page.goto("/");
        await showStandInDialog(page);
        await page.evaluate(() => window.dispatchEvent(new Event("CookiebotOnDecline")));
        await page.keyboard.press("Escape");
        expect(await closeClicks(page)).toBe(0);
    });

    test("does nothing while an input method is composing", async ({ page }) => {
        await page.goto("/");
        await showStandInDialog(page);
        await page.evaluate(() => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", isComposing: true }));
        });
        expect(await closeClicks(page)).toBe(0);
    });

    test("a held key closes the dialog once", async ({ page }) => {
        await page.goto("/");
        await showStandInDialog(page);
        await page.keyboard.down("Escape");
        await page.keyboard.down("Escape");
        await page.keyboard.up("Escape");
        expect(await closeClicks(page)).toBe(1);
    });
});
