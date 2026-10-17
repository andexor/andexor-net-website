// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Spec 008 FR-003 / FR-004 / SC-004, constitution Principle IV: no link on the
// site goes to `#top`. This scans the source that builds pages (`src/` code and
// `content/` Markdown) for literal links. Links built at runtime are checked on
// the rendered pages by tests/e2e/no-top-links.spec.ts.
const HTML_LINK = /href\s*[:=]\s*\{?\s*["'`][^"'`]*#top["'`]/;
const MARKDOWN_LINK = /\]\(\s*[^)\s]*#top\s*\)/;

export function hasTopLink(text: string): boolean {
    return HTML_LINK.test(text) || MARKDOWN_LINK.test(text);
}

function files(dir: string, extensions: string[]): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return files(full, extensions);
        return extensions.some((ext) => entry.name.endsWith(ext)) ? [full] : [];
    });
}

// Returns the files under `root` (its `src/` and `content/` folders) that
// contain a link to #top. `content/README.md` documents the rule and is skipped.
export function findTopLinks(root: string): string[] {
    const candidates = [
        ...files(path.join(root, "src"), [".ts", ".tsx"]),
        ...files(path.join(root, "content"), [".md"]).filter((f) => path.basename(f).toLowerCase() !== "readme.md"),
    ];
    return candidates.filter((f) => hasTopLink(fs.readFileSync(f, "utf8"))).map((f) => path.relative(root, f));
}

describe("no links to #top", () => {
    it("finds no link to #top in src/ or content/", () => {
        expect(findTopLinks(process.cwd()), "files linking to #top").toEqual([]);
    });
});
