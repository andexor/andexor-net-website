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
    iconLabel: string;
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
        iconLabel: "source code icon",
        title: "Web Development",
        href: "/web-development",
        description:
            "We'll create or update your website with a strong technical foundation to support an increase in traffic and sales.",
        bullets: ["Brochure, blog, forms, shop", "Content management system", "Custom web applications"],
    },
    {
        kind: "technical",
        icon: faServer,
        iconLabel: "web servers icon",
        title: "Web Hosting",
        href: "/web-hosting",
        description:
            "We'll host your site, services, and agents on fast, reliable servers that keep running smoothly even when traffic spikes.",
        bullets: ["Managed cloud servers", "Backups, monitoring, analytics", "Security updates"],
    },
    {
        kind: "technical",
        icon: faMagnifyingGlass,
        iconLabel: "magnifying glass icon",
        title: "Technical SEO",
        href: "/technical-seo",
        description:
            "We'll assess your site's structure and brand identity, then routinely improve visibility in search engines and AI agents.",
        bullets: ["Site audit", "Content strategy", "Google Business Profile, maps"],
    },
    {
        kind: "technical",
        icon: faMicrochipAi,
        iconLabel: "A.I. chip icon",
        title: "Agentic Systems",
        href: "/agentic-systems",
        description:
            "We'll build the agents you need so you can adapt to emerging trends as AI agents handle business transactions.",
        bullets: ["Knowledge base, chatbot", "Answer calls, book meetings", "Agent-to-agent sales"],
    },
    {
        kind: "business",
        icon: faChartLineDown,
        iconLabel: "line chart trending down icon",
        title: "Cost Reduction",
        href: "/cost-reduction",
        description:
            "We'll find where your business spends more than it needs to on software and cut it without compromising quality.",
        bullets: ["Spending review", "Lower cost alternatives", "Workflow automation"],
    },
    {
        kind: "business",
        icon: faFilter,
        iconLabel: "sales funnel icon",
        title: "Lead Generation",
        href: "/lead-generation",
        description:
            "We'll find new sources of customers and qualify them with criteria you specify. Pause and resume when you need to.",
        bullets: ["Targeted outreach", "Landing pages and forms", "Lead tracking and follow-up"],
    },
    {
        kind: "business",
        icon: faChartLineUp,
        iconLabel: "line chart trending up icon",
        title: "Growth Marketing",
        href: "/growth-marketing",
        description:
            "We'll create campaigns made for impact, from brand awareness to closed sales, with continuous monitoring.",
        bullets: ["Branded email, newsletter", "Blog and social media posts", "Reviews, ads, sponsorships"],
    },
    {
        kind: "business",
        icon: faRoute,
        iconLabel: "roadmap icon",
        title: "Process Re-engineering",
        href: "/process-re-engineering",
        description:
            "We'll observe and document how work gets done today, redesign it to reach your goals, and lead your team through every step.",
        bullets: ["Process analysis and design", "Leadership from start to finish", "Training, monitoring, support"],
    },
];
