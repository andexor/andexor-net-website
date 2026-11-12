// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import organization from "@/lib/schema/organization.json";

// What the site says about the ownership of its own images. The structured data for each page's image
// (src/lib/structured-data.ts) and the script that writes IPTC and XMP metadata into the image files
// (scripts/image-metadata.ts) both read it from here, so the two cannot disagree.

export const COPYRIGHT_YEAR = 2026;

/** The owner and creator of the images: the company. */
export const IMAGE_OWNER = organization.legalName;

// The legal name ends with a period ("Inc."), so one is added only where there is none.
const OWNER_SENTENCE = IMAGE_OWNER.endsWith(".") ? IMAGE_OWNER : `${IMAGE_OWNER}.`;

export const COPYRIGHT_NOTICE = `© ${COPYRIGHT_YEAR} ${OWNER_SENTENCE} All rights reserved.`;

/** The terms that say how the site's images may be used: Section 4 of the Terms of Service. */
export const IMAGE_LICENSE_URL = `${organization.url}company/terms-of-service#4-intellectual-property`;

/** The tool the images were made with, recorded in the file metadata. */
export const IMAGE_TOOL = "recraft.ai";

/** IPTC's name for an image that an AI model made from a prompt. */
export const DIGITAL_SOURCE_TYPE = "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia";
