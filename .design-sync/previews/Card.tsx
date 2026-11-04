// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Badge, Button, Card } from "andexor-net-website";

const surface = {
    background: "var(--surface-page)",
    padding: 24,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 280px))",
    gap: 16,
} as const;

export const Default = () => (
    <div style={surface}>
        <Card>
            <h3 style={{ marginBottom: 8 }}>Web Hosting</h3>
            <p style={{ margin: 0 }}>
                We'll host your site, services, and agents on fast, reliable servers that keep running smoothly even
                when traffic spikes.
            </p>
        </Card>
        <Card ink>
            <Badge tone="accent">New</Badge>
            <h3 style={{ margin: "12px 0 8px" }}>Agentic Systems</h3>
            <p style={{ margin: "0 0 16px" }}>Agents that answer customers and handle routine work around the clock.</p>
            <Button variant="accent" size="sm">
                Contact Us
            </Button>
        </Card>
    </div>
);

export const LinkCard = () => (
    <div style={surface}>
        <Card hover as="a" href="/technical-seo">
            <h3 style={{ marginBottom: 8 }}>Technical SEO</h3>
            <p style={{ margin: 0 }}>
                We'll assess your site's structure and brand identity, then routinely improve visibility in search
                engines.
            </p>
        </Card>
        <Card hover as="a" href="/lead-generation">
            <h3 style={{ marginBottom: 8 }}>Lead Generation</h3>
            <p style={{ margin: 0 }}>We'll find new sources of customers and qualify them before they reach you.</p>
        </Card>
    </div>
);
