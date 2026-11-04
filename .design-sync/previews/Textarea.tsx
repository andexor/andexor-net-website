// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Textarea } from "andexor-net-website";

const surface = { background: "var(--surface-page)", padding: 24, maxWidth: 480 } as const;

export const Default = () => (
    <div style={surface}>
        <Textarea
            label="How can we help?"
            name="message"
            rows={4}
            placeholder="Tell us about your business and what you need."
        />
    </div>
);

export const WithCounter = () => (
    <div style={surface}>
        <Textarea
            label="Message"
            name="message"
            rows={4}
            maxLength={500}
            required
            defaultValue="We run three retail stores and want a new website with online booking."
        />
    </div>
);

export const WithHint = () => (
    <div style={surface}>
        <Textarea
            label="Project details"
            name="details"
            rows={3}
            hint="A few sentences is enough. We'll follow up with questions."
        />
    </div>
);

export const Error = () => (
    <div style={surface}>
        <Textarea
            label="Message"
            name="message"
            rows={3}
            required
            error="Please tell us a little about what you need."
        />
    </div>
);
