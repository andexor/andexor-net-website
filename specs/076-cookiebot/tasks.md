# Tasks: Cookiebot

**Input**: Design documents from `/specs/076-cookiebot/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/head-element.md, quickstart.md

**Tests**: One behavior test for the element's position and attributes (spec FR-005). No test of banner wording or look.

## Phase 1: Setup

No setup needed: no new dependency, directory, or configuration.

## Phase 2: Foundational

No blocking work. Both user stories are met by the same change.

## Phase 3: User Story 1 - Visitors are asked for cookie consent (Priority: P1)

**Goal**: Every built page has the Cookiebot element as the first element in `<head>`.

**Independent Test**: `bun run build`, then `grep -L '<head><script id="Cookiebot"' out/*.html` prints nothing.

- [x] T001 [US1] In `scripts/format-html.ts`, add an exported constant `COOKIEBOT_SCRIPT` next to `WHITESPACE_SCRIPT` holding exactly `<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="ba75dc6a-d85e-4740-891e-dd0cc31a62dd" type="text/javascript"></script>` (no `async`, no `defer`), with a one-line comment saying why it goes first (spec 076).
- [x] T002 [US1] In `scripts/format-html.ts`, step 6, change the head insertion to `<head>${COOKIEBOT_SCRIPT}${WHITESPACE_SCRIPT}` and update the step's comment and the error message to name both scripts.
- [x] T003 [US1] In `scripts/format-html.ts`, `assertSameDom`, also remove `COOKIEBOT_SCRIPT` before comparing (`formatted.replace(WHITESPACE_SCRIPT, "").replace(COOKIEBOT_SCRIPT, "")`) and update the comment above it.
- [x] T004 [US1] Run `bun run format` and `bun run build`; confirm the build passes (DOM gate, data-script check) and `out/index.html`, `out/404.html`, and a content page start with `<head><script id="Cookiebot"`.
- [x] T005 [US1] Create `tests/e2e/cookiebot.spec.ts` (SPDX header, 4-space Prettier format, no type annotations in callbacks as in `tests/e2e/readable-output.spec.ts`): for `/`, every content route listed from `content/*.md` (excluding `README.md`, as in `tests/e2e/page-metadata.spec.ts`), and `/nope`, fetch the raw HTML with `request.get` and expect the text after `<head>` to start with the Cookiebot element's `id`, `src`, `data-cbid`, and `type` attributes and to have none of `data-blockingmode`, `async`, or `defer`, and expect the element to appear once. Do not assert counts of pages.

**Checkpoint**: Pages carry the element first; `bun run test:e2e -- cookiebot readable-output` passes (port 3000 free).

## Phase 4: User Story 2 - New pages get the script without extra work (Priority: P2)

**Goal**: A new Markdown page gets the element with no per-page change.

**Independent Test**: Add a temporary `.md` file to `content/`, build, and read its page source; then remove the file.

- [x] T006 [US2] Confirm by the T005 test (it lists routes from `content/`) and by a temporary page that a new page starts with the element; delete the temporary page and its build output afterward. No code change expected.

## Phase 5: Polish

- [x] T007 Run `bun run format:check` and the straight-quotes test (`tests/unit/straight-quotes.test.ts`); grep the changed files for typographic quotes.
- [x] T008 Run the full `bun run test:e2e` and unit tests to confirm hydration, accessibility, and performance tests still pass with the new script; then check that port 3000 is free.
- [x] T009 Update the head-order note in the Formatting section of `CLAUDE.md` ("Adds one small inline script first in each page's `<head>`") to say the Cookiebot element goes before it.

## Dependencies

T001 -> T002 -> T003 -> T004 -> T005 -> T006 -> T007 -> T008. T009 can run any time after T002.

## Parallel Opportunities

T005 (new test file) can be written while T001 to T003 are done, but it is checked only after T004. T009 touches only `CLAUDE.md`.

## Implementation Strategy

MVP is Phase 3 (User Story 1); User Story 2 is covered by the same change and only needs the check in T006.

## Added during implementation

Cookiebot refuses localhost (the domain is not in its domain group), so
the e2e tests answer its requests with an empty script (`tests/e2e/fixtures.ts`, `stubCookiebot`). The 44 specs import
`test` from `./fixtures`; `performance.spec.ts`, `responsive.spec.ts`, and `readable-output.spec.ts`, which make their
own browsers or contexts, call `stubCookiebot` too.
