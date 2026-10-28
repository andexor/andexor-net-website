// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { test as base, type BrowserContext } from "@playwright/test";

export { expect } from "@playwright/test";

// Spec 076: Cookiebot refuses localhost (the domain is not in its domain group), so the tests answer its requests with an empty script instead of reaching the network. The tests then
// see the site alone. The Cookiebot element is checked in the raw HTML by cookiebot.spec.ts. Playwright's loader
// here fails on TypeScript type annotations, so callbacks rely on contextual typing.
export async function stubCookiebot(context: BrowserContext) {
    await context.route(/^https:\/\/[^/]*cookiebot\.com\//, (route) =>
        route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
    );
}

// Spec 087: the Contact Us form posts to the contact service. Every test answers that address itself, so no test
// reaches the live service (which would create a real contact request). The literal must match CONTACT_SERVICE_URL
// in src/lib/contact-service.ts; tests/unit/contact-service.test.ts pins the constant to it. OPTIONS is the
// browser's CORS preflight, which it sends because the page is on localhost. The returned array collects each
// POST body, parsed. A test that wants another answer registers its own page.route on the same address, which
// Playwright tries before this one.
export async function stubContactService(
    context: BrowserContext,
    { status = 200, delayMs = 0 }: { status?: number; delayMs?: number } = {},
): Promise<Record<string, string>[]> {
    const bodies: Record<string, string>[] = [];
    const cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
    await context.route("https://andexor.net/api/contact", async (route) => {
        const request = route.request();
        if (request.method() === "OPTIONS") {
            await route.fulfill({ status: 204, headers: cors });
            return;
        }
        bodies.push(JSON.parse(request.postData() ?? "null"));
        if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
        await route.fulfill({ status, headers: cors, body: "" });
    });
    return bodies;
}

export const test = base.extend({
    context: async ({ context }, use) => {
        await stubCookiebot(context);
        await stubContactService(context);
        await use(context);
    },
});
