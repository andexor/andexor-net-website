// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface HeroProps {
  onContactClick: () => void;
}

// FR-002, FR-003: brand + headline value proposition + a "Contact Us" CTA
// that opens the contact popup. Per design/README.md's Hero section.
export function Hero({ onContactClick }: HeroProps) {
  return (
    <section id="top" className="an-hero">
      <div aria-hidden="true" className="an-hero__grid-overlay" />
      <div className="an-hero__inner">
        <div className="an-hero__brand-row">
          <div aria-hidden="true" className="an-hero__glow" />
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset, no next/image optimization needed for static export */}
          <img src="/logo/logo-gold.svg" alt="" className="an-hero__logo" />
          <span className="an-hero__brand-name">Andexor Network</span>
        </div>
        <h1 className="an-hero__headline">Enterprise-grade services at small business prices</h1>
        <p className="an-hero__subhead">
          Andexor Network designs, builds, and manages solutions to help your business grow.
        </p>
        <div className="an-hero__cta-row">
          <Button variant="accent" size="lg" rightIcon={<ArrowRight size={18} />} onClick={onContactClick}>
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
