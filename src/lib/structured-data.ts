// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { CONTENT_DIR, getContentPage, type ContentPage } from "@/lib/content";
import organization from "@/lib/schema/organization.json";

// Structured data (JSON-LD) for the Markdown content pages, built from each page and from the Organization data.
// The home page's blocks are the JSON files beside this one; these are made per page at build time and put in the
// page's head by scripts/format-site.ts. Every block names what it needs inline, because a reference by @id only
// resolves to a block on the same page.

const SITE = organization.url.replace(/\/$/, "");
const CONTEXT = "https://schema.org";

export const pageUrl = (slug: string[]): string => `${SITE}/${slug.join("/")}`;

// Pages under /services/ describe a service Andexor sells.
const SERVICE_SECTION = "services";

function service(page: ContentPage, url: string): object {
    return {
        "@context": CONTEXT,
        "@type": "Service",
        "@id": `${url}#service`,
        url,
        name: page.title,
        serviceType: page.title,
        ...(page.cards?.eyebrow ? { category: page.cards.eyebrow } : {}),
        ...(page.lede ? { description: page.lede } : {}),
        provider: {
            "@type": "Organization",
            "@id": organization["@id"],
            name: organization.name,
            url: organization.url,
        },
        areaServed: organization.areaServed,
    };
}

// Home, then the section's landing page when it has one, then the page. A crumb with no address is allowed only
// last, so a section with no landing page (/services and /company redirect to the home page) is left out.
function breadcrumb(page: ContentPage, section?: ContentPage): object {
    const crumbs = [
        { name: "Home", item: `${SITE}/` },
        ...(section ? [{ name: section.title, item: pageUrl(section.slug) }] : []),
        { name: page.title },
    ];
    return {
        "@context": CONTEXT,
        "@type": "BreadcrumbList",
        "@id": `${pageUrl(page.slug)}#breadcrumb`,
        itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb })),
    };
}

function faqPage(page: ContentPage, url: string, hasService: boolean): object | null {
    if (!page.faqs?.length) return null;
    return {
        "@context": CONTEXT,
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        name: page.title,
        ...(hasService ? { about: { "@id": `${url}#service` } } : {}),
        mainEntity: page.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
    };
}

/** The structured data blocks for a content page, or none for a slug that is not a page. */
export async function getContentStructuredData(slug: string[], dir: string = CONTENT_DIR): Promise<object[]> {
    const page = await getContentPage(slug, dir);
    if (!page) return [];
    const url = pageUrl(slug);
    const section = slug.length > 1 ? await getContentPage(slug.slice(0, -1), dir) : null;
    const isService = slug[0] === SERVICE_SECTION && slug.length > 1;
    return [
        ...(isService ? [service(page, url)] : []),
        breadcrumb(page, section ?? undefined),
        faqPage(page, url, isService),
    ].filter((block): block is object => block !== null);
}
