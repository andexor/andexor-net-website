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

function write(file: string, text: string) {
    const full = path.join(dir, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
}

const card = (extra = "") => `---\ntitle: Web work\nlayout: cards\neyebrow: Technical Services\n${extra}---\n`;

beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "structured-data-"));
    write(
        "services/web.md",
        card() +
            "\n# Web work\n\nWe build sites.\n\n## Need a site?\n\nYes. We do R&D and build them\nand host them.\n\n- fast\n- safe\n\n## Plain card\n\nNot a question.\n",
    );
    write("services/none.md", card() + "\n# None\n\nIntro.\n\n## Plain card\n\nNot a question.\n");
    write("company/about.md", "---\ntitle: About\n---\n\n# About\n\nText.\n");
    write("company/index.md", "---\ntitle: Company\n---\n\n# Company\n");
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

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

    it("gives a page outside the services section no Service", async () => {
        expect(byType(await getContentStructuredData(["company", "about"], dir), "Service")).toBeUndefined();
    });

    it("leaves a section with no landing page out of the breadcrumb, and names one that has a page", async () => {
        const services = byType(await getContentStructuredData(["services", "web"], dir), "BreadcrumbList")!;
        expect(services.itemListElement.map((item: Crumb) => item.position)).toEqual([1, 2]);
        const company = byType(await getContentStructuredData(["company", "about"], dir), "BreadcrumbList")!;
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
