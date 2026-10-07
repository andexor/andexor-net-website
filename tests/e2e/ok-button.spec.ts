// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 036: the OK button has the keyboard focus, and shows it, every time the
// confirmation appears, however the form was sent.
//
// Playwright's loader in this repo fails on TypeScript type annotations, so
// this file relies on contextual typing.
const ROUNDS = 5;

async function fillForm(page) {
    await page.getByLabel("Full name").fill("Jordan Reyes");
    await page.getByLabel("Work email").fill("jordan@example.com");
    await page.getByLabel("Company website").fill("example.com");
    await page.getByLabel("Primary need").selectOption("Web Development");
}

async function expectOkFocusedAndVisible(page) {
    const ok = page.getByRole("dialog", { name: "Contact Us" }).getByRole("button", { name: "OK" });
    await expect(ok).toBeFocused();
    // The gold focus ring only shows when the browser counts the focus as visible.
    expect(await ok.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
    expect(await ok.evaluate((el) => getComputedStyle(el).boxShadow)).toContain("0px 0px 0px 5px");
}

const WAYS = {
    "a mouse click on Send": (page) => page.getByRole("button", { name: "Send" }).click(),
    "the Space bar on Send": async (page) => {
        await page.getByRole("button", { name: "Send" }).focus();
        await page.keyboard.press("Space");
    },
    "Enter in a field": async (page) => {
        await page.getByLabel("Company website").focus();
        await page.keyboard.press("Enter");
    },
};

for (const [name, send] of Object.entries(WAYS)) {
    test(`OK has visible focus every time after ${name}`, async ({ page }) => {
        await page.goto("/");
        await page.waitForFunction(() => document.hasFocus(), undefined, { timeout: 5000 });
        for (let round = 0; round < ROUNDS; round++) {
            await page.getByRole("button", { name: "Contact Us" }).first().click();
            await fillForm(page);
            await send(page);
            await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
            await expectOkFocusedAndVisible(page);
            await page.keyboard.press("Enter");
            await expect(page.getByRole("dialog")).toBeHidden();
        }
    });
}

test("OK looks like Send, and is centered", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    await fillForm(page);
    const read = (button) =>
        button.evaluate((el) => {
            const cs = getComputedStyle(el);
            const f = el.parentElement.getBoundingClientRect();
            const b = el.getBoundingClientRect();
            return {
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                height: cs.height,
                borderRadius: cs.borderRadius,
                backgroundColor: cs.backgroundColor,
                color: cs.color,
                padding: cs.padding,
                boxShadow: cs.boxShadow,
                width: b.width,
                parentWidth: f.width,
                centerGap: Math.abs(b.left + b.width / 2 - (f.left + f.width / 2)),
                arrows: el.querySelectorAll("svg").length,
            };
        });
    const send = await read(page.getByRole("button", { name: "Send" }));
    await page.getByRole("button", { name: "Send" }).click();
    // OK has the focus when it appears, which brightens it like Send's focus does, and a
    // tap can leave a hover state behind. Compare the resting looks.
    await page.mouse.move(0, 0);
    const okButton = page.getByRole("dialog").getByRole("button", { name: "OK" });
    await okButton.evaluate((el) => el.blur());
    await expect.poll(async () => (await read(okButton)).backgroundColor).toBe(send.backgroundColor);
    const ok = await read(okButton);

    for (const key of ["fontSize", "fontWeight", "borderRadius", "backgroundColor", "color", "padding"]) {
        expect(ok[key], key).toBe(send[key]);
    }
    expect(ok.arrows).toBe(0);
    // Spec 056: Send has no arrow either, so OK and Send differ in nothing but the label.
    expect(send.arrows).toBe(0);
    expect(ok.width).toBeLessThan(ok.parentWidth / 2);
    expect(ok.centerGap).toBeLessThan(1);
});
