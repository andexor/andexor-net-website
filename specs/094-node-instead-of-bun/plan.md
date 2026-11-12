# Implementation Plan: Node.js and npm Instead of Bun

**Spec**: [spec.md](spec.md) | **Created**: 2026-11-12

## Technical Context

- **Language and runtime**: TypeScript on Node.js 26 with npm. Scripts run with `tsx`; `server.ts` runs on Node's own
  TypeScript support.
- **Framework and hosting**: unchanged (Next.js static export, Cloudflare Workers with static assets).
- **Testing**: Vitest, Playwright. Unchanged, except that Playwright starts `node server.ts`.
- **Research and data model**: none. No new data, no new contract.

## Constitution Check

| Principle                                      | Result                                                                                                           |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| I. Simplicity and YAGNI                        | One new development dependency, `tsx`, justified in the spec: the scripts use a path alias and a `.tsx` file.    |
| II. Modern component-based stack               | Unchanged.                                                                                                       |
| V. Test-first quality gates                    | No test is written about the toolchain. The existing unit and end-to-end tests are the check.                     |
| VII. Graceful container shutdown               | Kept, and verified by sending one SIGINT to the built image.                                                     |
| Technology Constraints, runtime and tooling    | Reversed on purpose. The constitution is amended to 2.0.0 (MAJOR) in this change.                                |
| Licenses                                       | `sharp` is still the stub. The license report is regenerated.                                                    |

## Changes

- `package.json`: scripts use `tsx` and `npm`; `@types/bun` removed; `tsx` added; `engines`; `allowScripts` replaces
  `trustedDependencies`; the sharp stub is a root dependency and the override is `$sharp`.
- `package-lock.json` added, `bun.lock` removed, `tsconfig.scripts.json` added, `tsconfig.server.json` uses
  `types: ["node"]`.
- `scripts/*.ts`: `process.cwd()` for the root, no top-level `await`.
- `server.ts`: rewritten on `node:http` (content types, HEAD, 405, traversal guard, 404 page, graceful shutdown).
- `Dockerfile`: `node:26-slim` for both stages, `npm ci`, `CMD ["node", ..., "server.ts"]`.
- Shell scripts: `build.sh`, `preview.sh`, `deploy.sh`, `update.sh`, `setup.sh`, `install-higgsfield.sh`.
  `install-bun.sh` and `install-cf.sh` removed.
- `playwright.config.ts`, `wrangler.jsonc`, `.prettierignore`, and comments in tests and scripts.
- Documents: constitution (2.0.0), `CLAUDE.md`, `setup.md`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`.
- Not changed: specs 001 to 093, and the sentences in the constitution's version history that name the old commands.
