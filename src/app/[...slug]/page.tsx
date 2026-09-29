// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content/ContentPage";
import { getContentPage, listContentSlugs } from "@/lib/content";

// Every Markdown file under content/ is rendered to static HTML at build
// time. Unknown paths 404 (required by `output: "export"`).
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// `output: "export"` rejects an empty list, so with no content yet we emit a
// single placeholder route that resolves to no page (and therefore 404s).
export function generateStaticParams() {
  const slugs = listContentSlugs();
  return (slugs.length > 0 ? slugs : [["_no-content"]]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getContentPage((await params).slug);
  if (!page) return {};
  return {
    title: `${page.title} | Andexor Network, Inc.`,
    ...(page.description ? { description: page.description } : {}),
  };
}

export default async function MarkdownPage({ params }: PageProps) {
  const page = await getContentPage((await params).slug);
  if (!page) notFound();
  return <ContentPage html={page.html} cards={page.cards} />;
}
