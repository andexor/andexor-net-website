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

const isElement = (n: RootContent | ElementContent | undefined): n is Element => n?.type === "element";

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

// A card page's body is a series of rows (spec 039). Cards sit in the order they are written, and two marks, each
// alone in its own paragraph, say how they are arranged:
//   `||`  a column break: the cards before it go in the row's left column, the cards after it in the right column.
//   `---` a row break: the cards after it start a new row below the earlier one.
// A row with a column break is two columns. A row without one gives each of its cards a full-width row of its own
// (`an-tile--wide`). `--i` is the written position of each card, used to keep that order on narrow screens.
const COLUMN_BREAK = "||";

interface Row {
    cards: number[]; // indexes into the cards, in written order
    breakAt?: number; // how many of the cards are in the left column
}

function isColumnBreak(node: RootContent): boolean {
    return isElement(node) && node.tagName === "p" && textOf(node).trim() === COLUMN_BREAK;
}

// A `||` line that shares a paragraph with other text is not a mark; say so rather than print it.
function assertNotGlued(node: RootContent): void {
    if (!isElement(node) || node.tagName !== "p" || isColumnBreak(node)) return;
    if (
        textOf(node)
            .split("\n")
            .some((line) => line.trim() === COLUMN_BREAK)
    ) {
        throw new Error(`put a blank line before and after "${COLUMN_BREAK}"`);
    }
}

// Reads the marks into rows. A row with no cards is dropped, so a leading, trailing, or doubled `---` adds nothing.
function readRows(events: (number | "row" | "column")[], titles: string[]): Row[] {
    const rows: Row[] = [];
    let row: Row = { cards: [] };
    const close = () => {
        if (row.cards.length > 0) rows.push(row);
        row = { cards: [] };
    };
    for (const event of events) {
        if (event === "row") close();
        else if (event === "column") {
            if (row.breakAt !== undefined) {
                const last = row.cards[row.cards.length - 1];
                const after = last === undefined ? "the start of the row" : `"${titles[last]}"`;
                throw new Error(`more than one column break in a row (after ${after})`);
            }
            row.breakAt = row.cards.length;
        } else row.cards.push(event);
    }
    close();
    return rows;
}

// Splits a rendered page into the `#` heading, the intro before the first `##`, and the cards laid out in rows.
export function splitCards(tree: Root) {
    const nodes = tree.children.filter((n) => !(n.type === "text" && !n.value.trim()));
    const h1 = nodes.findIndex((n) => isElement(n) && n.tagName === "h1");
    const heading = h1 >= 0 ? (nodes.splice(h1, 1)[0] as Element) : undefined;
    const intro: RootContent[] = [];
    const sections: RootContent[][] = [];
    const events: (number | "row" | "column")[] = [];
    for (const n of nodes) {
        if (isElement(n) && n.tagName === "h2") {
            sections.push([n]);
            events.push(sections.length - 1);
        } else if (isElement(n) && n.tagName === "hr") events.push("row");
        else if (isColumnBreak(n)) events.push("column");
        else {
            assertNotGlued(n);
            if (sections.length > 0) sections[sections.length - 1].push(n);
            else intro.push(n);
        }
    }
    const titles = sections.map(([head]) => textOf(head as Element).trim());
    const rows = readRows(events, titles);
    const wide = new Set(rows.filter((row) => row.breakAt === undefined).flatMap((row) => row.cards));
    const cards = sections.map(([head, ...body], idx): Element => {
        const title = head as Element;
        const rest = body as ElementContent[];
        const eyebrow = takeEyebrow(rest);
        title.properties = { ...title.properties, className: ["an-tile__title"] };
        return {
            type: "element",
            tagName: "article",
            properties: {
                className: wide.has(idx) ? ["an-tile", "an-tile--wide"] : ["an-tile"],
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
    const column = (indexes: number[]): Element => ({
        type: "element",
        tagName: "div",
        properties: { className: ["an-cards__col"] },
        children: indexes.map((i) => cards[i]),
    });
    const columns = rows.flatMap((row): Element[] =>
        row.breakAt === undefined
            ? row.cards.map((i) => cards[i])
            : [column(row.cards.slice(0, row.breakAt)), column(row.cards.slice(row.breakAt))],
    );
    return { heading: heading?.children ?? [], intro, columns };
}

async function renderCards(markdown: string, options: CardsOptions): Promise<CardsLayout> {
    const proc = markdownProcessor();
    const tree = (await proc.run(proc.parse(markdown))) as Root;
    const { heading, intro, columns } = splitCards(tree);
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

export async function getContentPage(slug: string[], dir: string = CONTENT_DIR): Promise<ContentPage | null> {
    if (!listContentSlugs(dir).some((s) => s.join("/") === slug.join("/"))) return null;
    const { title, description, body, cards } = readRaw(dir, slug);
    if (cards) {
        try {
            return { slug, title, description, html: "", cards: await renderCards(body, cards) };
        } catch (error) {
            // Name the page, so the build says which file to fix.
            throw new Error(`${fileFor(dir, slug)}: ${error instanceof Error ? error.message : error}`);
        }
    }
    return { slug, title, description, html: await renderMarkdown(body) };
}
