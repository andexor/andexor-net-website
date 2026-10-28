// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import AxeBuilder from "@axe-core/playwright";
import { expect, stubContactService, test } from "./fixtures";

// Spec 087: the Contact Us form is delivered to the contact service, the confirmation waits for its answer, Send
// is seen to come back up before the request leaves, and a failed send keeps the visitor's entries. The fixture
// answers the service address; each test here registers its own answer, which Playwright tries first.
// Playwright's loader in this repo fails on TypeScript type annotations, so this file relies on contextual typing.

async function openAndFill(page, path = "/") {
    await page.goto(path);
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await page.getByLabel("Name").fill("Jordan Reyes");
    await page.getByLabel("Email").fill("jordan@example.com");
    await page.getByLabel("Website").fill("example.com");
    await page.getByLabel("How can we help you?").fill("A new site.");
}

const heading = (page) => page.getByRole("heading", { name: "Request received" });
const send = (page) => page.getByRole("dialog", { name: "Contact Us" }).getByRole("button", { name: "Send" });

test.describe("Contact request delivery", () => {
    test("posts the six fields to the service and confirms after its answer", async ({ page }) => {
        const bodies = await stubContactService(page.context());
        await openAndFill(page);
        await send(page).click();

        await expect(heading(page)).toBeVisible();
        expect(bodies).toEqual([
            {
                name: "Jordan Reyes",
                email: "jordan@example.com",
                phone: "",
                website: "example.com",
                help: "A new site.",
                sourcePath: "/",
            },
        ]);
    });

    test("sends the path of the page that opened the popup", async ({ page }) => {
        const bodies = await stubContactService(page.context());
        await openAndFill(page, "/web-development");
        await send(page).click();

        await expect(heading(page)).toBeVisible();
        expect(bodies.map((body) => body.sourcePath)).toEqual(["/web-development"]);
    });

    test("keeps the form, with Send disabled, until the service answers", async ({ page }) => {
        await stubContactService(page.context(), { delayMs: 700 });
        await openAndFill(page);
        await send(page).click();

        await expect(send(page)).toBeDisabled();
        await expect(heading(page)).not.toBeVisible();
        await expect(page.getByLabel("Name")).toHaveValue("Jordan Reyes");

        await expect(heading(page)).toBeVisible();
    });

    // FR-003: Enter fires click on keydown in Chromium, so the send must wait for the key to come up.
    test("sends on release of a held Enter key, not while it is held", async ({ page, browserName }) => {
        test.skip(browserName !== "chromium", "Enter activates a button on keydown in Chromium only");
        const bodies = await stubContactService(page.context());
        await openAndFill(page);
        await send(page).focus();
        await page.keyboard.down("Enter");
        await page.waitForTimeout(300);

        expect(bodies).toEqual([]);
        await expect(heading(page)).not.toBeVisible();

        await page.keyboard.up("Enter");
        await expect(heading(page)).toBeVisible();
        expect(bodies).toHaveLength(1);
    });

    test("sends on release of a held Space key", async ({ page }) => {
        const bodies = await stubContactService(page.context());
        await openAndFill(page);
        await send(page).focus();
        await page.keyboard.down(" ");
        await page.waitForTimeout(300);

        expect(bodies).toEqual([]);

        await page.keyboard.up(" ");
        await expect(heading(page)).toBeVisible();
        expect(bodies).toHaveLength(1);
    });

    // FR-005 and FR-006: a failed send keeps the entries and a retry can succeed.
    test("keeps the entries and lets the visitor retry when the service fails", async ({ page }) => {
        await stubContactService(page.context(), { status: 500 });
        await openAndFill(page);
        await send(page).click();

        const dialog = page.getByRole("dialog", { name: "Contact Us" });
        await expect(dialog.getByRole("alert")).toBeVisible();
        await expect(page.getByLabel("Name")).toHaveValue("Jordan Reyes");
        await expect(page.getByLabel("How can we help you?")).toHaveValue("A new site.");
        await expect(send(page)).toBeEnabled();
        await expect(heading(page)).not.toBeVisible();

        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        expect(results.violations).toEqual([]);

        const bodies = await stubContactService(page.context());
        await send(page).click();
        await expect(heading(page)).toBeVisible();
        expect(bodies).toHaveLength(1);
    });
});
