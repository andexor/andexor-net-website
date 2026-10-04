// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { expect, test } from "@playwright/test";

// Spec 035: the Send button looks like the Contact Us button, without the halo.
// Playwright's loader in this repo fails on TypeScript type annotations, so this
// file relies on contextual typing.
async function readStyle(button) {
  return button.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      width: parseFloat(cs.width),
      height: cs.height,
      borderRadius: cs.borderRadius,
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      padding: cs.padding,
      boxShadow: cs.boxShadow,
    };
  });
}

for (const width of [360, 1280]) {
  test(`Send matches Contact Us except for the halo at ${width}px wide`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const cta = page.getByRole("button", { name: "Contact Us" }).first();
    const ctaStyle = await readStyle(cta);

    await cta.click();
    const send = page.getByRole("dialog", { name: "Contact Us" }).getByRole("button", { name: "Send" });
    await expect(send).toBeVisible();
    const sendStyle = await readStyle(send);

    // Only the label differs, so the widths differ; Send must still be well short of the form's width.
    expect({ ...sendStyle, boxShadow: "", width: 0 }).toEqual({ ...ctaStyle, boxShadow: "", width: 0 });
    const form = await send.evaluate((el) => {
      const f = el.parentElement.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      return { width: f.width, centerGap: Math.abs(b.left + b.width / 2 - (f.left + f.width / 2)) };
    });
    expect(sendStyle.width).toBeLessThan(form.width / 2);
    // Centered on the form, like Contact Us and OK.
    expect(form.centerGap).toBeLessThan(1);
    // The rings are the first two shadows; the halo is whatever follows them.
    expect(ctaStyle.boxShadow.startsWith(sendStyle.boxShadow)).toBe(true);
    expect(ctaStyle.boxShadow.length).toBeGreaterThan(sendStyle.boxShadow.length);
  });
}
