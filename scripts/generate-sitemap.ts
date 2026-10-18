// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Writes content/sitemap.xml (spec 075): the home page plus every published content page, each with a `lastmod`
// taken from git (the date of the page file's last commit, or today if the file has uncommitted changes).
// Run on the host by build.sh before the Docker build, because the image build has no .git directory.

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { listContentSlugs } from "../src/lib/content";

const ROOT = join(import.meta.dir, "..");
const BASE = "https://andexor.net";

function git(...args: string[]): string {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function lastmod(file: string): string {
    const dirty = git("status", "--porcelain", "--", file) !== "";
    const committed = git("log", "-1", "--format=%cs", "--", file);
    return dirty || committed === "" ? new Date().toISOString().slice(0, 10) : committed;
}

function entry(loc: string, date?: string): string {
    const lines = ["    <url>", `        <loc>${loc}</loc>`];
    if (date) lines.push(`        <lastmod>${date}</lastmod>`);
    lines.push("    </url>");
    return lines.join("\n");
}

const pages = listContentSlugs()
    .map((slug) => slug.join("/"))
    .sort()
    .map((route) => {
        // `folder/index.md` is the page at `/folder`.
        const file = ["content/" + route + ".md", "content/" + route + "/index.md"].find(
            (candidate) =>
                git("ls-files", "--", candidate) !== "" || git("status", "--porcelain", "--", candidate) !== "",
        );
        return entry(`${BASE}/${route}`, file ? lastmod(file) : undefined);
    });

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entry(`${BASE}/`),
    ...pages,
    "</urlset>",
    "",
].join("\n");

writeFileSync(join(ROOT, "content", "sitemap.xml"), xml);
console.log(`Wrote content/sitemap.xml with ${pages.length + 1} entries`);
