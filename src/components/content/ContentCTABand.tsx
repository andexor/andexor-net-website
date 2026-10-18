// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { useContact } from "@/components/contact/ContactProvider";
import { CTABand } from "@/components/marketing/CTABand";

// The Contact Us band for content pages (spec 074). The open function exists only in the browser, so this small
// client component keeps ContentPage a server component. The popup reads the page's path itself (spec 071).
export function ContentCTABand({ heading }: { heading: string }) {
    const { openContact } = useContact();
    return <CTABand heading={heading} onContactClick={() => openContact()} />;
}
