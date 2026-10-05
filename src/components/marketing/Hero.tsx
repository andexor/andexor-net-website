// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Logo } from "./Logo";

// FR-002: brand + headline value proposition. The "Contact Us" CTA lives in
// the CTA band only.
export function Hero() {
    return (
        <section id="top" className="an-hero">
            <div aria-hidden="true" className="an-hero__grid-overlay" />
            <div className="an-hero__inner">
                <div className="an-hero__brand-row">
                    <div aria-hidden="true" className="an-hero__glow" />
                    <Logo size="hero" light />
                </div>
                <h1 className="an-hero__headline">Enterprise services for small business</h1>
                <p className="an-hero__subhead">We create and manage solutions to help your business grow.</p>
            </div>
        </section>
    );
}
