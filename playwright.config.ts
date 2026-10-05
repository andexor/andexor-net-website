// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
    },
    // Tests run against the production build (static export served by
    // server.ts), the same output Docker serves. `next dev` cannot serve the
    // not-found page under `output: "export"`, and it compiles pages lazily.
    webServer: {
        command: "bun run build && bun run server.ts",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
    projects: [
        // Desktop browsers — Chrome and Safari are the high-priority, thoroughly
        // tested targets per FR-019; Firefox is lower priority.
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        // Device-emulation projects — FR-020 requires the site to work on
        // recent iPhone, iPad, and Android devices.
        { name: "iphone", use: { ...devices["iPhone 13"] } },
        { name: "ipad", use: { ...devices["iPad Pro 11"] } },
        { name: "android", use: { ...devices["Pixel 7"] } },
    ],
});
