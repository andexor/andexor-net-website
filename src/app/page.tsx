// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { useState } from "react";
import { ContactPopup } from "@/components/contact/ContactPopup";
import { CTABand } from "@/components/marketing/CTABand";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";

// FR-001: sections render in a fixed order — hero, services, CTA band,
// footer. `contactOpen` is page-level state per contracts/ui-contracts.md's
// page composition contract. FR-007: every "Contact Us" CTA opens the same
// popup.
export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false);

  function openContactPopup() {
    setContactOpen(true);
  }

  function closeContactPopup() {
    setContactOpen(false);
  }

  return (
    <>
      <Hero onContactClick={openContactPopup} />
      <Services />
      <CTABand onContactClick={openContactPopup} />
      <Footer />
      <ContactPopup open={contactOpen} onClose={closeContactPopup} />
    </>
  );
}
