// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Element, ElementContent, Root, RootContent } from "hast";
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

// Pages with `layout: cards` in their frontmatter render each `##` section
// as its own card (see splitCards). The hero settings come from frontmatter.
export const CARDS_SECTIONS = ["technical", "business", "company"] as const;
export type CardsSection = (typeof CARDS_SECTIONS)[number];

export interface CardsLayout {
  eyebrow?: string;
  image?: { src: string; alt: string };
  headingHtml: string;
  introHtml: string;
  cardsHtml: string;
  // Picks the hero's backdrop pattern (`an-cardhero--<section>`). A hero with
  // no section (the not-found page) has a plain backdrop.
  section?: CardsSection;
}

export interface ContentPage {
  slug: string[];
  title: string;
  description?: string;
  html: string;
  cards?: CardsLayout;
}

interface CardsOptions {
  eyebrow?: string;
  section?: CardsSection;
  image?: { src: string; alt: string };
  featured: string[];
}

interface RawPage {
  slug: string[];
  title: string;
  description?: string;
  draft: boolean;
  body: string;
  cards?: CardsOptions;
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
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const cards: CardsOptions | undefined =
    data.layout === "cards"
      ? {
          eyebrow: str(data.eyebrow),
          section: CARDS_SECTIONS.find((x) => x === data.section),
          image: str(data.image) ? { src: str(data.image)!, alt: str(data.image_alt) ?? "" } : undefined,
          featured: Array.isArray(data.featured) ? data.featured.filter((f) => typeof f === "string") : [],
        }
      : undefined;
  return {
    slug,
    cards,
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

function markdownProcessor() {
  return (
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      // Raw HTML in Markdown is dropped (not passed through) by default.
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
      .use(rehypeStringify)
  );
}

export async function renderMarkdown(markdown: string): Promise<string> {
  return String(await markdownProcessor().process(markdown));
}

const isElement = (n: RootContent | ElementContent | undefined): n is Element =>
  n?.type === "element";

function textOf(n: RootContent | ElementContent): string {
  if (n.type === "text") return n.value;
  return n.type === "element" ? n.children.map(textOf).join("") : "";
}

// A card label is written as `>> Label` on the line after the heading. Markdown
// reads that as a blockquote nested in a blockquote holding one paragraph.
function takeEyebrow(nodes: ElementContent[]): string | undefined {
  const outer = nodes[0];
  if (!isElement(outer) || outer.tagName !== "blockquote") return undefined;
  const inner = outer.children.filter(isElement);
  if (inner.length !== 1 || inner[0].tagName !== "blockquote") return undefined;
  const para = inner[0].children.filter(isElement);
  if (para.length !== 1 || para[0].tagName !== "p") return undefined;
  nodes.shift();
  return textOf(para[0]).trim();
}

// Splits a rendered page into the `#` heading, the intro before the first `##`,
// and one card per `##` section, dealt into two columns (odd, then even) so
// the columns stagger. `--i` is the reading order, used on narrow screens.
export function splitCards(tree: Root, featured: string[]) {
  const nodes = tree.children.filter((n) => !(n.type === "text" && !n.value.trim()));
  const h1 = nodes.findIndex((n) => isElement(n) && n.tagName === "h1");
  const heading = h1 >= 0 ? (nodes.splice(h1, 1)[0] as Element) : undefined;
  const intro: RootContent[] = [];
  const sections: RootContent[][] = [];
  for (const n of nodes) {
    if (isElement(n) && n.tagName === "h2") sections.push([n]);
    else if (sections.length > 0) sections[sections.length - 1].push(n);
    else intro.push(n);
  }
  const cards = sections.map(([head, ...body], idx): Element => {
    const title = head as Element;
    const rest = body as ElementContent[];
    const eyebrow = takeEyebrow(rest);
    const isFeatured = featured.includes(textOf(title).trim());
    title.properties = { ...title.properties, className: ["an-tile__title"] };
    return {
      type: "element",
      tagName: "article",
      properties: {
        className: isFeatured ? ["an-tile", "an-tile--ink"] : ["an-tile"],
        style: `--i:${idx + 1}`,
      },
      children: [
        ...(eyebrow
          ? [
              {
                type: "element" as const,
                tagName: "p",
                properties: { className: ["an-tile__eyebrow"] },
                children: [{ type: "text" as const, value: eyebrow }],
              },
            ]
          : []),
        title,
        ...rest,
      ],
    };
  });
  const column = (parity: number): Element => ({
    type: "element",
    tagName: "div",
    properties: { className: ["an-cards__col"] },
    children: cards.filter((_, i) => i % 2 === parity),
  });
  return {
    heading: heading?.children ?? [],
    intro,
    columns: [column(0), column(1)],
  };
}

async function renderCards(markdown: string, options: CardsOptions): Promise<CardsLayout> {
  const proc = markdownProcessor();
  const tree = (await proc.run(proc.parse(markdown))) as Root;
  const { heading, intro, columns } = splitCards(tree, options.featured);
  const html = (children: RootContent[]) => String(proc.stringify({ type: "root", children }));
  return {
    eyebrow: options.eyebrow,
    section: options.section,
    image: options.image,
    headingHtml: html(heading),
    introHtml: html(intro),
    cardsHtml: html(columns),
  };
}

export async function getContentPage(
  slug: string[],
  dir: string = CONTENT_DIR,
): Promise<ContentPage | null> {
  if (!listContentSlugs(dir).some((s) => s.join("/") === slug.join("/"))) return null;
  const { title, description, body, cards } = readRaw(dir, slug);
  if (cards) {
    return { slug, title, description, html: "", cards: await renderCards(body, cards) };
  }
  return { slug, title, description, html: await renderMarkdown(body) };
}
