// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 064: the note under the Contact Us form reads "We never share your personal information." followed by the
// Privacy and Terms links. The old first sentence, "No obligation.", is gone, and the note does not start with a space.
// Playwright's loader here fails on TypeScript type annotations, so none are used.
test("the Contact Us note starts with We never share and has no No obligation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Contact Us" }).first().click();
    const note = page.locator(".an-contact-form__note");
    await expect(note).toHaveText("We never share your personal information. Privacy | Terms");
    const text = await note.evaluate((el) => el.textContent);
    expect(text).toMatch(/^\S/);
    await expect(page.locator("body")).not.toContainText("No obligation");
});
