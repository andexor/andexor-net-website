// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Post-build step: copies the crawler files from content/ (sitemap.xml, spec 075, and robots.txt) to the root of
// out/ so the static server can serve them at /sitemap.xml and /robots.txt. Run after `next build` by
// `bun run build`.

import { copyFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const FILES = ["sitemap.xml", "robots.txt"];

for (const file of FILES) {
    await copyFile(join(ROOT, "content", file), join(ROOT, "out", file));
    console.log(`Copied content/${file} to out/${file}`);
}
