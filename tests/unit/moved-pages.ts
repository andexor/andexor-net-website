// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Spec 093 (issue #118): the twelve content pages that moved from the site root to a section prefix. This list is
// history, not a count of the site's pages: a page added later under /services/ or /company/ never had a root
// address, does not belong here, and needs no redirect. Used by the redirect-list test and the built-output check.
export const MOVED_PAGES: ReadonlyArray<{ old: string; now: string }> = [
    { old: "/web-development", now: "/services/web-development" },
    { old: "/web-hosting", now: "/services/web-hosting" },
    { old: "/technical-seo", now: "/services/technical-seo" },
    { old: "/agentic-systems", now: "/services/agentic-systems" },
    { old: "/cost-reduction", now: "/services/cost-reduction" },
    { old: "/lead-generation", now: "/services/lead-generation" },
    { old: "/growth-marketing", now: "/services/growth-marketing" },
    { old: "/process-re-engineering", now: "/services/process-re-engineering" },
    { old: "/about-us", now: "/company/about-us" },
    { old: "/privacy-policy", now: "/company/privacy-policy" },
    { old: "/security-policy", now: "/company/security-policy" },
    { old: "/terms-of-service", now: "/company/terms-of-service" },
];
