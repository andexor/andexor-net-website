// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

export interface LogoProps {
  light?: boolean;
  compact?: boolean;
  href?: string;
}

export function Logo({ light = false, compact = false, href = "#top" }: LogoProps) {
  return (
    <a href={href} className="an-logo-lockup">
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset, no next/image optimization needed for static export */}
      <img src="/logo/logo-gold.svg" alt="Andexor Network" className="an-logo-mark" />
      {!compact && (
        <span className={`an-logo-wordmark${light ? " an-logo-wordmark--light" : ""}`}>
          <span className="an-logo-name">Andexor</span>
          <span className="an-logo-tagline">Network, Inc.</span>
        </span>
      )}
    </a>
  );
}
