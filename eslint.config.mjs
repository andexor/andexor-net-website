// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "design/**",
            "ds-bundle/**",
            ".design-sync/**",
            ".ds-sync/**",
            "playwright-report/**",
            "test-results/**",
            "next-env.d.ts",
        ],
    },
    {
        // Playwright tests hold no React. The hooks rule mistakes a fixture's `use` callback for a React hook.
        files: ["tests/e2e/**"],
        rules: {
            "react-hooks/rules-of-hooks": "off",
        },
    },
];

export default eslintConfig;
