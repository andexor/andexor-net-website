// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CTABandProps {
  onContactClick: () => void;
}

// FR-005: restates the invitation to talk, with a "Contact Us" CTA that
// opens the contact popup (FR-007).
export function CTABand({ onContactClick }: CTABandProps) {
  return (
    <section className="an-cta-band">
      <div className="an-cta-band__panel">
        <div className="an-cta-band__copy">
          <h2 className="an-cta-band__heading">
            Let&apos;s talk about your needs and explore solutions, then plan the way forward.
          </h2>
        </div>
        <div className="an-cta-band__action">
          <div aria-hidden="true" className="an-cta-band__glow" />
          <div className="an-cta-band__button-wrap">
            <Button variant="accent" size="lg" rightIcon={<ArrowRight size={18} />} onClick={onContactClick}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
