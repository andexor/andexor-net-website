// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Which formatting rules apply to which file (specs/038-readable-generated-code/data-model.md).
// The post-build pass and the tests both use this, so they cannot disagree.

export type FileGroup =
    "site-source" | "built-html" | "built-site-css" | "built-site-js" | "built-third-party-js" | "out-of-scope";

const SOURCE_EXTENSION = /\.(ts|tsx|js|mjs|css)$/;
const OUT_OF_SCOPE_DIRECTORIES = [
    "design/",
    "content/",
    "specs/",
    "reports/",
    "node_modules/",
    ".next/",
    "playwright-report/",
    "test-results/",
    "stubs/",
    ".specify/",
    ".claude/",
];

/** Maps a path relative to the repository root (forward slashes) to its group. */
export function fileGroup(relativePath: string): FileGroup {
    const path = relativePath.replace(/\\/g, "/").replace(/^\.\//, "");

    if (path.startsWith("out/")) {
        if (path.endsWith(".html")) return "built-html";
        if (/^out\/_next\/static\/css\/[^/]+\.css$/.test(path)) return "built-site-css";
        if (/^out\/_next\/static\/chunks\/site-[^/]+\.js$/.test(path)) return "built-site-js";
        if (/^out\/_next\/static\/(chunks|[^/]+)\/.*\.js$/.test(path)) return "built-third-party-js";
        return "out-of-scope";
    }
    if (OUT_OF_SCOPE_DIRECTORIES.some((directory) => path.startsWith(directory))) return "out-of-scope";
    if (path.endsWith(".d.ts")) return "out-of-scope";
    if (SOURCE_EXTENSION.test(path)) return "site-source";
    return "out-of-scope";
}

/**
 * True when the text looks minified: no line is indented and some line is very long.
 * This is a shape check, not a count of lines.
 */
export function isMinified(text: string): boolean {
    const lines = text.split("\n");
    const hasIndentedLine = lines.some((line) => /^ +\S/.test(line));
    const hasVeryLongLine = lines.some((line) => line.length > 1000);
    return !hasIndentedLine && hasVeryLongLine;
}
