// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Footer } from "@/components/marketing/Footer";
import { Logo } from "@/components/marketing/Logo";

export interface ContentPageProps {
  html: string;
}

// Shell for Markdown-authored pages: logo bar, article, then the shared
// footer. `html` is produced at build time from repo-owned Markdown files
// (src/lib/content.ts), never from user input.
export function ContentPage({ html }: ContentPageProps) {
  return (
    <div id="top">
      <header className="an-content-header">
        <div className="an-content-header__inner">
          <Logo href="/" />
        </div>
      </header>
      <main className="an-content">
        <article className="an-prose" dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      <Footer />
    </div>
  );
}
