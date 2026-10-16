// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Spec 073: an optional four-line "How can we help you?" box under Website.
async function openPopup(page) {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await expect(page.getByRole("dialog", { name: "Contact Us" })).toBeVisible();
}

test.describe("How can we help you? box", () => {
    test("sits directly under Website and is a four-line text area", async ({ page }) => {
        await openPopup(page);
        const website = await page.getByLabel("Website").boundingBox();
        const help = page.getByLabel("How can we help you?");
        const box = await help.boundingBox();
        expect(box.y).toBeGreaterThan(website.y + website.height);
        await expect(help).toHaveAttribute("rows", "4");
        await expect(help).toHaveAttribute("name", "help");
        await expect(help).toHaveAttribute("id", "help");
        expect(await help.evaluate((el) => el.tagName)).toBe("TEXTAREA");
    });

    test("looks like the other fields: same font, colors, border, and radius", async ({ page }) => {
        await openPopup(page);
        const props = ["fontFamily", "fontSize", "color", "backgroundColor", "borderTopColor", "borderTopWidth"];
        const read = (locator) =>
            locator.evaluate((el, names) => {
                const style = getComputedStyle(el);
                return names.concat(["borderTopLeftRadius"]).map((n) => style[n]);
            }, props);
        expect(await read(page.getByLabel("How can we help you?"))).toEqual(await read(page.getByLabel("Website")));
    });

    test("shows the gold focus ring like the other fields", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Website").focus();
        // The ring fades in, so wait for the final value before comparing.
        const website = page.getByLabel("Website");
        await expect(website).toHaveCSS("box-shadow", /rgb\(/);
        await page.waitForTimeout(300);
        const ring = await website.evaluate((el) => getComputedStyle(el).boxShadow);
        await page.getByLabel("How can we help you?").focus();
        await expect(page.getByLabel("How can we help you?")).toHaveCSS("box-shadow", ring);
    });

    test("Enter starts a new line and does not send the form", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByLabel("Email").fill("jordan@example.com");
        const help = page.getByLabel("How can we help you?");
        await help.click();
        await page.keyboard.type("Line one");
        await page.keyboard.press("Enter");
        await page.keyboard.type("Line two");
        await expect(help).toHaveValue("Line one\nLine two");
        await expect(page.getByRole("heading", { name: "Request received" })).toHaveCount(0);
    });

    test("the form sends with or without it, and the box is empty on reopen", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("Name").fill("Jordan Reyes");
        await page.getByLabel("Email").fill("jordan@example.com");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
        await page.getByRole("button", { name: "OK" }).click();

        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("How can we help you?").fill("A new site.");
        await page.getByRole("button", { name: "Close" }).click();
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expect(page.getByLabel("How can we help you?")).toHaveValue("");
    });

    // Spec 073 counter and progress strip.
    test("shows X/250 right-justified on the label's line, in Source Code Pro, with a label narrower than the field", async ({
        page,
    }) => {
        await openPopup(page);
        const head = page.locator(".an-field__head");
        const label = head.locator("label");
        const counter = head.locator(".an-field__counter");
        await expect(counter).toHaveText("0/250");
        const field = await page.getByLabel("How can we help you?").boundingBox();
        const l = await label.boundingBox();
        const c = await counter.boundingBox();
        expect(l.width).toBeLessThan(field.width / 2);
        // Same line: the vertical ranges overlap.
        expect(c.y).toBeLessThan(l.y + l.height);
        expect(l.y).toBeLessThan(c.y + c.height);
        // Right-justified: the counter ends near the right edge of the field, past the label.
        expect(c.x).toBeGreaterThan(l.x + l.width);
        expect(Math.abs(c.x + c.width - (field.x + field.width))).toBeLessThan(16);
        expect(await counter.evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Source Code Pro");
        // var(--text-md) is 1rem, 16px.
        expect(await counter.evaluate((el) => getComputedStyle(el).fontSize)).toBe("16px");
    });

    test("fills the strip to the typed share of 250, and the browser stops at 250", async ({ page }) => {
        await openPopup(page);
        const help = page.getByLabel("How can we help you?");
        const head = page.locator(".an-field__head");
        const fill = () => head.evaluate((el) => el.style.getPropertyValue("--an-fill"));
        await help.click();
        await page.keyboard.insertText("x".repeat(100));
        await expect(page.locator(".an-field__counter")).toHaveText("100/250");
        expect(await fill()).toBe("40%");
        await page.keyboard.insertText("y".repeat(400));
        await expect(page.locator(".an-field__counter")).toHaveText("250/250");
        expect(await fill()).toBe("100%");
        expect((await help.inputValue()).length).toBe(250);
        await help.fill("");
        await expect(page.locator(".an-field__counter")).toHaveText("0/250");
        expect(await fill()).toBe("0%");
    });

    test("the painted strip is filled from the left to the typed share", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("How can we help you?").click();
        await page.keyboard.insertText("x".repeat(125));
        await expect(page.locator(".an-field__counter")).toHaveText("125/250");
        // The fill animates; wait for it to settle on 50 percent.
        await expect
            .poll(() =>
                page.locator(".an-field__head").evaluate((el) => {
                    const image = getComputedStyle(el).backgroundImage;
                    return /linear-gradient/.test(image) && /50%/.test(image);
                }),
            )
            .toBe(true);
    });

    test("keeps the label and counter legible at 95 percent, near the limit", async ({ page }) => {
        await openPopup(page);
        await page.getByLabel("How can we help you?").click();
        await page.keyboard.insertText("x".repeat(238));
        await expect(page.locator(".an-field__head")).toHaveAttribute("data-near-limit", "");
        await page.waitForTimeout(400);
        const results = await new AxeBuilder({ page }).include(".an-field__head").analyze();
        expect(results.violations).toEqual([]);
    });
});
