// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { CardsLayout } from "@/lib/content";
import { Footer } from "@/components/marketing/Footer";
import { Logo } from "@/components/marketing/Logo";

export interface ContentPageProps {
    html: string;
    cards?: CardsLayout;
}

// Shell for Markdown-authored pages and the not-found page: logo bar, article
// or card hero, then the shared footer. `html` and `cards` are produced at build time from repo-owned
// Markdown files (src/lib/content.ts), never from user input.
export function ContentPage({ html, cards }: ContentPageProps) {
    // A hero with no cards (the not-found page) gets a compact bottom edge.
    const hasCards = Boolean(cards && cards.cardsHtml);
    return (
        <div id="top">
            <header className="an-content-header">
                <div className="an-content-header__inner">
                    <Logo href="/" />
                </div>
            </header>
            {cards ? (
                <main>
                    <section
                        className={`an-cardhero${cards.section ? ` an-cardhero--${cards.section}` : ""}${hasCards ? "" : " an-cardhero--solo"}`}
                    >
                        {cards.section && <div className="an-cardhero__pattern" aria-hidden="true" />}
                        <div className="an-cardhero__inner">
                            {cards.image && (
                                <div className="an-cardhero__art">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
                                    <img src={cards.image.src} alt={cards.image.alt} width={1024} height={1024} />
                                </div>
                            )}
                            <div className="an-cardhero__text">
                                {cards.eyebrow ? (
                                    <p className="an-cardhero__eyebrow">{cards.eyebrow}</p>
                                ) : (
                                    // Same height as an eyebrow, so the headline lines up with pages that have one.
                                    <p className="an-cardhero__spacer" aria-hidden="true">
                                        {"\u00a0"}
                                    </p>
                                )}
                                <h1 dangerouslySetInnerHTML={{ __html: cards.headingHtml }} />
                                {cards.introHtml && (
                                    <div
                                        className="an-cardhero__intro"
                                        dangerouslySetInnerHTML={{ __html: cards.introHtml }}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                    {hasCards && <div className="an-cards" dangerouslySetInnerHTML={{ __html: cards.cardsHtml }} />}
                </main>
            ) : (
                <main className="an-content">
                    <article className="an-prose" dangerouslySetInnerHTML={{ __html: html }} />
                </main>
            )}
            <Footer />
        </div>
    );
}
