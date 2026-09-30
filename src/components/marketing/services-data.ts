// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Bot, Code2, LineChart, Search, type LucideIcon } from "lucide-react";

export interface ServiceOffering {
  icon: LucideIcon;
  tag: string;
  badgeTone: "brand" | "accent";
  title: string;
  href?: string;
  description: string;
  bullets: string[];
}

// Per data-model.md's "Service Offering" table and design/README.md's Services
// section (FR-004). Exactly 4 entries, fixed content.
export const SERVICES: ServiceOffering[] = [
  {
    icon: Code2,
    tag: "Web",
    badgeTone: "brand",
    title: "Web Development",
    href: "/web-development",
    description:
      "We'll create or update your site with a strong technical foundation to handle an increase in traffic and sales.",
    bullets: ["Brochure site, blog, forms, shop", "Content management system", "Web application"],
  },
  {
    icon: Search,
    tag: "SEO",
    badgeTone: "accent",
    title: "Technical SEO",
    description:
      "We'll assess your site's structure and brand identity, then improve visibility in search engines and AI agents.",
    bullets: ["Site audit", "Content strategy", "Maps, social media"],
  },
  {
    icon: Bot,
    tag: "AI",
    badgeTone: "brand",
    title: "Agentic Systems",
    description:
      "We'll build the agents you need so you can adapt to emerging trends as AI agents handle business transactions.",
    bullets: ["Knowledge Base", "Digital assistant, scheduling", "Workflow automation"],
  },
  {
    icon: LineChart,
    tag: "Growth",
    badgeTone: "accent",
    title: "Growth Marketing",
    description:
      "Campaigns made for impact, from brand awareness to lead generation to closed sales, with continuous monitoring.",
    bullets: ["Newsletters, branded email", "Social media marketing", "Paid advertising"],
  },
];
