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

// Shell for Markdown-authored pages: logo bar, article, then the shared
// footer. `html` and `cards` are produced at build time from repo-owned
// Markdown files (src/lib/content.ts), never from user input.
export function ContentPage({ html, cards }: ContentPageProps) {
  return (
    <div id="top">
      <header className="an-content-header">
        <div className="an-content-header__inner">
          <Logo href="/" />
        </div>
      </header>
      {cards ? (
        <main>
          <section className="an-cardhero">
            <div className="an-cardhero__grid" aria-hidden="true" />
            <div className="an-cardhero__inner">
              {cards.image && (
                <div className="an-cardhero__art">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized */}
                  <img src={cards.image.src} alt={cards.image.alt} width={1024} height={1024} />
                </div>
              )}
              <div className="an-cardhero__text">
                {cards.eyebrow && <p className="an-cardhero__eyebrow">{cards.eyebrow}</p>}
                <h1 dangerouslySetInnerHTML={{ __html: cards.headingHtml }} />
                {cards.introHtml && (
                  <div className="an-cardhero__intro" dangerouslySetInnerHTML={{ __html: cards.introHtml }} />
                )}
              </div>
            </div>
          </section>
          <div className="an-cards" dangerouslySetInnerHTML={{ __html: cards.cardsHtml }} />
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
