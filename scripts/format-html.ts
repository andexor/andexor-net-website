// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Pretty-prints a built HTML page (specs/038-readable-generated-code/research.md, section 4).
//
// React hydrates by matching the DOM node for node, and it rejects the whitespace text nodes that a
// formatter adds between elements. So the page is formatted normally, one small inline script is added
// first in <head> to strip that whitespace before React hydrates, and a gate proves that the stripped
// result has the same DOM as the unformatted page.

import { format } from "prettier";

const TEXT_SPACE = "\uE000";
const TEXT_NEWLINE = "\uE001";

/** Elements whose content is raw text (or not compared as text). */
const RAW_ELEMENTS = ["script", "style", "noscript"];

/** The script injected first in <head>. It must match `stripAddedWhitespace` below. */
export const WHITESPACE_SCRIPT = `<script>
(function () {
    var SKIP = /^(PRE|TEXTAREA|SCRIPT|STYLE|NOSCRIPT)$/;
    function skipped(element) {
        return SKIP.test(element.nodeName) || (element.hasAttribute && element.hasAttribute("data-raw-html"));
    }
    function clean(node) {
        var parent = node.parentNode;
        if (!parent || node.data.indexOf("\\n") < 0) return;
        for (var up = parent; up && up.nodeType === 1; up = up.parentNode) if (skipped(up)) return;
        var text = node.data.replace(/^\\s*\\n\\s*/, "").replace(/\\n\\s*$/, "");
        if (text === "") parent.removeChild(node);
        else if (text !== node.data) node.data = text;
    }
    function sweep(element) {
        for (var child = element.firstChild, next; child; child = next) {
            next = child.nextSibling;
            if (child.nodeType === 3) clean(child);
            else if (child.nodeType === 1 && !skipped(child)) sweep(child);
        }
    }
    new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
            for (var j = 0; j < records[i].addedNodes.length; j++) {
                var added = records[i].addedNodes[j];
                if (added.nodeType === 3) clean(added);
                else if (added.nodeType === 1 && !skipped(added)) sweep(added);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    sweep(document.documentElement);
})();
</script>`;

/**
 * What the script does to one text node: remove a newline and the indentation around it at the edges.
 * Spaces before a trailing newline are kept, because a trailing space in the original (as in "page. <a>")
 * is followed by the newline the formatter added, never preceded by one.
 */
export function stripAddedWhitespace(text: string): string {
    if (!text.includes("\n")) return text;
    return text.replace(/^\s*\n\s*/, "").replace(/\n\s*$/, "");
}

/** Splits HTML into tokens. Raw-text elements keep their open tag, raw content, and close tag as separate tokens. */
export function tokenize(html: string): string[] {
    const tokens: string[] = [];
    const pattern = new RegExp(
        `<!--[\\s\\S]*?-->|<(${RAW_ELEMENTS.join("|")})\\b[^>]*>[\\s\\S]*?</\\1\\s*>|<[^>]+>|[^<]+`,
        "gi",
    );
    for (const match of html.matchAll(pattern)) {
        const token = match[0];
        const rawName = match[1]?.toLowerCase();
        if (rawName) {
            const open = token.match(/^<[^>]*>/)![0];
            const close = token.match(/<\/[^>]*>$/)![0];
            const content = token.slice(open.length, token.length - close.length);
            tokens.push(normalizeTag(open));
            // Scripts are formatted by Prettier on purpose, so only styles and noscript content must match.
            tokens.push(rawName === "script" ? "RAW:script" : `RAW:${content}`);
            tokens.push(normalizeTag(close));
        } else if (token.startsWith("<!--")) {
            tokens.push(token);
        } else if (token.startsWith("<")) {
            tokens.push(normalizeTag(token));
        } else {
            tokens.push(token);
        }
    }
    return tokens;
}

