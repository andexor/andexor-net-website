# Tasks: Node.js and npm Instead of Bun

All tasks are done (2026-11-12).

## Packages and configuration

- [x] T001 Remove `@types/bun`, add `tsx`, add `engines`, change the `npm` scripts in `package.json`
- [x] T002 Make `sharp` a root dependency with the override `$sharp`; confirm `node_modules/sharp` is the stub
- [x] T003 Replace `trustedDependencies` with `allowScripts` (`@higgsfield/cli` and `workerd` allowed, `esbuild` denied)
- [x] T004 Generate `package-lock.json`; remove `bun.lock`; update `.prettierignore`
- [x] T005 Add `tsconfig.scripts.json`; set `types: ["node"]` in `tsconfig.server.json`

## Code

- [x] T006 [P] `scripts/format-site.ts`, `copy-crawler-files.ts`, `generate-sitemap.ts`: `process.cwd()`, no top-level `await`
- [x] T007 [P] `scripts/image-metadata.ts`: Node APIs, no top-level `await`
- [x] T008 Rewrite `server.ts` on `node:http`
- [x] T009 `playwright.config.ts`: start `node server.ts`

## Docker and shell scripts

- [x] T010 `Dockerfile`: `node:26-slim`, `npm ci`, Node `CMD`
- [x] T011 `build.sh`, `preview.sh`, `deploy.sh`, `update.sh`, `setup.sh`, `install-higgsfield.sh`
- [x] T012 Remove `install-bun.sh` and `install-cf.sh`

## Documents

- [x] T013 Amend the constitution to 2.0.0
- [x] T014 `CLAUDE.md`, `setup.md`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`
- [x] T015 Comments in `wrangler.jsonc` and tests; this spec

## Checks

- [x] T016 `npm ci`, lint, type-check, `npm test` (197 passed), `npm run format:check`, `npm run build`
- [x] T017 Chromium Playwright tests (270 passed) against `node server.ts`
- [x] T018 Docker: build, serve, one SIGINT, shutdown log line, exit 0, no leftover container
- [x] T019 `./setup.sh` regenerated `reports/license-report.md`
