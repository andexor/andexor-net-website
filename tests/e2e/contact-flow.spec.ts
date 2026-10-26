// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "./fixtures";

// User Story 2 Acceptance Scenarios 1-6, and User Story 3 Acceptance
// Scenarios 1-2 (spec.md).
test.describe("Contact request flow", () => {
    test("opens from the Contact Us button in the call-to-action band", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
        await expect(page.getByLabel("Name")).toBeVisible();
        await expect(page.getByLabel("Email")).toBeVisible();
        await expect(page.getByLabel("Phone")).toBeVisible();
        await expect(page.getByLabel("Website")).toBeVisible();
    });

    test("opens the same popup from the CTA band Contact Us button", async ({ page }) => {
        await page.goto("/");
        await page.locator(".an-cta-band").getByRole("button", { name: "Contact Us" }).click();
        await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
    });

    test("blocks submission and indicates the offending field when required fields are empty", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByRole("button", { name: "Send" }).click();
        // Confirmation must not appear; the browser's native validation UI
        // keeps focus on the first invalid field instead.
        await expect(page.getByRole("heading", { name: "Request received" })).not.toBeVisible();
        const name = page.getByLabel("Name");
        // @ts-expect-error - Locator.evaluate's element param type doesn't include form validity
        const isInvalid = await name.evaluate((el) => !el.validity.valid);
        expect(isInvalid).toBe(true);
    });

    test("submitting with all required fields completed shows the confirmation without navigating away", async ({
        page,
    }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByLabel("Email").fill("jordan@example.com");
        await page.getByLabel("Website").fill("example.com");
        await page.getByRole("button", { name: "Send" }).click();

        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
        expect(page.url()).toContain("/");
    });

    test('"OK" closes the popup', async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByLabel("Email").fill("jordan@example.com");
        await page.getByLabel("Website").fill("example.com");
        await page.getByRole("button", { name: "Send" }).click();
        await page.getByRole("button", { name: "OK" }).click();
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
    });

    test("scrim click and × control both close the popup without submitting", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("button", { name: "Contact Us" }).first().click();
        // Click the scrim itself (top-left corner, outside the panel).
        await page.mouse.click(4, 4);
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();

        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByRole("button", { name: "Close" }).click();
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
    });

    test("reopening after a submission shows the empty form, not a stale confirmation", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByLabel("Email").fill("jordan@example.com");
        await page.getByLabel("Website").fill("example.com");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
        await page.getByRole("button", { name: "OK" }).click();

        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByRole("heading", { name: "Request received" })).not.toBeVisible();
        await expect(page.getByLabel("Name")).toHaveValue("");
    });
});
