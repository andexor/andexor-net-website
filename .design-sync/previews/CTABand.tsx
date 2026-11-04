// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { CTABand } from "andexor-net-website";

export const Default = () => (
    <div style={{ background: "var(--surface-page)", padding: "24px 0" }}>
        <CTABand onContactClick={() => {}} />
    </div>
);

export const ServicePage = () => (
    <div style={{ background: "var(--surface-page)", padding: "24px 0" }}>
        <CTABand onContactClick={() => {}} heading="Ready for a faster, more reliable website? Let's plan your move." />
    </div>
);
