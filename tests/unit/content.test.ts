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

    it("turns each ## section into a card and reads the hero settings", async () => {
        write("cards.md", md);
        const page = await getContentPage(["cards"], dir);
        expect(page?.html).toBe("");
        const cards = page!.cards!;
        expect(cards.headingHtml).toBe("Page title");
        expect(cards.eyebrow).toBe("Tech");
        expect(cards.image).toEqual({ src: "/pic.svg", alt: "A picture" });
        for (const title of ["First?", "Second?", "Third?"]) expect(cards.cardsHtml).toContain(title);
    });

    // Spec 039: a column break splits a row into a left and a right column, each in written order.
    it("puts the cards before || in the left column and the cards after it in the right, in written order", async () => {
        write(
            "columns.md",
            ["---", "layout: cards", "---", "# T", "", "## A", "", "## B", "", "||", "", "## C", "", "## D", ""].join(
                "\n",
            ),
        );
        const html = (await getContentPage(["columns"], dir))!.cards!.cardsHtml;
        const [left, right] = html.split('<div class="an-cards__col">').slice(1);
        expect(left).toContain(">A<");
        expect(left.indexOf(">A<")).toBeLessThan(left.indexOf(">B<"));
        expect(left).not.toContain(">C<");
        expect(left).not.toContain(">D<");
        expect(right.indexOf(">C<")).toBeLessThan(right.indexOf(">D<"));
        expect(right).not.toContain(">A<");
        expect(right).not.toContain(">B<");
        expect(html).not.toContain("an-tile--wide");
    });

    it("keeps an empty side as an empty column, so the other side stays in its half", async () => {
        write("empty-right.md", ["---", "layout: cards", "---", "# T", "", "## A", "", "||", ""].join("\n"));
        const right = (await getContentPage(["empty-right"], dir))!.cards!.cardsHtml;
        expect(right).toMatch(/<div class="an-cards__col">[\s\S]*>A<[\s\S]*<\/div><div class="an-cards__col"><\/div>$/);
        write("empty-left.md", ["---", "layout: cards", "---", "# T", "", "||", "", "## A", ""].join("\n"));
        const left = (await getContentPage(["empty-left"], dir))!.cards!.cardsHtml;
        expect(left).toMatch(/^<div class="an-cards__col"><\/div><div class="an-cards__col">[\s\S]*>A</);
    });

    it("reads the section that picks the hero backdrop, ignoring unknown values", async () => {
        write("sec.md", md.replace("layout: cards", "layout: cards\nsection: business"));
        expect((await getContentPage(["sec"], dir))!.cards!.section).toBe("business");
        write("sec.md", md.replace("layout: cards", "layout: cards\nsection: nonsense"));
        expect((await getContentPage(["sec"], dir))!.cards!.section).toBeUndefined();
        expect((await getContentPage(["cards"], dir))!.cards!.section).toBeUndefined();
    });

    // Spec 039: a row with no column break gives each card a full-width row; `---` starts a new row.
    describe("rows", () => {
        const page = (body: string[]) => ["---", "layout: cards", "---", "# T", "", ...body, ""].join("\n");
        const wideArticle = (title: string) =>
            new RegExp(`<article class="an-tile an-tile--wide"[^>]*><h2[^>]*>${title}<`);
        const cardsOf = async (name: string, body: string[]) => {
            write(`${name}.md`, page(body));
            return (await getContentPage([name], dir))!.cards!.cardsHtml;
        };

        it("puts a row after --- below the columns, each of its cards full width in written order", async () => {
            const html = await cardsOf("row-wide", [
                "## A",
                "",
                "## B",
                "",
                "||",
                "",
                "## C",
                "",
                "---",
                "",
                "## Closing",
                "",
                "- x",
                "- y",
            ]);
            expect(html).not.toContain("<hr");
            expect(html).toMatch(wideArticle("Closing"));
            expect(html).not.toMatch(wideArticle("A"));
            expect(html.lastIndexOf("an-cards__col")).toBeLessThan(html.indexOf("Closing"));
            expect(html.indexOf(">C<")).toBeLessThan(html.indexOf("Closing"));
        });

        it("gives each card in a row with no column break its own full-width row, in written order", async () => {
            const html = await cardsOf("row-stack", ["## A", "", "## B", "", "## C"]);
            for (const title of ["A", "B", "C"]) expect(html).toMatch(wideArticle(title));
            expect(html).not.toContain("an-cards__col");
            expect(html.indexOf(">A<")).toBeLessThan(html.indexOf(">B<"));
            expect(html.indexOf(">B<")).toBeLessThan(html.indexOf(">C<"));
        });

        it("lets a later row have its own two columns below the first row", async () => {
            const html = await cardsOf("row-two", ["## A", "", "---", "", "## B", "", "||", "", "## C"]);
            expect(html).toMatch(wideArticle("A"));
            expect(html.indexOf(">A<")).toBeLessThan(html.indexOf("an-cards__col"));
            const [left, right] = html.split('<div class="an-cards__col">').slice(1);
            expect(left).toContain(">B<");
            expect(right).toContain(">C<");
        });

        it("shows every card full width when the page opens with a row break", async () => {
            const html = await cardsOf("row-open", ["---", "", "## A", "", "---", "", "## B"]);
            expect(html).toMatch(wideArticle("A"));
            expect(html).toMatch(wideArticle("B"));
            expect(html).not.toContain("an-cards__col");
        });
    });

    // Spec 039: `||` is a column break, `---` is a row break.
    describe("card grid marks", () => {
        const page = (body: string[]) => ["---", "layout: cards", "---", "# T", "", ...body, ""].join("\n");
        const cardsOf = async (name: string, body: string[]) => {
            write(`${name}.md`, page(body));
            return (await getContentPage([name], dir))!.cards!.cardsHtml;
        };

        it("stops the build when a row has a second column break, naming the file and the card", async () => {
            write("two-breaks.md", page(["## A", "", "||", "", "## B", "", "||", "", "## C"]));
            await expect(getContentPage(["two-breaks"], dir)).rejects.toThrow(
                /two-breaks\.md: more than one column break in a row \(after "B"\)/,
            );
        });

        it("stops the build when || is not alone in its paragraph, naming the file", async () => {
            write("glued.md", page(["## A", "", "Some text", "||", "", "## B"]));
            await expect(getContentPage(["glued"], dir)).rejects.toThrow(
                /glued\.md: put a blank line before and after "\|\|"/,
            );
        });

        it("makes no empty row for a leading, trailing, or doubled row break", async () => {
            const html = await cardsOf("breaks", ["---", "", "## A", "", "---", "", "---", "", "## B", "", "---"]);
            expect(html).not.toContain("<hr");
            expect(html).not.toContain("an-cards__col");
            for (const title of ["A", "B"]) expect(html).toMatch(new RegExp(`an-tile--wide[^>]*><h2[^>]*>${title}<`));
        });

        it("never shows the marks on the page", async () => {
            const html = await cardsOf("marks", ["## A", "", "||", "", "## B", "", "---", "", "## C"]);
            expect(html).not.toContain("||");
            expect(html).not.toContain("<hr");
        });

        it("numbers each card by its written position across all rows", async () => {
            const html = await cardsOf("numbers", ["## A", "", "## B", "", "||", "", "## C", "", "---", "", "## D"]);
            const position = (title: string) => Number(new RegExp(`--i:(\\d+)[^>]*><h2[^>]*>${title}<`).exec(html)![1]);
            const [a, b, c, d] = ["A", "B", "C", "D"].map(position);
            expect(a).toBeLessThan(b);
            expect(b).toBeLessThan(c);
            expect(c).toBeLessThan(d);
        });
    });

    // Spec 039 SC-005: the example in the authoring notes is the example in the contract, and it renders as described.
    describe("authoring example", () => {
        const exampleIn = (file: string) => {
            const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
            const block = [...text.matchAll(/```markdown\n([\s\S]*?)```/g)]
                .map((m) => m[1])
                .find((b) => b.includes("## Card A"));
            expect(block, `${file} has the example`).toBeDefined();
            return block!;
        };

        it("is the same in content/README.md and in the contract", () => {
            expect(exampleIn("content/README.md")).toBe(
                exampleIn("specs/039-grid-flex-card-columns/contracts/authoring-marks.md"),
            );
        });

        it("renders as two columns and a full-width card below them", async () => {
            write("example.md", ["---", "layout: cards", "---", "# T", "", exampleIn("content/README.md")].join("\n"));
            const html = (await getContentPage(["example"], dir))!.cards!.cardsHtml;
            const [left, right] = html.split('<div class="an-cards__col">').slice(1);
            expect(left).toContain(">Card A<");
            expect(left).toContain(">Card B<");
            // The right column ends at its closing tag; the full-width card follows it.
            const rightColumn = right.split("</div>")[0];
            expect(rightColumn).toContain(">Card C<");
            expect(rightColumn).not.toContain("Techno Bits");
            expect(html).toMatch(/<article class="an-tile an-tile--wide"[^>]*><h2[^>]*>Techno Bits</);
            expect(html.indexOf("Card C")).toBeLessThan(html.indexOf("Techno Bits"));
        });
    });

    it("uses the >> line as the card label", async () => {
        const cards = (await getContentPage(["cards"], dir))!.cards!;
        expect(cards.cardsHtml).toContain('<p class="an-tile__eyebrow">One</p>');
        expect(cards.cardsHtml).not.toContain("<blockquote");
        expect(cards.cardsHtml).not.toContain("an-tile--ink");
    });
});
