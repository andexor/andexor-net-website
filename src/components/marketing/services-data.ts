// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faChartLineDown,
    faChartLineUp,
    faCode,
    faFilter,
    faMagnifyingGlass,
    faMicrochipAi,
    faRoute,
    faServer,
} from "@awesome.me/kit-0a6c11d394/icons/duotone/solid";

export interface ServiceOffering {
    kind: "technical" | "business";
    icon: IconDefinition;
    title: string;
    href: string;
    description: string;
    bullets: string[];
}

// One entry per service page (spec 048), listed in the footer's order: the four
// technical services, then the four business services. Each card links to its
// page (spec 011), the same address as the footer entry of the same name.
export const SERVICES: ServiceOffering[] = [
    {
        kind: "technical",
        icon: faCode,
        title: "Web Development",
        href: "/web-development",
        description:
            "We'll create or update your site with a strong technical foundation to handle an increase in traffic and sales.",
        bullets: ["Brochure site, blog, forms, shop", "Content management system", "Web application"],
    },
    {
        kind: "technical",
        icon: faServer,
        title: "Web Hosting",
        href: "/web-hosting",
        description: "We'll host your site on fast, reliable servers so it stays up when traffic spikes.",
        bullets: ["Managed cloud servers", "Backups and monitoring", "Security updates"],
    },
    {
        kind: "technical",
        icon: faMagnifyingGlass,
        title: "Technical SEO",
        href: "/technical-seo",
        description:
            "We'll assess your site's structure and brand identity, then improve visibility in search engines and AI agents.",
        bullets: ["Site audit", "Content strategy", "Maps, social media"],
    },
    {
        kind: "technical",
        icon: faMicrochipAi,
        title: "Agentic Systems",
        href: "/agentic-systems",
        description:
            "We'll build the agents you need so you can adapt to emerging trends as AI agents handle business transactions.",
        bullets: ["Knowledge Base", "Digital assistant, scheduling", "Workflow automation"],
    },
    {
        kind: "business",
        icon: faChartLineDown,
        title: "Cost Reduction",
        href: "/cost-reduction",
        description: "We'll find where your business spends more than it needs to and cut it without hurting quality.",
        bullets: ["Spending review", "Vendor and tool consolidation", "Automation of manual work"],
    },
    {
        kind: "business",
        icon: faFilter,
        title: "Lead Generation",
        href: "/lead-generation",
        description: "We'll bring in prospective customers who fit your business and move them toward a sale.",
        bullets: ["Targeted outreach", "Landing pages and forms", "Lead tracking and follow-up"],
    },
    {
        kind: "business",
        icon: faChartLineUp,
        title: "Growth Marketing",
        href: "/growth-marketing",
        description:
            "Campaigns made for impact, from brand awareness to lead generation to closed sales, with continuous monitoring.",
        bullets: ["Newsletters, branded email", "Social media marketing", "Paid advertising"],
    },
    {
        kind: "business",
        icon: faRoute,
        title: "Process Re-engineering",
        href: "/process-re-engineering",
        description: "We'll map how work gets done today and redesign it to reach your goals faster.",
        bullets: ["Process mapping", "Bottleneck analysis", "Roadmap from A to B"],
    },
];
