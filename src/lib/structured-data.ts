// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, getContentPage, type ContentPage } from "@/lib/content";
import { COPYRIGHT_NOTICE, COPYRIGHT_YEAR, IMAGE_LICENSE_URL, IMAGE_OWNER } from "@/lib/image-rights";
import { NOT_FOUND_IMAGE } from "@/lib/not-found-image";
import organization from "@/lib/schema/organization.json";
import website from "@/lib/schema/website.json";

// Structured data (JSON-LD) for the Markdown content pages, built from each page and from the Organization data.
// The home page's blocks are the JSON files beside this one; these are made per page at build time and put in the
// page's head by scripts/format-site.ts. Every block names what it needs inline, because a reference by @id only
// resolves to a block on the same page.

const SITE = organization.url.replace(/\/$/, "");
const CONTEXT = "https://schema.org";

export const pageUrl = (slug: string[]): string => `${SITE}/${slug.join("/")}`;

// Pages under /services/ describe a service Andexor sells.
const SERVICE_SECTION = "services";

export const PUBLIC_DIR = path.join(process.cwd(), "public");

const ORGANIZATION = {
    "@type": "Organization",
    "@id": organization["@id"],
    name: organization.name,
    url: organization.url,
};

// A PNG file starts with its signature, then the header chunk, which holds the width and height.
function pngSize(file: string): { width: number; height: number } | null {
    const header = Buffer.alloc(24);
    const fd = fs.openSync(file, "r");
    try {
        fs.readSync(fd, header, 0, 24, 0);
    } finally {
        fs.closeSync(fd);
    }
    if (header.readUInt32BE(0) !== 0x89504e47) return null;
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

const IMAGE_TYPES: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };

// The page's hero image, with who made it and owns it. The size is read from the file, so it is the file's own size
// even where the page shows it smaller.
interface ImageSource {
    src: string;
    alt?: string;
    name: string;
    created?: string;
    modified?: string;
}

function imageObject(source: ImageSource, id: string | null, publicDir: string): object {
    const file = path.join(publicDir, source.src);
    const size = path.extname(file) === ".png" && fs.existsSync(file) ? pngSize(file) : null;
    const contentUrl = `${SITE}${source.src}`;
    return {
        "@context": CONTEXT,
        "@type": "ImageObject",
        ...(id ? { "@id": id } : {}),
        url: contentUrl,
        contentUrl,
        name: source.name,
        ...(source.alt ? { description: source.alt } : {}),
        ...(IMAGE_TYPES[path.extname(file)] ? { encodingFormat: IMAGE_TYPES[path.extname(file)] } : {}),
        ...(size ?? {}),
        representativeOfPage: true,
        ...(source.created ? { dateCreated: source.created } : {}),
        ...(source.modified ? { dateModified: source.modified } : {}),
        creator: ORGANIZATION,
        copyrightHolder: ORGANIZATION,
        creditText: IMAGE_OWNER,
        copyrightNotice: COPYRIGHT_NOTICE,
        copyrightYear: COPYRIGHT_YEAR,
        license: IMAGE_LICENSE_URL,
    };
}

function image(page: ContentPage, url: string, publicDir: string): object | null {
    const hero = page.cards?.image;
    if (!hero) return null;
    return imageObject(
        {
            src: hero.src,
            alt: hero.alt,
            name: page.title,
            created: page.imageDates?.created,
            modified: page.imageDates?.modified,
        },
        `${url}#image`,
        publicDir,
    );
}

/**
 * The Page not found page's blocks: only its image. The page is not indexed and answers every unknown address, so it
 * has no address of its own for a WebPage or BreadcrumbList, and the image has no @id.
 */
export function getNotFoundStructuredData(publicDir: string = PUBLIC_DIR): object[] {
    return [
        imageObject(
            {
                src: NOT_FOUND_IMAGE.src,
                alt: NOT_FOUND_IMAGE.alt,
                name: "Page not found",
                created: NOT_FOUND_IMAGE.created,
                modified: NOT_FOUND_IMAGE.modified,
            },
            null,
            publicDir,
        ),
    ];
}

// Pages that are a more specific kind of WebPage than the home page's, by route.
const PAGE_TYPES: Record<string, string> = { "company/about-us": "AboutPage" };

// The page itself, typed by its route. It is about the Organization and part of the WebSite, both named inline.
function typedPage(page: ContentPage, url: string, type: string, hasImage: boolean): object {
    return {
        "@context": CONTEXT,
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        ...(page.description ? { description: page.description } : {}),
        about: ORGANIZATION,
        isPartOf: { "@type": "WebSite", "@id": website["@id"], name: website.name, url: website.url },
        ...(hasImage ? { primaryImageOfPage: { "@id": `${url}#image` }, image: { "@id": `${url}#image` } } : {}),
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: website.inLanguage,
    };
}

function service(page: ContentPage, url: string, hasImage: boolean): object {
    return {
        "@context": CONTEXT,
        "@type": "Service",
        "@id": `${url}#service`,
        url,
        name: page.title,
        serviceType: page.title,
        ...(page.cards?.eyebrow ? { category: page.cards.eyebrow } : {}),
        ...(page.lede ? { description: page.lede } : {}),
        provider: ORGANIZATION,
        areaServed: organization.areaServed,
        ...(hasImage ? { image: { "@id": `${url}#image` } } : {}),
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
export async function getContentStructuredData(
    slug: string[],
    dir: string = CONTENT_DIR,
    publicDir: string = PUBLIC_DIR,
): Promise<object[]> {
    const page = await getContentPage(slug, dir);
    if (!page) return [];
    const url = pageUrl(slug);
    const section = slug.length > 1 ? await getContentPage(slug.slice(0, -1), dir) : null;
    const isService = slug[0] === SERVICE_SECTION && slug.length > 1;
    const type = PAGE_TYPES[slug.join("/")];
    const picture = image(page, url, publicDir);
    return [
        ...(type ? [typedPage(page, url, type, picture !== null)] : []),
        ...(isService ? [service(page, url, picture !== null)] : []),
        picture,
        breadcrumb(page, section ?? undefined),
        faqPage(page, url, isService),
    ].filter((block): block is object => block !== null);
}
