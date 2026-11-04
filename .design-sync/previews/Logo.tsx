// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Logo } from "andexor-net-website";

export const OnDark = () => (
    <div style={{ background: "var(--surface-page)", padding: 24 }}>
        <Logo light />
    </div>
);

export const HeaderLink = () => (
    <div style={{ background: "var(--surface-page)", padding: 24 }}>
        <Logo light href="/" />
    </div>
);

export const Hero = () => (
    <div style={{ background: "var(--surface-page)", padding: 24 }}>
        <Logo light size="hero" />
    </div>
);
