// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Badge } from "andexor-net-website";

const surface = {
    background: "var(--surface-page)",
    padding: 24,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
} as const;

export const Tones = () => (
    <div style={surface}>
        <Badge tone="neutral">Small business</Badge>
        <Badge tone="brand">Technical</Badge>
        <Badge tone="accent">SEO</Badge>
        <Badge tone="success">Online</Badge>
        <Badge tone="warning">Renewal due</Badge>
        <Badge tone="danger">Outage</Badge>
        <Badge tone="solid">Enterprise</Badge>
    </div>
);

export const WithDot = () => (
    <div style={surface}>
        <Badge tone="success" dot>
            All systems running
        </Badge>
        <Badge tone="warning" dot>
            Maintenance tonight
        </Badge>
        <Badge tone="danger" dot>
            Site down
        </Badge>
    </div>
);
