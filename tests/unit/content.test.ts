// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getContentPage, listContentSlugs, renderMarkdown } from "@/lib/content";

let dir: string;

function write(rel: string, text: string) {
  const file = path.join(dir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
  write("about.md", "---\ntitle: About Us\ndescription: Who we are\n---\n\n# Hello\n");
  write("services/web.md", "# Web work\n\nText.\n");
  write("services/index.md", "# Services\n");
  write("index.md", "# Root\n");
  write("README.md", "# Docs\n");
  write("secret.md", "---\ndraft: true\n---\n# Secret\n");
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("listContentSlugs", () => {
  it("maps files to routes and skips README, root index, and drafts", () => {
    const slugs = listContentSlugs(dir)
      .map((s) => s.join("/"))
      .sort();
    expect(slugs).toEqual(["about", "services", "services/web"]);
  });

  it("returns nothing when the directory is missing", () => {
    expect(listContentSlugs(path.join(dir, "nope"))).toEqual([]);
  });
});

describe("getContentPage", () => {
  it("uses frontmatter for title and description", async () => {
    const page = await getContentPage(["about"], dir);
    expect(page?.title).toBe("About Us");
    expect(page?.description).toBe("Who we are");
    expect(page?.html).toContain('<h1 id="hello">Hello</h1>');
  });

  it("falls back to the first heading for the title", async () => {
    expect((await getContentPage(["services", "web"], dir))?.title).toBe("Web work");
  });

  it("resolves folder index pages", async () => {
    expect((await getContentPage(["services"], dir))?.title).toBe("Services");
  });

  it("returns null for drafts and unknown pages", async () => {
    expect(await getContentPage(["secret"], dir)).toBeNull();
    expect(await getContentPage(["missing"], dir)).toBeNull();
    expect(await getContentPage(["..", "package"], dir)).toBeNull();
  });
});

describe("renderMarkdown", () => {
  it("renders GFM tables and drops raw HTML", async () => {
    const html = await renderMarkdown("| a |\n| - |\n| b |\n\n<script>alert(1)</script>\n");
    expect(html).toContain("<table>");
    expect(html).not.toContain("<script>");
  });

  it("opens external links in a new tab only", async () => {
    const html = await renderMarkdown("[x](https://example.com) [y](/about)");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer" target="_blank"');
    expect(html).toContain('<a href="/about">y</a>');
  });
});
