// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Specs 057 and 058: the glossy black Close button holds the FontAwesome square-x in white, 36 by 36 pixels, with its square layer
// clear and a transparent icon background, so only the X mark shows, on both the form screen and the Request received
// screen. Playwright's loader here fails on TypeScript type annotations, so none are used.
async function expectSquareXInClose(page, screen) {
    const look = await page.getByRole("button", { name: "Close" }).evaluate((button) => {
        const svg = button.querySelector("svg");
        const buttonBox = button.getBoundingClientRect();
        const iconBox = svg.getBoundingClientRect();
        const secondary = svg.querySelector(".fa-secondary");
        const primary = svg.querySelector(".fa-primary");
        return {
            isSquareX: svg.classList.contains("fa-square-x"),
            width: iconBox.width,
            height: iconBox.height,
            ariaHidden: svg.getAttribute("aria-hidden"),
            color: getComputedStyle(svg).color,
            background: getComputedStyle(svg).backgroundColor,
            secondaryOpacity: secondary ? getComputedStyle(secondary).opacity : null,
            primaryOpacity: primary ? getComputedStyle(primary).opacity : null,
            centerX: Math.abs(iconBox.left + iconBox.width / 2 - (buttonBox.left + buttonBox.width / 2)),
            centerY: Math.abs(iconBox.top + iconBox.height / 2 - (buttonBox.top + buttonBox.height / 2)),
            insideButton:
                iconBox.left >= buttonBox.left - 0.5 &&
                iconBox.right <= buttonBox.right + 0.5 &&
                iconBox.top >= buttonBox.top - 0.5 &&
                iconBox.bottom <= buttonBox.bottom + 0.5,
            headerExtra: button.closest(".an-contact-header").getBoundingClientRect().height - buttonBox.height,
            buttonWidth: buttonBox.width,
            buttonHeight: buttonBox.height,
            buttonImage: getComputedStyle(button).backgroundImage,
        };
    });
    expect(look.isSquareX, `${screen}: icon is the FontAwesome square-x`).toBe(true);
    expect(Math.abs(look.width - 36), `${screen}: icon width`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(look.height - 36), `${screen}: icon height`).toBeLessThanOrEqual(0.5);
    expect(look.ariaHidden, `${screen}: aria-hidden`).toBe("true");
    expect(look.color, `${screen}: icon color`).toBe("rgb(255, 255, 255)");
    expect(look.background, `${screen}: icon background`).toBe("rgba(0, 0, 0, 0)");
    expect(look.secondaryOpacity, `${screen}: square layer is clear`).toBe("0");
    expect(look.primaryOpacity, `${screen}: X mark is solid`).toBe("1");
    expect(look.centerX, `${screen}: icon is centered horizontally`).toBeLessThanOrEqual(1);
    expect(look.centerY, `${screen}: icon is centered vertically`).toBeLessThanOrEqual(1);
    expect(look.insideButton, `${screen}: icon lies inside the button`).toBe(true);
    expect(Math.abs(look.headerExtra - 44), `${screen}: header height is padding plus the button`).toBeLessThanOrEqual(
        1,
    );
    expect(Math.abs(look.buttonWidth - 38), `${screen}: button width`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(look.buttonHeight - 38), `${screen}: button height`).toBeLessThanOrEqual(0.5);
    expect(look.buttonImage, `${screen}: button keeps its glossy gradient`).toContain("linear-gradient");
}

test.describe("Close button icon", () => {
    test("shows the clear-square square-x on the form and on the Request received screen", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await expectSquareXInClose(page, "form");

        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.getByLabel("Work email").fill("jordan@example.com");
        await page.getByLabel("Company website").fill("example.com");
        await page.getByLabel("Primary need").selectOption("Web Development");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
        await expectSquareXInClose(page, "confirmation");
    });
});
