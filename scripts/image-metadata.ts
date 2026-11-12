// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Writes ownership metadata (XMP and IPTC) into the hero image of every content page, using exiftool.
// Run it by hand: `npx tsx --tsconfig tsconfig.scripts.json scripts/image-metadata.ts [--out DIR] [--dry-run]`. It is not part of the build.
//
// The images in public/ are never changed. Each one is copied, with the metadata added, into the output
// folder (image-metadata-out/ by default), so the results can be inspected before anything is used:
//
//     exiftool -a -G1 -s image-metadata-out/about-us.png
//
// The text comes from the same place as the images' structured data (src/lib/image-rights.ts), and the titles and
// descriptions from the pages' front matter, so the file and the page say the same thing.
// exiftool is installed with `sudo apt install libimage-exiftool-perl`.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { getContentPage, listContentSlugs, type ImageDates } from "../src/lib/content";
import {
    COPYRIGHT_NOTICE,
    DIGITAL_SOURCE_TYPE,
    IMAGE_LICENSE_URL,
    IMAGE_OWNER,
    IMAGE_TOOL,
} from "../src/lib/image-rights";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function readOptions(argv: string[]): { out: string; dryRun: boolean } {
    let out = "image-metadata-out";
    let dryRun = false;
    for (let index = 0; index < argv.length; index++) {
        if (argv[index] === "--dry-run") dryRun = true;
        else if (argv[index] === "--out" && argv[index + 1]) out = argv[++index];
        else
            throw new Error(
                `Unknown argument: ${argv[index]}\nUsage: npx tsx --tsconfig tsconfig.scripts.json scripts/image-metadata.ts [--out DIR] [--dry-run]`,
            );
    }
    return { out, dryRun };
}

interface HeroImage {
    src: string;
    title: string;
    description: string;
    dates?: ImageDates;
}

// The hero image of each content page, once each, with its page's title and the image's alt text.
async function heroImages(): Promise<HeroImage[]> {
    const images = new Map<string, HeroImage>();
    for (const slug of listContentSlugs()) {
        const page = await getContentPage(slug);
        const hero = page?.cards?.image;
        if (page && hero && !images.has(hero.src)) {
            images.set(hero.src, { src: hero.src, title: page.title, description: hero.alt, dates: page.imageDates });
        }
    }
    return [...images.values()];
}

// The dates the front matter gives, in the fields that mean the same: when the image was made, and when it was last
// changed. A date with no time is written to the date-only fields. IPTC keeps the date and the time apart.
function dateArguments(dates?: ImageDates): string[] {
    const args: string[] = [];
    if (dates?.created) {
        args.push(
            `-XMP-photoshop:DateCreated=${dates.created}`,
            `-XMP-xmp:CreateDate=${dates.created}`,
            `-IPTC:DateCreated=${dates.created.slice(0, 10)}`,
        );
    }
    if (dates?.modified) args.push(`-XMP-xmp:ModifyDate=${dates.modified}`);
    return args;
}

// `#=` writes the value as it is, with no conversion, which is what the IPTC address for a source type needs.
function exiftoolArguments(image: HeroImage, source: string, target: string): string[] {
    return [
        "-charset",
        "iptc=utf8",
        "-IPTC:CodedCharacterSet=UTF8",
        `-XMP-dc:Title=${image.title}`,
        `-XMP-dc:Description=${image.description}`,
        `-XMP-dc:Creator=${IMAGE_OWNER}`,
        `-XMP-dc:Rights=${COPYRIGHT_NOTICE}`,
        `-XMP-photoshop:Credit=${IMAGE_OWNER}`,
        `-XMP-xmp:CreatorTool=${IMAGE_TOOL}`,
        "-XMP-xmpRights:Marked=True",
        `-XMP-xmpRights:Owner=${IMAGE_OWNER}`,
        `-XMP-xmpRights:UsageTerms=All rights reserved. See ${IMAGE_LICENSE_URL}`,
        `-XMP-xmpRights:WebStatement=${IMAGE_LICENSE_URL}`,
        `-XMP-iptcExt:DigitalSourceType#=${DIGITAL_SOURCE_TYPE}`,
        `-IPTC:ObjectName=${image.title}`,
        `-IPTC:Caption-Abstract=${image.description}`,
        `-IPTC:By-line=${IMAGE_OWNER}`,
        `-IPTC:Credit=${IMAGE_OWNER}`,
        `-IPTC:CopyrightNotice=${COPYRIGHT_NOTICE}`,
        ...dateArguments(image.dates),
        "-o",
        target,
        source,
    ];
}

async function main(): Promise<void> {
    const { out, dryRun } = readOptions(process.argv.slice(2));
    if (!dryRun && spawnSync("exiftool", ["-ver"]).error) {
        throw new Error("exiftool was not found. Install it with: sudo apt install libimage-exiftool-perl");
    }
    const images = await heroImages();
    if (images.length === 0) throw new Error("No content page has an image.");
    fs.mkdirSync(out, { recursive: true });

    for (const image of images) {
        const source = path.join(PUBLIC_DIR, image.src);
        if (!fs.existsSync(source)) throw new Error(`${image.src}: no such file in public/`);
        const target = path.join(out, path.basename(source));
        const args = exiftoolArguments(image, source, target);
        if (dryRun) {
            console.log(["exiftool", ...args].map((arg) => JSON.stringify(arg)).join(" "));
            continue;
        }
        // exiftool will not write over an existing output file.
        fs.rmSync(target, { force: true });
        const result = spawnSync("exiftool", args, { encoding: "utf8" });
        const messages = `${result.stdout}${result.stderr}`.trim();
        if (result.status !== 0) throw new Error(`${image.src}: exiftool failed\n${messages}`);
        console.log(`${target}${/warning/i.test(messages) ? `\n  ${messages.replaceAll("\n", "\n  ")}` : ""}`);
    }
    if (!dryRun)
        console.log(
            `\nWrote ${images.length} images to ${out}/. Inspect one with: exiftool -a -G1 -s ${out}/<name>.png`,
        );
}

// Not awaited at the top level: the scripts are run by Node, where a TypeScript file may be a CommonJS module.
main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
