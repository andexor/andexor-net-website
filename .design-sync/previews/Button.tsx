// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Button } from "andexor-net-website";

// The site is always dark, so every cell sits on the page surface.
const surface = {
    background: "var(--surface-page)",
    padding: 24,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
} as const;
const ink = { ...surface, background: "var(--blue-800)" } as const;

export const Variants = () => (
    <div style={surface}>
        <Button variant="accent">Contact Us</Button>
        <Button variant="primary">See our services</Button>
        <Button variant="secondary">Read the case study</Button>
        <Button variant="ghost">Learn more</Button>
        <Button variant="danger">Cancel request</Button>
    </div>
);

export const Sizes = () => (
    <div style={surface}>
        <Button variant="accent" size="sm">
            Contact Us
        </Button>
        <Button variant="accent" size="md">
            Contact Us
        </Button>
        <Button variant="accent" size="lg">
            Contact Us
        </Button>
    </div>
);

export const OnInk = () => (
    <div style={ink}>
        <Button variant="secondary" onInk>
            Our approach
        </Button>
        <Button variant="ghost" onInk>
            Learn more
        </Button>
    </div>
);

export const States = () => (
    <div style={{ ...surface, flexDirection: "column", alignItems: "stretch", maxWidth: 360 }}>
        <Button variant="accent" size="lg" disabled>
            Sending...
        </Button>
        <Button variant="primary" block>
            Request a proposal
        </Button>
        <Button as="a" href="/web-development" variant="secondary">
            Web Development
        </Button>
    </div>
);
