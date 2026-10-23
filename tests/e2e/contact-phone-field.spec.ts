// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "./fixtures";

// Spec 068: the Contact Us form gains an optional Phone field, Website becomes optional,
// and required labels end with an asterisk. Since spec 070 removed Primary need, the form is Name,
// Email, Phone, Website.

async function openPopup(page) {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
}

test.describe("Contact phone field", () => {
    test("shows an optional telephone field between Email and Website", async ({ page }) => {
        await openPopup(page);
        const phone = page.getByLabel("Phone");
        await expect(phone).toBeVisible();
        await expect(phone).toHaveAttribute("type", "tel");
        const emailBox = await page.getByLabel("Email").boundingBox();
        const phoneBox = await phone.boundingBox();
        const websiteBox = await page.getByLabel("Website").boundingBox();
        expect(phoneBox.y).toBeGreaterThan(emailBox.y);
        expect(websiteBox.y).toBeGreaterThan(phoneBox.y);
    });

    test("Tab goes from Email to Phone, then Website", async ({ page }) => {
        await openPopup(page);
        await page.waitForFunction(() => document.hasFocus(), undefined, { timeout: 5000 });
        await page.getByLabel("Email").focus();
        await page.keyboard.press("Tab");
        await expect(page.getByLabel("Phone")).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.getByLabel("Website")).toBeFocused();
    });

    test("sends with the phone number filled, and clears it on reopen", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByLabel("Email").fill("jordan@example.com");
        await page.getByLabel("Phone").fill("+1 212 555 0100");
        await page.getByLabel("Website").fill("example.com");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();

        await page.getByRole("button", { name: "OK" }).click();
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByLabel("Phone")).toHaveValue("");
    });
});

test.describe("Optional fields", () => {
    test("sends with Phone and Website blank", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByLabel("Email").fill("jordan@example.com");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
    });

    test("still stops a send with Email blank", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).not.toBeVisible();
        expect(await page.getByLabel("Email").evaluate((el) => el.validity.valueMissing)).toBe(true);
    });

    // Spec 070: the Primary need list is gone.
    test("has no Primary need field", async ({ page }) => {
        await openPopup(page);
        await expect(page.getByLabel("Primary need")).toHaveCount(0);
    });
});

test.describe("Required marks", () => {
    // Input builds each id from its label.
    const required = ["an-name", "an-email"];
    const optional = ["an-phone", "an-website", "help"];

    test("shows an asterisk after each required label and none after optional ones", async ({ page }) => {
        await openPopup(page);
        for (const id of required) {
            const label = page.locator(`label[for="${id}"]`);
            const mark = label.locator(".an-label__required");
            await expect(mark, id).toBeVisible();
            // The glyph is CSS content, in the label's own color.
            expect(await mark.evaluate((el) => getComputedStyle(el, "::after").content), id).toBe('"*"');
            const labelColor = await label.evaluate((el) => getComputedStyle(el).color);
            const markColor = await mark.evaluate((el) => getComputedStyle(el, "::after").color);
            expect(markColor, id).toBe(labelColor);
        }
        for (const id of optional) {
            const label = page.locator(`label[for="${id}"]`);
            await expect(label, id).toBeVisible();
            await expect(label.locator(".an-label__required"), id).not.toBeAttached();
        }
    });

    test("keeps the accessible names", async ({ page }) => {
        await openPopup(page);
        await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
        await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
    });

    test("focuses the field when the asterisk is clicked", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Email").focus();
        await page.locator('label[for="an-name"] .an-label__required').click();
        await expect(page.getByLabel("Name")).toBeFocused();
    });
});