/** Lowercases names, drops the self-closing slash, and sorts attributes, so Prettier's spelling changes compare equal. */
function normalizeTag(tag: string): string {
    if (/^<!doctype/i.test(tag)) return "<!doctype html>";
    const match = tag.match(/^<(\/?)([a-zA-Z][^\s/>]*)([\s\S]*?)\/?>$/);
    if (!match) return tag;
    const [, slash, name, rest] = match;
    const attributes: string[] = [];
    for (const attribute of rest.matchAll(/([^\s=/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
        const attributeName = attribute[1].toLowerCase();
        let value = attribute[2] ?? attribute[3] ?? attribute[4] ?? "";
        // Prettier may switch an attribute to single quotes and unescape the double quotes inside it.
        value = value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'");
        // Prettier respaces inline styles ("--i:1" becomes "--i: 1"), which does not change them.
        if (attributeName === "style") value = value.replace(/\s*([:;])\s*/g, "$1").replace(/;$/, "");
        attributes.push(`${attributeName}="${value}"`);
    }
    attributes.sort();
    return `<${slash}${name.toLowerCase()}${attributes.length ? " " : ""}${attributes.join(" ")}>`;
}

/** Tokens as a browser sees them once the whitespace script has run: added whitespace removed. */
function strippedTokens(html: string): string[] {
    const result: string[] = [];
    for (const token of tokenize(html)) {
        if (token.startsWith("RAW:") || token.startsWith("<")) {
            result.push(token);
        } else {
            const text = stripAddedWhitespace(token);
            if (text !== "") result.push(text);
        }
    }
    return result;
}

const REGION_OPEN = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\sdata-raw-html\b[^>]*>/g;

function regionMarker(index: number): string {
    return `\uE100${index}\uE101`;
}

/**
 * Cuts out the content of every element marked `data-raw-html` (Markdown-generated HTML that React does not
 * hydrate). The skeleton keeps a marker where each one was.
 */
export function extractRegions(html: string): { skeleton: string; regions: string[] } {
    const regions: string[] = [];
    let skeleton = "";
    let position = 0;
    REGION_OPEN.lastIndex = 0;
    for (let match = REGION_OPEN.exec(html); match; match = REGION_OPEN.exec(html)) {
        if (match.index < position) continue; // nested inside a region already taken
        const name = match[1];
        const start = match.index + match[0].length;
        const tags = new RegExp(`<(/?)${name}\\b[^>]*>`, "gi");
        tags.lastIndex = start;
        let depth = 1;
        let end = -1;
        for (let tag = tags.exec(html); tag; tag = tags.exec(html)) {
            depth += tag[1] ? -1 : tag[0].endsWith("/>") ? 0 : 1;
            if (depth === 0) {
                end = tag.index;
                break;
            }
        }
        if (end < 0) throw new Error(`Unclosed <${name}> with data-raw-html`);
        skeleton += html.slice(position, start) + regionMarker(regions.length);
        regions.push(html.slice(start, end));
        position = end;
        REGION_OPEN.lastIndex = end;
    }
    return { skeleton: skeleton + html.slice(position), regions };
}

/** A region's tokens with all whitespace dropped: same tags and same characters, whatever the spacing. */
function looseTokens(region: string): string[] {
    const result: string[] = [];
    for (const token of tokenize(region)) {
        if (token.startsWith("<") || token.startsWith("RAW:")) result.push(token);
        else {
            const text = token.replace(/\s+/g, "");
            if (text !== "") result.push(text);
        }
    }
    return result;
}

function firstDifference(expected: string[], actual: string[]): string | null {
    const length = Math.max(expected.length, actual.length);
    for (let index = 0; index < length; index++) {
        if (expected[index] !== actual[index]) {
            return (
                `token ${index}: expected ${JSON.stringify(expected[index]?.slice(0, 80))}, ` +
                `got ${JSON.stringify(actual[index]?.slice(0, 80))}`
            );
        }
    }
    return null;
}

/** Throws unless the original page is safe to strip and the formatted page has the same DOM as the original. */
export function assertSameDom(original: string, formatted: string, file: string): void {
    const before = extractRegions(original);
    // The injected script is the one intended difference; compare without it.
    const after = extractRegions(formatted.replace(WHITESPACE_SCRIPT, ""));

    for (const token of tokenize(before.skeleton)) {
        if (token.startsWith("<") || token.startsWith("RAW:")) continue;
        if (token.includes("\n")) {
            throw new Error(
                `${file}: the unformatted page has text with a newline outside a data-raw-html region ` +
                    `(${JSON.stringify(token.slice(0, 60))}); the whitespace script is not safe for it`,
            );
        }
    }

    const skeletonDifference = firstDifference(tokenize(before.skeleton), strippedTokens(after.skeleton));
    if (skeletonDifference) throw new Error(`${file}: formatting changed the page at ${skeletonDifference}`);

    if (before.regions.length !== after.regions.length) {
        throw new Error(`${file}: formatting changed the number of data-raw-html regions`);
    }
    before.regions.forEach((region, index) => {
        const difference = firstDifference(looseTokens(region), looseTokens(after.regions[index]));
        if (difference) throw new Error(`${file}: formatting changed a data-raw-html region at ${difference}`);
    });
}

/** Formats a region's HTML with whitespace-sensitive settings, so the page looks the same. */
async function formatRegion(region: string, indent: number): Promise<string> {
    const formatted = await format(region, {
        parser: "html",
        tabWidth: 4,
        useTabs: false,
        printWidth: Math.max(40, 120 - indent),
        htmlWhitespaceSensitivity: "css",
        bracketSameLine: true,
    });
    // Whitespace-sensitive formatting can leave a tag's closing `>` alone on a line (`</a\n>`). That
    // whitespace is inside the tag, so pulling the `>` back changes nothing in the DOM.
    return formatted.trim().replace(/\s*\n\s*>/g, ">");
}

/** Puts each formatted region back where its marker is. */
async function restoreRegions(formatted: string, regions: string[], file: string): Promise<string> {
    let result = formatted;
    for (let index = 0; index < regions.length; index++) {
        const marker = regionMarker(index);
        const markerAt = result.indexOf(marker);
        if (markerAt < 0) throw new Error(`${file}: lost the marker for region ${index}`);
        const attributeAt = result.lastIndexOf("data-raw-html", markerAt);
        const tagStart = result.lastIndexOf("<", attributeAt);
        const lineStart = result.lastIndexOf("\n", tagStart) + 1;
        const indent = tagStart - lineStart;
        const before = result.slice(0, markerAt).replace(/\s+$/, "");
        const after = result.slice(markerAt + marker.length).replace(/^\s+/, "");
        const inner = await formatRegion(regions[index], indent + 4);
        const pad = " ".repeat(indent);
        const body =
            inner.includes("\n") || before.length - lineStart + inner.length > 100
                ? "\n" +
                  inner
                      .split("\n")
                      .map((line) => (line ? `${pad}    ${line}` : line))
                      .join("\n") +
                  `\n${pad}`
                : inner;
        result = before + body + after;
    }
    return result;
}

/** Formats one built page and returns the new HTML. Throws if the DOM would change. */
export async function formatHtml(original: string, file: string): Promise<string> {
    // 1. Set aside the content React does not hydrate; it is formatted separately, with its whitespace kept.
    const { skeleton, regions } = extractRegions(original);

    // 2. Keep <noscript> byte for byte: React compares its text.
    const noscripts = skeleton.match(/<noscript>[\s\S]*?<\/noscript>/g) ?? [];
    let prepared = skeleton;
    noscripts.forEach((block, index) => {
        prepared = prepared.replace(block, `<i data-noscript="${index}"></i>`);
    });

    // 3. Protect spaces and newlines inside text, so Prettier cannot re-wrap paragraphs.
    prepared = prepared
        .split(/(<script[^>]*>[\s\S]*?<\/script>|<style[^>]*>[\s\S]*?<\/style>)/)
        .map((part) =>
            /^<(script|style)/.test(part)
                ? part
                : part.replace(
                      />([^<>]+)</g,
                      (_, text: string) => `>${text.replaceAll(" ", TEXT_SPACE).replaceAll("\n", TEXT_NEWLINE)}<`,
                  ),
        )
        .join("");

    // 4. Format. `ignore` plus `bracketSameLine` keeps `>` on the line of the last attribute.
    let formatted = await format(prepared, {
        parser: "html",
        tabWidth: 4,
        useTabs: false,
        printWidth: 120,
        htmlWhitespaceSensitivity: "ignore",
        bracketSameLine: true,
    });

    // 5. Restore text, <noscript>, and the formatted regions.
    formatted = formatted.replaceAll(TEXT_SPACE, " ").replaceAll(TEXT_NEWLINE, "\n");
    noscripts.forEach((block, index) => {
        formatted = formatted.replace(new RegExp(`<i data-noscript="${index}"\\s*></i>`), () => block);
    });
    formatted = await restoreRegions(formatted, regions, file);

    // 6. Add the whitespace script first in <head>, glued to the next tag so it adds no whitespace of its own.
    if (!/<head>\s*/.test(formatted)) throw new Error(`${file}: no <head> to add the whitespace script to`);
    formatted = formatted.replace(/<head>\s*/, () => `<head>${WHITESPACE_SCRIPT}`);

    // 7. Prove the DOM is the same.
    assertSameDom(original, formatted, file);
    return formatted;
}
