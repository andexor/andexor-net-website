// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Specs 054 and 055: the round badge on the Request received screen holds the FontAwesome square-check, 64 by 64 pixels, in
// --success-600, with its square layer clear and a transparent icon background, so only the check mark shows over the
// --success-100 circle. The card bullet icons keep their own 24 pixel size. Playwright's loader here fails on TypeScript
// type annotations, so none are used.
test.describe("Confirmation icon", () => {
    test("the badge holds a clear-square FontAwesome square-check", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Contact Us" }).first().click();
        await page.getByLabel("Full name").fill("Jordan Reyes");
        await page.getByLabel("Work email").fill("jordan@example.com");
        await page.getByLabel("Company website").fill("example.com");
        await page.getByLabel("Primary need").selectOption("Web Development");
        await page.getByRole("button", { name: "Send" }).click();
        await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();

        const result = await page.evaluate(() => {
            const resolve = (name, property) => {
                const probe = document.createElement("span");
                probe.style[property] = `var(${name})`;
                document.body.appendChild(probe);
                const value = getComputedStyle(probe)[property];
                probe.remove();
                return value;
            };
            const badge = document.querySelector(".an-contact-confirmation__icon");
            const svg = badge.querySelector("svg");
            const badgeBox = badge.getBoundingClientRect();
            const iconBox = svg.getBoundingClientRect();
            const badgeStyle = getComputedStyle(badge);
            const mark = svg.querySelector(".fa-primary").getBoundingClientRect();
            const heading = document.querySelector(".an-contact-confirmation__heading").getBoundingClientRect();
            const panel = document.querySelector(".an-contact-panel");
            return {
                isSquareCheck: svg.classList.contains("fa-square-check"),
                isPlainCheck: svg.classList.contains("fa-check"),
                width: iconBox.width,
                height: iconBox.height,
                ariaHidden: svg.getAttribute("aria-hidden"),
                color: getComputedStyle(svg).color,
                success600: resolve("--success-600", "color"),
                iconBackground: getComputedStyle(svg).backgroundColor,
                secondaryOpacity: svg.querySelector(".fa-secondary")
                    ? getComputedStyle(svg.querySelector(".fa-secondary")).opacity
                    : null,
                primaryOpacity: svg.querySelector(".fa-primary")
                    ? getComputedStyle(svg.querySelector(".fa-primary")).opacity
                    : null,
                badgeWidth: badgeBox.width,
                badgeHeight: badgeBox.height,
                badgeBackground: badgeStyle.backgroundColor,
                success100: resolve("--success-100", "backgroundColor"),
                badgeRadius: parseFloat(badgeStyle.borderTopLeftRadius),
                markMargin: Math.min(
                    mark.left - badgeBox.left,
                    badgeBox.right - mark.right,
                    mark.top - badgeBox.top,
                    badgeBox.bottom - mark.bottom,
                ),
                headingGap: heading.top - badgeBox.bottom,
                panelOverflow: panel.scrollWidth - panel.clientWidth,
                centerX: Math.abs(iconBox.left + iconBox.width / 2 - (badgeBox.left + badgeBox.width / 2)),
                centerY: Math.abs(iconBox.top + iconBox.height / 2 - (badgeBox.top + badgeBox.height / 2)),
            };
        });

        expect(result.isSquareCheck, "icon is the FontAwesome square-check").toBe(true);
        expect(result.isPlainCheck, "icon is not the plain check").toBe(false);
        expect(Math.abs(result.width - 64), "icon width").toBeLessThanOrEqual(0.5);
        expect(Math.abs(result.height - 64), "icon height").toBeLessThanOrEqual(0.5);
        expect(result.ariaHidden, "aria-hidden").toBe("true");
        expect(result.color, "icon color").toBe(result.success600);
        expect(result.iconBackground, "icon background").toBe("rgba(0, 0, 0, 0)");
        expect(result.secondaryOpacity, "square layer is clear").toBe("0");
        expect(result.primaryOpacity, "check mark is solid").toBe("1");
        expect(Math.abs(result.badgeWidth - 56), "badge width").toBeLessThanOrEqual(0.5);
        expect(Math.abs(result.badgeHeight - 56), "badge height").toBeLessThanOrEqual(0.5);
        expect(result.badgeBackground, "badge background").toBe(result.success100);
        expect(result.badgeRadius, "badge is round").toBeGreaterThanOrEqual(28);
        expect(result.markMargin, "check mark lies inside the circle with space around it").toBeGreaterThanOrEqual(8);
        expect(result.headingGap, "heading is not pushed or covered").toBeGreaterThanOrEqual(16);
        expect(result.panelOverflow, "panel does not scroll sideways").toBeLessThanOrEqual(0);
        expect(result.centerX, "icon is centered horizontally").toBeLessThanOrEqual(1);
        expect(result.centerY, "icon is centered vertically").toBeLessThanOrEqual(1);
    });

    test("the card bullet icons keep their 24 pixel size", async ({ page }) => {
        await page.goto("/");
        const sizes = await page
            .locator(".an-services__bullet svg")
            .evaluateAll((icons) => icons.map((icon) => icon.getBoundingClientRect()).map((b) => [b.width, b.height]));
        for (const [width, height] of sizes) {
            expect(Math.abs(width - 24)).toBeLessThanOrEqual(0.5);
            expect(Math.abs(height - 24)).toBeLessThanOrEqual(0.5);
        }
    });
});
