// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 015: Esc closes the Contact Us popup wherever focus is. Playwright's
// loader here fails on TypeScript type annotations, so callbacks rely on
// contextual typing.
test.describe("Esc closes the Contact Us popup", () => {
    test("closes the form", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
    });

    test("discards typed text, so reopening shows the empty form", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByLabel("Full name")).toHaveValue("");
    });

    test("closes the confirmation, and reopening shows the form", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.getByLabel("Work email").fill("jordan@example.com");
        await page.getByLabel("Company website").fill("example.com");
        await page.getByLabel("Primary need").selectOption("Web Development");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByRole("heading", { name: "Request received" })).not.toBeVisible();
        await expect(page.getByLabel("Full name")).toHaveValue("");
    });

    test("works after opening from the keyboard, with focus still on the page", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
    });

    test("works with focus in a field", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Work email").focus();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
    });

    test("works with focus on the Close and Send buttons, and sends nothing", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByRole("button", { name: "Close" }).focus();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();

        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.getByLabel("Work email").fill("jordan@example.com");
        await page.getByLabel("Company website").fill("example.com");
        await page.getByLabel("Primary need").selectOption("Web Development");
        await page.getByRole("button", { name: "Send" }).focus();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
        await expect(page.getByRole("heading", { name: "Request received" })).toHaveCount(0);
    });

    for (const path of ["/", "/web-development"]) {
        test(`does nothing while the popup is closed on ${path}`, async ({ page }) => {
            await page.goto(path);
            await page.keyboard.press("Escape");
            await expect(page.getByRole("dialog")).toHaveCount(0);
            await expect(page).toHaveURL(new RegExp(`${path}$`));
        });
    }

    test("the first Esc closes only the open Primary need list", async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "chromium", "Only desktop Chromium opens the native list headless");
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Primary need").click();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog", { name: "Contact Us" })).not.toBeVisible();
    });
});
