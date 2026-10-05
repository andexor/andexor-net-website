---

description: "Task list for Readable Generated Code"
---

# Tasks: Readable Generated Code

**Input**: Design documents from `/specs/038-readable-generated-code/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/formatting-rules.md, quickstart.md

**Tests**: Included. Principle V requires tests alongside the change, and the plan names two. No test may assert a
count of files, lines, or cards (project rule); assert rules, and name the file on failure.

**Organization**: By user story. Every new `.ts` file starts with the SPDX license header from `CLAUDE.md`.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Update `.prettierrc.json` to `semi: true`, `singleQuote: false`, `trailingComma: "all"`, `printWidth: 120`, `tabWidth: 4`, `useTabs: false`
- [X] T002 [P] Create `.prettierignore` listing `design/`, `out/`, `.next/`, `node_modules/`, `specs/`, `content/`, `reports/`, `playwright-report/`, `test-results/`, `bun.lock`, `*.md`, `tsconfig.tsbuildinfo`
- [X] T003 Add scripts to `package.json`: `"format": "prettier --write ."`, `"format:check": "prettier --check ."`. Run Prettier through Bun (no `node` on this machine). Do not change dependencies

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: The file-group lookup that both the build pass and the tests use (data-model.md), so they cannot disagree.

- [X] T004 Create `scripts/site-files.ts` exporting a function that maps a path under `out/` or the repo to one group: site source, built HTML, built site CSS, built site JS (`out/_next/static/chunks/site-*.js`), built third-party JS (every other chunk), or out of scope. Also export `isMinified(text)`: true when the text has no indented line and some line is over 1,000 characters. Include the license header
- [X] T005 [P] Create `tests/unit/site-files.test.ts` checking the lookup puts `site-*.js` in the site JS group, `framework-*.js` in third-party, `design/**` and `*.md` out of scope. Assert group membership only, not counts

**Checkpoint**: the lookup exists and is tested.

---

## Phase 3: User Story 1 - Every page's HTML reads cleanly (Priority: P1) MVP

**Goal**: All built HTML is indented at 4 spaces, with no `>` starting a line, and still hydrates without errors.

**Independent Test**: `bun run build`, open `out/index.html`, `out/web-development.html`, and `out/404.html`; they are multi-line and indented, and the three pages load with no console errors.

### Tests for User Story 1

- [X] T006 [P] [US1] Write `tests/unit/format-html.test.ts` for the HTML formatter's functions (T008): output has no tab, indentation is a multiple of 4, no line starts with `>`, the whitespace script appears once first in `<head>` glued to the next tag, `<noscript>` content is byte-identical, paragraph text is not re-wrapped, and the DOM gate throws naming the file when a text node gains a newline or the original already contains one
- [X] T007 [P] [US1] Write `tests/e2e/readable-output.spec.ts`: load `/`, `/web-development`, and the not-found page, reloading each several times, and fail on any console error or page error (a hydration mismatch is React error #418). The existing e2e suite covers behavior

### Implementation for User Story 1

- [X] T008 [US1] Create `scripts/format-html.ts` implementing research.md section 4 steps 1 to 5: swap `<noscript>` blocks for placeholder elements; replace spaces and newlines in text nodes with private-use placeholders (skip `<script>` and `<style>`); run Prettier with `htmlWhitespaceSensitivity: "ignore"`, `bracketSameLine: true`, `tabWidth: 4`, `printWidth: 120`, and `--ignore-path` pointing at an empty file (Prettier silently skips `out/` because it is gitignored); restore placeholders and `<noscript>`; insert the whitespace-stripping script first in `<head>` with no whitespace after it; run the DOM gate
- [X] T009 [US1] In `scripts/format-html.ts`, write the whitespace-stripping script as a constant (MutationObserver plus an initial sweep; removes whitespace-only text nodes containing a newline and trims newline whitespace at text edges; skips `pre`, `textarea`, `script`, `style`, `noscript`), formatted readably in 4-space style. Reference prototype: scratchpad `proto2.py`
- [X] T010 [US1] In `scripts/format-html.ts`, implement the DOM gate: parse the original and the formatted HTML into token streams (tags, comments, text outside `script`/`style`/`noscript`), apply the same stripping rule to the formatted one, compare, and throw with the file name and first difference. Also throw if the original has a whitespace-only text node or a text node containing a newline
- [X] T011 [US1] Create `scripts/format-site.ts` that finds every `out/**/*.html`, formats each with `scripts/format-html.ts`, and fails the build if a file was not changed (guards the gitignore skip). Include the license header
- [X] T011a [US1] Change the `build` script in `package.json` to `"next build && bun scripts/format-site.ts"` (only now that the script exists)
- [X] T012 [US1] Run `bun run build` and check the three pages with `bun run test:e2e --project=chromium -g readable-output`; fix any hydration error
- [X] T013 [US1] Format the inline `<script>` bodies in the built HTML (Prettier, babel parser, 4 spaces) inside `scripts/format-html.ts`, and restyle `FONT_LOADER_SCRIPT` in `src/app/layout.tsx` to 4 spaces. Keep it inline

**Checkpoint**: Built HTML is readable and hydrates cleanly. This is the MVP.

---

## Phase 4: User Story 2 - Site-specific CSS and JavaScript stay readable (Priority: P1)

**Goal**: The site's own code is formatted, unminified, and in its own files, in the repo and in `out/`.

**Independent Test**: After a build, `out/_next/static/chunks/site-*.js` and the site CSS are multi-line and 4-space indented; no other chunk contains site code.

### Tests for User Story 2

- [X] T014 [P] [US2] Write `tests/unit/build-output.test.ts` (runs only when `out/` exists): `site-*.js` is not minified (`isMinified` is false) and contains `ContactProvider`; the site CSS is not minified; no other chunk contains `an-hero` or `ContactProvider`. Name the file on failure; no counts

### Implementation for User Story 2

- [X] T015 [US2] In `next.config.ts`, add a `webpack` function for production client builds: a `splitChunks` cache group `site` (`test: /[\\/]src[\\/]/`, `name: "site"`, `chunks: "all"`, `enforce: true`, `priority: 100`)
- [X] T016 [US2] In `next.config.ts`, add a small inline plugin (`KeepSiteReadable`) that hooks `compilation.hooks.processAssets` at stage `-1000` and sets `info.minimized = true` on assets matching `static/chunks/site-` so Next's minifier skips them. Comment why
- [X] T017 [US2] In `scripts/format-site.ts`, run Prettier (with the ignore-path override) over `out/_next/static/css/*.css` and `out/_next/static/chunks/site-*.js`. Leave other chunks alone
- [X] T018 [US2] Reformat the TypeScript, TSX, CSS, and config source with `bun run format` in one mechanical change: `src/`, `tests/`, `server.ts`, `scripts/`, root `*.ts` and `*.mjs`. Confirm license headers are still first and `bun run lint` and `bun run test` pass. Keep this change separate from behavior changes
- [X] T019 [US2] Grep the reformatted CSS for hover underlines (`text-decoration: underline` under `:hover`) and for `#top` links; the existing `no-hover-underline` and `no-top-links` tests must pass (Principles IV and VI)
- [X] T020 [US2] Build and run the full e2e suite on chromium (`bun run test:e2e --project=chromium`) to confirm nothing visible or behavioral changed, including the Contact Us popup (FR-007). Visual comparison is T020a
- [X] T020a [US2] Add `tests/e2e/visual-parity.spec.ts`: for `/`, `/web-development`, and the not-found page at 360, 768, and 1280 px, take a full-page screenshot and compare it with a baseline captured from the build before this feature (build `main` first). Baselines go in `tests/e2e/visual-parity.spec.ts-snapshots/` and are deleted once the owner accepts the change

**Checkpoint**: Custom code is separate, readable, and the site behaves as before.

---

## Phase 5: User Story 3 - Third-party code may be compact (Priority: P2)

**Goal**: Third-party code stays minified and contains no site code; site changes touch only custom files.

**Independent Test**: Change one line in a component, rebuild, and only `site-*.js` changes hash.

- [X] T021 [US3] Confirm `framework-*`, `main-*`, `polyfills-*`, `webpack-*`, and the vendor chunks are not Prettier-formatted by `scripts/format-site.ts` (T017 only touches `site-*`), and extend `tests/unit/build-output.test.ts` to assert no vendor chunk contains site code
- [X] T022 [US3] Verify the change-isolation scenario from the spec by hand (edit a string in `src/components/marketing/Hero.tsx`, rebuild, compare chunk hashes), then revert. Record the result in a note in `specs/038-readable-generated-code/quickstart.md`

---

## Phase 6: User Story 4 - Formatting stays enforced (Priority: P2)

**Goal**: A badly formatted custom file fails the checks and names the file.

**Independent Test**: Put a tab in `src/styles/cards.css`; `bun run test` fails naming it.

- [X] T023 [P] [US4] Write `tests/unit/formatting.test.ts`: for each in-scope source file (via `scripts/site-files.ts`), fail with `<file>: <rule> (line N)` on a tab, indentation not a multiple of 4, or a minified body (`isMinified` from `scripts/site-files.ts`). Also check the built custom files when `out/` exists. No file or line counts
- [X] T024 [US4] Make `bun run test` also run `format:check` through a Vitest test that spawns Prettier `--check` and reports unformatted files by name
- [X] T025 [US4] Prove the check: add a tab to a copy of a CSS file, run the test, see it fail with the file name, remove the copy

---

## Phase 7: Polish & Cross-Cutting

- [X] T026 [P] Record the rule (FR-010): add a short "Formatting" section to `CLAUDE.md` and `CONTRIBUTING.md` (4 spaces, width 120, Prettier, custom code unminified and separate, the whitespace script and why), and add it to `content/README.md` only if authors need it
- [X] T027 Amend `.specify/memory/constitution.md` to 1.5.0 (MINOR): a formatting rule under Technology Constraints and a Sync Impact Report entry
- [X] T028 Update `specs/038-readable-generated-code/spec.md` Status to Implemented once done
- [X] T029 Run `./setup.sh` only if `package.json` dependencies changed (they should not have)
- [X] T030 Docker check: `./build.sh`, `./run.sh`, open `http://localhost:3000`, view source, press `Ctrl+C` once, confirm the shutdown log line and no leftover container in `docker ps -a` (Principle VII)
- [X] T031 Run every step of `quickstart.md` and list the built-output lines over 120 characters; confirm each is one that cannot be broken without changing the page
- [X] T032 Commit with `git commit -s`, subject ending `Closes #21.`, and note in the message that the source reformat is its own commit

---

## Dependencies & Order

- Phase 1 then Phase 2, then US1 (MVP). US2 can start after Phase 2 in parallel with US1 for `next.config.ts`, but T017 edits the same `scripts/format-site.ts` as T011, so do T011 first.
- US3 and US4 depend on US2 (the `site` chunk exists).
- T018 (mechanical reformat) should happen after T015 and T016 so the config lands formatted, and before T020.
- Polish last.

## Parallel Examples

- T002 with T001 and T003 (different files).
- T006 and T007 together (different test files).
- T014 and T023 together once their prerequisites exist.

## Implementation Strategy

1. MVP: Phases 1, 2, and 3. HTML is readable and hydrates cleanly.
2. Add US2 (separate unminified site chunk, CSS formatting, source reformat).
3. Add US3 checks and US4 enforcement.
4. Polish, docs, constitution, Docker check.
