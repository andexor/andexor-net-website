// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Markdown content pages. Every `.md` file under `content/` becomes a static
// page at the route matching its path (`content/about.md` -> `/about`,
// `content/services/web.md` -> `/services/web`). Rendering happens at build
// time only (see src/app/[...slug]/page.tsx); nothing here runs in the browser.

export const CONTENT_DIR = path.join(process.cwd(), "content");

// Files that are documentation for authors, not pages.
const IGNORED_FILES = new Set(["readme.md"]);

export interface ContentPage {
  slug: string[];
  title: string;
  description?: string;
  html: string;
}

interface RawPage {
  slug: string[];
  title: string;
  description?: string;
  draft: boolean;
  body: string;
}

function walk(dir: string, prefix: string[] = []): string[][] {
  if (!fs.existsSync(dir)) return [];
  const slugs: string[][] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      slugs.push(...walk(path.join(dir, entry.name), [...prefix, entry.name]));
    } else if (entry.name.endsWith(".md") && !IGNORED_FILES.has(entry.name.toLowerCase())) {
      const name = entry.name.slice(0, -".md".length);
      // `folder/index.md` is the page at `/folder`. A root `index.md` would
      // collide with the home page, so it is not routable.
      if (name === "index") {
        if (prefix.length > 0) slugs.push(prefix);
      } else {
        slugs.push([...prefix, name]);
      }
    }
  }
  return slugs;
}

function fileFor(dir: string, slug: string[]): string {
  const direct = path.join(dir, ...slug) + ".md";
  return fs.existsSync(direct) ? direct : path.join(dir, ...slug, "index.md");
}

function humanize(segment: string): string {
  const words = segment.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function readRaw(dir: string, slug: string[]): RawPage {
  const { data, content } = matter(fs.readFileSync(fileFor(dir, slug), "utf8"));
  const h1 = /^#\s+(.+?)\s*#*\s*$/m.exec(content)?.[1];
  return {
    slug,
    title: typeof data.title === "string" ? data.title : (h1 ?? humanize(slug[slug.length - 1])),
    description: typeof data.description === "string" ? data.description : undefined,
    draft: data.draft === true,
    body: content,
  };
}

// Slugs of every publishable page. Pages with `draft: true` in their
// frontmatter are skipped so they can be written before they are ready.
export function listContentSlugs(dir: string = CONTENT_DIR): string[][] {
  return walk(dir).filter((slug) => !readRaw(dir, slug).draft);
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    // Raw HTML in Markdown is dropped (not passed through) by default.
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

export async function getContentPage(
  slug: string[],
  dir: string = CONTENT_DIR,
): Promise<ContentPage | null> {
  if (!listContentSlugs(dir).some((s) => s.join("/") === slug.join("/"))) return null;
  const { title, description, body } = readRaw(dir, slug);
  return { slug, title, description, html: await renderMarkdown(body) };
}
