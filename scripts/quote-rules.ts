// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// The straight quotes rule (specs/040-straight-quotes-only): no curly, smart, or typographic quote may appear in
// any file, as a character or as an HTML character reference. Only the straight apostrophe and double quote are
// used. The characters are built from numeric code points, and the reference names from parts, so that this file
// contains none of them and passes its own check.

/** The eight typographic quote code points: the single and double quotes, including the low-9 and reversed forms. */
export const BANNED_CODE_POINTS = [0x2018, 0x2019, 0x201a, 0x201b, 0x201c, 0x201d, 0x201e, 0x201f];

const BANNED_CHARACTERS = new RegExp(`[${BANNED_CODE_POINTS.map((code) => String.fromCodePoint(code)).join("")}]`, "u");

// Named references: left and right single and double quotes, and the low-9 single and double quotes.
const NAMED_REFERENCES = [
    ...["l", "r"].flatMap((side) => ["s", "d"].map((kind) => `${side}${kind}quo`)),
    `sb${"quo"}`,
    `bd${"quo"}`,
];
const DECIMAL_REFERENCES = BANNED_CODE_POINTS.map((code) => code.toString(10));
const HEX_REFERENCES = BANNED_CODE_POINTS.map((code) => code.toString(16));
const BANNED_REFERENCES = new RegExp(
    `&(?:${NAMED_REFERENCES.join("|")}|#0*(?:${DECIMAL_REFERENCES.join("|")})|#x0*(?:${HEX_REFERENCES.join("|")}));`,
    "i",
);

export interface QuoteProblem {
    line: number; // 1-based
    found: string;
}

/** Every banned quote character or HTML reference in the text, with its line. */
export function findBannedQuotes(text: string): QuoteProblem[] {
    const problems: QuoteProblem[] = [];
    text.split("\n").forEach((line, index) => {
        const character = BANNED_CHARACTERS.exec(line);
        if (character) {
            const code = character[0].codePointAt(0)!.toString(16).toUpperCase();
            problems.push({ line: index + 1, found: `quote character U+${code}` });
        }
        const reference = BANNED_REFERENCES.exec(line);
        if (reference) problems.push({ line: index + 1, found: `quote reference ${reference[0]}` });
    });
    return problems;
}

const SKIPPED_DIRECTORIES = ["node_modules", ".next", ".git", "out", "playwright-report", "test-results"];
// Third-party text the owner has said not to alter.
const THIRD_PARTY_FILES = ["CODE_OF_CONDUCT.md", "CODE_OF_CONDUCT.adoc"];
const BINARY_EXTENSIONS = /\.(png|jpe?g|gif|ico|webp|woff2?|ttf|otf|eot|zip|gz|pdf|mp4|webm|tsbuildinfo)$/i;

/** Whether the rule applies to this path (relative to the repository root, forward slashes). */
export function isCheckedPath(relativePath: string): boolean {
    const path = relativePath.replace(/\\/g, "/").replace(/^\.\//, "");
    const parts = path.split("/");
    if (parts.slice(0, -1).some((part) => SKIPPED_DIRECTORIES.includes(part))) return false;
    if (THIRD_PARTY_FILES.includes(parts[parts.length - 1]) && parts.length === 1) return false;
    return !BINARY_EXTENSIONS.test(path);
}
