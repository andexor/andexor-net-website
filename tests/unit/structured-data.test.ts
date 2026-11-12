// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getContentStructuredData } from "@/lib/structured-data";

// Structured data for content pages: the Service, BreadcrumbList, and FAQPage blocks made from a page.
let dir: string;
let publicDir: string;

function write(file: string, text: string) {
    const full = path.join(dir, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
}

// A file that starts like a PNG with the given size, which is all that is read of it.
function writePng(file: string, width: number, height: number) {
    const header = Buffer.alloc(24);
    header.writeUInt32BE(0x89504e47, 0);
    header.writeUInt32BE(width, 16);
    header.writeUInt32BE(height, 20);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, header);
}

const card = (extra = "") => `---\ntitle: Web work\nlayout: cards\neyebrow: Technical Services\n${extra}---\n`;

beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "structured-data-"));
    publicDir = path.join(dir, "public");
    writePng(path.join(publicDir, "static/images/web.png"), 2048, 2048);
    write(
        "services/web.md",
        card(
            "image: /static/images/web.png\nimage_alt: a laptop\nimage_created: 2026-11-05\nimage_modified: 2026-11-07T10:30:00Z\n",
        ) +
            "\n# Web work\n\nWe build sites.\n\n## Need a site?\n\nYes. We do R&D and build them\nand host them.\n\n- fast\n- safe\n\n## Plain card\n\nNot a question.\n",
    );
    write("services/none.md", card() + "\n# None\n\nIntro.\n\n## Plain card\n\nNot a question.\n");
    write("company/about-us.md", "---\ntitle: About\n---\n\n# About\n\nText.\n");
    write("services/undated.md", card("image: /static/images/web.png\nimage_alt: a laptop\n") + "\n# Undated\n");
    write("company/index.md", "---\ntitle: Company\n---\n\n# Company\n");
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

interface Rights {
    "@id": string;
    name: string;
    description: string;
    width: number;
    height: number;
    copyrightNotice: string;
    license: string;
    creator: { "@id": string };
    copyrightHolder: { "@id": string };
    representativeOfPage: boolean;
    dateCreated?: string;
    dateModified?: string;
}

interface Crumb {
    position: number;
    item?: string;
}

// The fields the tests read, from whichever block they ask for.
interface Block {
    url: string;
    description: string;
    category: string;
    areaServed: string;
    provider: { "@id": string };
    about: { "@id": string };
    image: { "@id": string };
    isPartOf: { "@id": string };
    itemListElement: Crumb[];
    mainEntity: { name: string; acceptedAnswer: { text: string } }[];
}

const byType = (blocks: object[], type: string) =>
    blocks.find((block) => (block as { "@type": string })["@type"] === type) as Block | undefined;

