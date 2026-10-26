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

export const test = base.extend({
    context: async ({ context }, use) => {
        await stubCookiebot(context);
        await use(context);
    },
});
