// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { Metadata } from "next";
import { ContentPage } from "@/components/content/ContentPage";

export const metadata: Metadata = {
  title: "Page not found | Andexor Network, Inc.",
};

// Replaces the framework's default 404, which injects its own light
// `body { background: #fff }` and would break the always-dark rule.
export default function NotFound() {
  return (
    <ContentPage
      html={`<h1>Page not found</h1><p>We could not find that page. <a href="/">Go to the home page</a>.</p>`}
    />
  );
}
