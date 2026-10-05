// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { NextConfig } from "next";

// The site's own script code goes in one file, static/chunks/site-<hash>.js, and Next's minifier skips it,
// so it stays readable. React, Next.js, and other libraries stay minified in their own files
// (specs/038-readable-generated-code/research.md, section 2).
const SITE_CHUNK = /^static\/chunks\/site-/;

type WebpackAsset = { name: string; source: unknown; info: Record<string, unknown> };
type WebpackCompilation = {
    getAssets(): WebpackAsset[];
    updateAsset(name: string, source: unknown, info: Record<string, unknown>): void;
    hooks: { processAssets: { tap(options: { name: string; stage: number }, callback: () => void): void } };
};
type WebpackCompiler = {
    hooks: { thisCompilation: { tap(name: string, callback: (compilation: WebpackCompilation) => void): void } };
};

// Next's minifier skips assets whose info says they are already minimized. Mark the site chunk that way
// before the minify stage runs.
const keepSiteChunkReadable = {
    apply(compiler: WebpackCompiler) {
        compiler.hooks.thisCompilation.tap("KeepSiteChunkReadable", (compilation) => {
            compilation.hooks.processAssets.tap({ name: "KeepSiteChunkReadable", stage: -1000 }, () => {
                for (const asset of compilation.getAssets()) {
                    if (SITE_CHUNK.test(asset.name)) {
                        compilation.updateAsset(asset.name, asset.source, { ...asset.info, minimized: true });
                    }
                }
            });
        });
    },
};

const nextConfig: NextConfig = {
    output: "export",
    images: {
        unoptimized: true,
    },
    webpack(config, { dev, isServer }) {
        if (!dev && !isServer) {
            config.optimization.splitChunks.cacheGroups.site = {
                test: /[\\/]src[\\/]/,
                name: "site",
                chunks: "all",
                enforce: true,
                priority: 100,
            };
            config.plugins.push(keepSiteChunkReadable);
        }
        return config;
    },
};

export default nextConfig;
