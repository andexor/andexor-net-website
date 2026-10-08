// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 065: the Privacy and Terms links in the Contact Us popup open in a new tab, are named by an aria-label that says
// so (with a comma, as the social icons are), and show a small hidden arrow-up-right-from-square icon just after their
// text that fits on the line. Spec 066: the icon is outside the link, as the next element right after it. The footer's
// links do not change. Playwright's loader here fails on TypeScript type
// annotations, so none are used.
const LINKS = [
    ["Privacy", "Privacy, opens in new tab"],
    ["Terms", "Terms, opens in new tab"],
];

async function openPopup(page) {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
}

test.describe("Contact Us popup legal links", () => {
    for (const [label, name] of LINKS) {
        test(`${label}: opens in a new tab and is named "${name}"`, async ({ page }) => {
            await openPopup(page);
            const link = page.locator(".an-contact-form__legal").getByRole("link", { name, exact: true });
            await expect(link).toHaveAttribute("target", "_blank");
            await expect(link).toHaveAttribute("rel", /noopener/);
            await expect(link).toHaveAttribute("aria-label", name);
        });

        test(`${label}: the icon follows the link, hidden, transparent, and fits the line`, async ({ page }) => {
            await openPopup(page);
            const link = page.locator(".an-contact-form__legal").getByRole("link", { name, exact: true });
            // Spec 066: the icon is not inside the link; it is the next element right after it.
            const icon = link.locator("xpath=following-sibling::*[1]");
            await expect(icon).toHaveClass(/fa-arrow-up-right-from-square/);
            await expect(icon).toHaveAttribute("aria-hidden", "true");
            await expect(icon).not.toHaveAttribute("aria-label", /.*/);
            await expect(icon).not.toHaveAttribute("alt", /.*/);

            const look = await link.evaluate((el) => {
                const svg = el.nextElementSibling;
                const linkBox = el.getBoundingClientRect();
                const iconBox = svg.getBoundingClientRect();
                const range = document.createRange();
                range.selectNodeContents(el.firstChild);
                const textBox = range.getBoundingClientRect();
                return {
                    tag: svg.tagName.toLowerCase(),
                    adjacent: el.nextSibling === svg,
                    insideLink: el.querySelector("svg") !== null,
                    background: getComputedStyle(svg).backgroundColor,
                    color: getComputedStyle(svg).color,
                    iconHeight: iconBox.height,
                    lineHeight: textBox.height,
                    iconLeft: iconBox.left,
                    textRight: textBox.right,
                    iconMiddle: iconBox.top + iconBox.height / 2,
                    linkTop: linkBox.top,
                    linkBottom: linkBox.bottom,
                };
            });
            expect(look.tag).toBe("svg");
            expect(look.adjacent).toBe(true);
            expect(look.insideLink).toBe(false);
            expect(look.background).toBe("rgba(0, 0, 0, 0)");
            expect(look.color).toBe("rgb(255, 255, 255)");
            expect(look.iconHeight).toBeLessThanOrEqual(look.lineHeight);
            expect(look.iconLeft).toBeGreaterThanOrEqual(look.textRight);
            expect(look.iconMiddle).toBeGreaterThan(look.linkTop);
            expect(look.iconMiddle).toBeLessThan(look.linkBottom);
        });
    }

    test("the note still reads as before and has no No obligation", async ({ page }) => {
        await openPopup(page);
        await expect(page.locator(".an-contact-form__note")).toHaveText(
            "We never share your personal information. Privacy | Terms",
        );
        await expect(page.locator("body")).not.toContainText("No obligation");
    });
});

test.describe("Footer legal links", () => {
    for (const [label] of LINKS) {
        test(`footer "${label}" is unchanged: same tab, no label, no icon`, async ({ page }) => {
            await page.goto("/");
            const link = page.locator("footer").getByRole("link", { name: label, exact: true });
            await expect(link).not.toHaveAttribute("target", /.*/);
            await expect(link).not.toHaveAttribute("aria-label", /.*/);
            await expect(link.locator("svg")).toHaveCount(0);
        });
    }
});
