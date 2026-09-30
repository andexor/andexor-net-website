// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { useContact } from "@/components/contact/ContactProvider";
import { CTABand } from "@/components/marketing/CTABand";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";

// FR-001: sections render in a fixed order — hero, services, CTA band,
// footer. The Contact Us popup is rendered once by ContactProvider in the root
// layout (spec 014). FR-007: every "Contact Us" CTA opens that same popup.
export default function HomePage() {
  const { openContact } = useContact();

  return (
    <>
      <Hero onContactClick={() => openContact()} />
      <Services />
      <CTABand onContactClick={() => openContact()} />
      <Footer />
    </>
  );
}