describe("getContentStructuredData", () => {
    it("describes a service page as a Service from the Organization", async () => {
        const service = byType(await getContentStructuredData(["services", "web"], dir), "Service")!;
        expect(service.provider["@id"]).toBe("https://andexor.net/#organization");
        expect(service.areaServed).toBe("Atlanta");
        expect(service.url).toBe("https://andexor.net/services/web");
        expect(service.description).toBe("We build sites.");
        expect(service.category).toBe("Technical Services");
    });

    it("types the About Us page as an AboutPage that is about the Organization, and gives other pages no such block", async () => {
        const about = byType(await getContentStructuredData(["company", "about-us"], dir), "AboutPage")!;
        expect(about.about["@id"]).toBe("https://andexor.net/#organization");
        expect(about.isPartOf["@id"]).toBe("https://andexor.net/#website");
        expect(about.url).toBe("https://andexor.net/company/about-us");
        expect(byType(await getContentStructuredData(["services", "web"], dir), "AboutPage")).toBeUndefined();
    });

    it("describes the hero image with its alt text, its own size, and the Organization as creator and owner", async () => {
        const blocks = await getContentStructuredData(["services", "web"], dir, publicDir);
        const picture = byType(blocks, "ImageObject") as unknown as Rights;
        expect(picture["@id"]).toBe("https://andexor.net/services/web#image");
        expect(picture.description).toBe("a laptop");
        expect([picture.width, picture.height]).toEqual([2048, 2048]);
        expect(picture.creator["@id"]).toBe("https://andexor.net/#organization");
        expect(picture.copyrightHolder["@id"]).toBe("https://andexor.net/#organization");
        expect(picture.copyrightNotice).toMatch(/^© \d{4} Andexor Network, Inc\. All rights reserved\.$/);
        expect(picture.license).toMatch(/^https:\/\/andexor\.net\/company\/terms-of-service#/);
        expect(byType(blocks, "Service")!.image["@id"]).toBe(picture["@id"]);
    });

    it("gives the image the dates from the front matter, and none when the page has none", async () => {
        const dated = byType(await getContentStructuredData(["services", "web"], dir, publicDir), "ImageObject");
        expect((dated as unknown as Rights).dateCreated).toBe("2026-11-05");
        expect((dated as unknown as Rights).dateModified).toBe("2026-11-07T10:30:00Z");
        const undated = byType(await getContentStructuredData(["services", "undated"], dir, publicDir), "ImageObject");
        expect(undated).toBeDefined();
        expect(undated).not.toHaveProperty("dateCreated");
        expect(undated).not.toHaveProperty("dateModified");
    });

    it("stops with the file's name when an image date is not a date", async () => {
        // Its own folder: a bad date anywhere stops the whole build, so it cannot sit beside the other pages.
        const bad = fs.mkdtempSync(path.join(os.tmpdir(), "structured-data-bad-"));
        try {
            fs.mkdirSync(path.join(bad, "services"));
            fs.writeFileSync(
                path.join(bad, "services/bad-date.md"),
                card("image: /static/images/web.png\nimage_created: last week\n") + "\n# Bad\n",
            );
            await expect(getContentStructuredData(["services", "bad-date"], bad, publicDir)).rejects.toThrow(
                /bad-date\.md: image_created must be an ISO 8601 date/,
            );
        } finally {
            fs.rmSync(bad, { recursive: true, force: true });
        }
    });

    it("gives a page with no image no ImageObject", async () => {
        expect(
            byType(await getContentStructuredData(["services", "none"], dir, publicDir), "ImageObject"),
        ).toBeUndefined();
    });

    it("gives a page outside the services section no Service", async () => {
        expect(byType(await getContentStructuredData(["company", "about-us"], dir), "Service")).toBeUndefined();
    });

    it("leaves a section with no landing page out of the breadcrumb, and names one that has a page", async () => {
        const services = byType(await getContentStructuredData(["services", "web"], dir), "BreadcrumbList")!;
        expect(services.itemListElement.map((item: Crumb) => item.position)).toEqual([1, 2]);
        const company = byType(await getContentStructuredData(["company", "about-us"], dir), "BreadcrumbList")!;
        expect(company.itemListElement.map((item: Crumb) => item.position)).toEqual([1, 2, 3]);
        expect(company.itemListElement[1].item).toBe("https://andexor.net/company");
        // Only the last crumb may leave out its address.
        expect(company.itemListElement[2].item).toBeUndefined();
    });

    it("makes an FAQPage only from the cards whose headings are questions, with the answer as plain text", async () => {
        const faq = byType(await getContentStructuredData(["services", "web"], dir), "FAQPage")!;
        expect(faq.mainEntity).toHaveLength(1);
        expect(faq.mainEntity[0].name).toBe("Need a site?");
        const answer: string = faq.mainEntity[0].acceptedAnswer.text;
        expect(answer).toContain("R and D");
        expect(answer).toContain("fast; safe.");
        expect(answer).not.toMatch(/[<>]/);
        expect(answer).not.toContain("\n");
        expect(faq.about["@id"]).toBe("https://andexor.net/services/web#service");
    });

    it("makes no FAQPage for a page with no questions", async () => {
        expect(byType(await getContentStructuredData(["services", "none"], dir), "FAQPage")).toBeUndefined();
    });

    it("returns nothing for a slug that is not a page", async () => {
        expect(await getContentStructuredData(["nope"], dir)).toEqual([]);
    });
});
