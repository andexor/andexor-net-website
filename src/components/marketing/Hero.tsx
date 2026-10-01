// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";

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
          <Logo size="hero" light />
        </div>
        <h1 className="an-hero__headline">Enterprise services for small business</h1>
        <p className="an-hero__subhead">
          We create and manage solutions to help your business grow.
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
