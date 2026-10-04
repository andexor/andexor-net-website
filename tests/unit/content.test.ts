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

describe("cards layout", () => {
  const md = [
    "---",
    "layout: cards",
    "eyebrow: Tech",
    "image: /pic.svg",
    "image_alt: A picture",
    "---",
    "# Page title",
    "",
    "## First?",
    "",
    ">> One",
    "",
    "Body one.",
    "",
    "## Second?",
    "",
    "- a",
    "- b",
    "",
    "## Third?",
    "",
    "Body three.",
    "",
  ].join("\n");

  it("turns each ## section into a card, dealt into two columns", async () => {
    write("cards.md", md);
    const page = await getContentPage(["cards"], dir);
    expect(page?.html).toBe("");
    const cards = page!.cards!;
    expect(cards.headingHtml).toBe("Page title");
    expect(cards.eyebrow).toBe("Tech");
    expect(cards.image).toEqual({ src: "/pic.svg", alt: "A picture" });
    // Odd cards share the first column, even cards the second.
    const [first, second] = cards.cardsHtml.split('<div class="an-cards__col">').slice(1);
    expect(first).toContain("First?");
    expect(first).toContain("Third?");
    expect(second).toContain("Second?");
  });

  it("reads the section that picks the hero backdrop, ignoring unknown values", async () => {
    write("sec.md", md.replace("layout: cards", "layout: cards\nsection: business"));
    expect((await getContentPage(["sec"], dir))!.cards!.section).toBe("business");
    write("sec.md", md.replace("layout: cards", "layout: cards\nsection: nonsense"));
    expect((await getContentPage(["sec"], dir))!.cards!.section).toBeUndefined();
    expect((await getContentPage(["cards"], dir))!.cards!.section).toBeUndefined();
  });

  // Spec 033: cards after a `---` leave the alternating columns and follow them, wide.
  it("puts the cards after a horizontal rule after the columns, as wide cards", async () => {
    write(
      "wide.md",
      ["---", "layout: cards", "---", "# T", "", "## One?", "", "a", "", "## Two?", "", "b", "", "---", "", "## Closing", "", "- x", "- y", ""].join("\n"),
    );
    const html = (await getContentPage(["wide"], dir))!.cards!.cardsHtml;
    expect(html).not.toContain("<hr");
    const closing = html.indexOf("Closing");
    expect(html.indexOf("an-tile--wide")).toBeLessThan(closing);
    expect(html.lastIndexOf("an-cards__col")).toBeLessThan(closing);
    expect(html.indexOf("One?")).toBeLessThan(html.indexOf("an-tile--wide"));
    expect(html.indexOf("Two?")).toBeLessThan(html.indexOf("an-tile--wide"));
    // Without the rule, the same cards all alternate between the columns.
    write("wide.md", ["---", "layout: cards", "---", "# T", "", "## One?", "", "## Closing", ""].join("\n"));
    expect((await getContentPage(["wide"], dir))!.cards!.cardsHtml).not.toContain("an-tile--wide");
  });

  it("uses the >> line as the card label", async () => {
    const cards = (await getContentPage(["cards"], dir))!.cards!;
    expect(cards.cardsHtml).toContain('<p class="an-tile__eyebrow">One</p>');
    expect(cards.cardsHtml).not.toContain("<blockquote");
    expect(cards.cardsHtml).not.toContain("an-tile--ink");
  });
});
