# Implementation Plan: Remove Docker

**Spec**: [spec.md](spec.md) | **Created**: 2026-11-12

## Constitution Check

| Principle                              | Result                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| I. Simplicity and YAGNI                | Removes a build target, a runtime image, and two scripts that nothing uses.                    |
| VII. Graceful container shutdown       | Retired by this change (constitution 3.0.0, MAJOR), because no container runs.                 |
| Technology Constraints                 | The Docker workflow bullet is removed. Hosting stays Cloudflare Workers with static assets.    |

## Changes

- Removed: `Dockerfile`, `.dockerignore`, `build.sh`, `debug.sh`, the Docker `run.sh`.
- Renamed: `preview.sh` to `run.sh` (`npm update && npm run build && npm run preview`). `deploy.sh` now runs `npm run sitemap` first.
- Documents: constitution 3.0.0, `CLAUDE.md`, `README.md`, `content/README.md`, `SECURITY.md`, `setup.md`.
- Comments: `server.ts`, `playwright.config.ts`, `scripts/generate-sitemap.ts`.
- Also removed: `install-docker.sh` and the Docker section of `setup.md`.
- Not changed: specs 001 to 094.
