// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

export function JsonLD({ data }: { data: object }) {
    // Escape "<" so content can't break out of the script tag.
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
