// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Input } from "andexor-net-website";

const surface = {
    background: "var(--surface-page)",
    padding: 24,
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 16,
} as const;

export const Default = () => (
    <div style={surface}>
        <Input label="Name" name="name" placeholder="Jordan Rivera" autoComplete="name" />
        <Input label="Email" name="email" type="email" placeholder="jordan@example.com" required />
    </div>
);

export const WithHint = () => (
    <div style={surface}>
        <Input label="Company" name="company" hint="Optional. Helps us prepare for the call." />
    </div>
);

export const Error = () => (
    <div style={surface}>
        <Input
            label="Email"
            name="email"
            type="email"
            required
            defaultValue="jordan@"
            error="Enter a full email address, like jordan@example.com."
        />
    </div>
);

export const Disabled = () => (
    <div style={surface}>
        <Input label="Reference number" name="reference" defaultValue="AN-2026-0142" disabled />
    </div>
);
