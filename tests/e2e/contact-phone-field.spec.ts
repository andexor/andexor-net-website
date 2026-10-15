// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 068: the Contact Us form gains an optional Phone number field, Company website becomes optional,
// and required labels end with an asterisk. Since spec 070 removed Primary need, the form is Full name,
// Work email, Phone number, Company website.

async function openPopup(page) {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
}

test.describe("Contact phone field", () => {
    test("shows an optional telephone field between Work email and Company website", async ({ page }) => {
        await openPopup(page);
        const phone = page.getByLabel("Phone number");
        await expect(phone).toBeVisible();
        await expect(phone).toHaveAttribute("type", "tel");
        const emailBox = await page.getByLabel("Work email").boundingBox();
        const phoneBox = await phone.boundingBox();
        const websiteBox = await page.getByLabel("Company website").boundingBox();
        expect(phoneBox.y).toBeGreaterThan(emailBox.y);
        expect(websiteBox.y).toBeGreaterThan(phoneBox.y);
    });

    test("Tab goes from Work email to Phone number, then Company website", async ({ page }) => {
        await openPopup(page);
        await page.waitForFunction(() => document.hasFocus(), undefined, { timeout: 5000 });
        await page.getByLabel("Work email").focus();
        await page.keyboard.press("Tab");
        await expect(page.getByLabel("Phone number")).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.getByLabel("Company website")).toBeFocused();
    });

    test("sends with the phone number filled, and clears it on reopen", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.getByLabel("Work email").fill("jordan@example.com");
        await page.getByLabel("Phone number").fill("+1 212 555 0100");
        await page.getByLabel("Company website").fill("example.com");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();

        await page.getByRole("button", { name: "OK" }).click();
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByLabel("Phone number")).toHaveValue("");
    });
});

test.describe("Optional fields", () => {
    test("sends with Phone number and Company website blank", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.getByLabel("Work email").fill("jordan@example.com");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
    });

    test("still stops a send with Work email blank", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).not.toBeVisible();
        expect(await page.getByLabel("Work email").evaluate((el) => el.validity.valueMissing)).toBe(true);
    });

    // Spec 070: the Primary need list is gone.
    test("has no Primary need field", async ({ page }) => {
        await openPopup(page);
        await expect(page.getByLabel("Primary need")).toHaveCount(0);
    });
});

test.describe("Required marks", () => {
    // Input builds each id from its label.
    const required = ["an-full-name", "an-work-email"];
    const optional = ["an-phone-number", "an-company-website"];

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
        await expect(page.getByLabel("Full name", { exact: true })).toBeVisible();
        await expect(page.getByLabel("Work email", { exact: true })).toBeVisible();
    });

    test("focuses the field when the asterisk is clicked", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Work email").focus();
        await page.locator('label[for="an-full-name"] .an-label__required').click();
        await expect(page.getByLabel("Full name")).toBeFocused();
    });
});
