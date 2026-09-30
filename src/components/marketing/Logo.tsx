// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

export interface LogoProps {
  light?: boolean;
  size?: "default" | "hero";
  href?: string;
}

// The one logo lockup: mark plus the single-line "Andexor Network" wordmark
// (specs/003-logo-wordmark). With `href` it is a link; without, a plain block
// (the footer and the home page hero). It never links to `#top`
// (specs/008-no-top-links). The mark is decorative because the adjacent text
// already names the brand.
export function Logo({ light = false, size = "default", href }: LogoProps) {
  const className = [
    "an-logo-lockup",
    light && "an-logo-lockup--light",
    size === "hero" && "an-logo-lockup--hero",
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset, no next/image optimization needed for static export */}
      <img src="/logo/logo-gold.svg" alt="" className="an-logo-mark" />
      <span className="an-logo-wordmark">Andexor Network</span>
    </>
  );
  return href === undefined ? (
    <div className={className}>{content}</div>
  ) : (
    <a href={href} className={className}>
      {content}
    </a>
  );
}
