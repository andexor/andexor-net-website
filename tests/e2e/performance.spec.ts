// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { chromium, expect, test } from "@playwright/test";

// SC-005: Largest Contentful Paint under 2.5 seconds on a simulated fast 4G
// connection (~1.6 Mbps down, 150ms RTT — standard Lighthouse mobile
// throttling). Requires Chromium's CDP, so this test runs only against the
// "chromium" project.
test("Largest Contentful Paint is under 2.5s on a simulated fast 4G connection", async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "LCP measurement uses Chromium DevTools Protocol");
    test.setTimeout(60_000);

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const client = await page.context().newCDPSession(page);

    // Fast 4G, per Lighthouse's mobile throttling preset.
    await client.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
        latency: 150,
    });
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await page.goto(testInfo.project.use.baseURL ? `${testInfo.project.use.baseURL}/` : "http://localhost:3000/");

    // Note: no TypeScript-specific syntax (type annotations, `as` casts,
    // generic type arguments) inside this callback — Playwright's browser-side
    // serialization of evaluate() callbacks does not tolerate it.
    const lcp = await page.evaluate(
        () =>
            new Promise((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const last = entries[entries.length - 1];
                    resolve(last.startTime);
                }).observe({ type: "largest-contentful-paint", buffered: true });
            }),
    );

    expect(lcp).toBeLessThan(2500);
    await browser.close();
});
