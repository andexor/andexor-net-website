// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { ReactNode } from "react";

// A browser may break a line after any hyphen, and no CSS property turns that off. The site wraps each hyphenated word
// in a span that does not wrap (`.an-nobreak`, content.css) so "Re-engineering" stays together. Markdown pages do it at
// build time (rehypeKeepHyphenatedWordsTogether in content.ts); React-rendered text goes through keepHyphenated.
export const HYPHENATED = /[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu;

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// The result is raw HTML (`data-raw-html`), because the build formatter cannot handle a React text node that starts
// with a space after a span. `text` is escaped; it comes from the site's own source, never from a visitor.
export function keepHyphenated(text: string): ReactNode {
    if (!new RegExp(HYPHENATED.source, "u").test(text)) return text;
    const html = escapeHtml(text).replace(HYPHENATED, (word) => `<span class="an-nobreak">${word}</span>`);
    return <span data-raw-html="" dangerouslySetInnerHTML={{ __html: html }} />;
}
