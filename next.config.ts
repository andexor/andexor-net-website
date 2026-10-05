// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
