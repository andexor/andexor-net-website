// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { useEffect } from "react";

// Next.js adds its own plain `noindex` robots tag to the not-found page, and React puts it back into the live page
// after hydration even though the build removed it from the HTML (spec 030). The page's own "noindex, nofollow" tag
// is the one to keep, so this removes the plain one once the page has loaded.
export function RemoveFrameworkNoindex() {
    useEffect(() => {
        document.querySelectorAll('meta[name="robots"][content="noindex"]').forEach((tag) => tag.remove());
    }, []);
    return null;
}
