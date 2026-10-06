# syntax=docker/dockerfile:1

# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Andexor Network, Inc.
# Author: Ed Jenkins <ed@andexor.net>

# ---- Build stage ------------------------------------------------------------
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
# The `sharp` override in package.json points at this local stub (keeps LGPL libvips out).
COPY stubs ./stubs

# The FontAwesome Pro icons need the auth token in .npmrc. It is mounted as a BuildKit secret for this one command,
# so it is never copied into an image layer (build.sh passes it with --secret id=npmrc,src=.npmrc).
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc bun install --frozen-lockfile

COPY . .

# next.config.* must set `output: "export"` (Static Site Generation) so
# `next build` emits a fully static site to ./out, with no server needed.
RUN bun run build

# ---- Runtime stage ------------------------------------------------------------
# The site is static output, so the runtime stage just serves files — no
# Next.js server process, no Node.js, only Bun.
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV PORT=3000

RUN useradd --create-home andexor

COPY --from=builder --chown=andexor:andexor /app/out ./out
COPY --from=builder --chown=andexor:andexor /app/server.ts ./server.ts

USER andexor
EXPOSE 3000

CMD ["bun", "run", "server.ts"]
