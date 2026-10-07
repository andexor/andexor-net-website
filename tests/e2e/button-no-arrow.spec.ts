// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 056: the Contact Us button in the call-to-action band and the Send button in the popup show only their labels,
// centered, with no icon. These check the buttons that are found, not how many there are. Playwright's loader here fails
// on TypeScript type annotations, so none are used.
const read = (button) =>
    button.evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const text = range.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        return {
            icons: el.querySelectorAll("svg").length,
            offset: Math.abs(text.left + text.width / 2 - (box.left + box.width / 2)),
        };
    });

test.describe("Buttons without arrows", () => {
    test("Contact Us and Send show only a centered label", async ({ page }) => {
        await page.goto("/");
        const contact = page.locator(".an-cta-band__button-wrap button");
        const contactLook = await read(contact);
        expect(contactLook.icons, "Contact Us has no icon").toBe(0);
        expect(contactLook.offset, "Contact Us label is centered").toBeLessThanOrEqual(1);

        await contact.click();
        const send = page.getByRole("button", { name: "Send" });
        await expect(send).toBeVisible();
        const sendLook = await read(send);
        expect(sendLook.icons, "Send has no icon").toBe(0);
        expect(sendLook.offset, "Send label is centered").toBeLessThanOrEqual(1);
    });
});
