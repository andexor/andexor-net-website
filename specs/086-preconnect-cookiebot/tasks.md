# Tasks: Preconnect to the Cookiebot CDN

**Input**: Design documents from `/specs/086-preconnect-cookiebot/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: one small unit check that built pages contain the hint (behavior, not wording).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: the user story the task serves (US1)

## Phase 1: Setup

No setup needed: no new dependency or configuration.

## Phase 2: Foundational

No blocking prerequisites.

## Phase 3: User Story 1 - Faster first view of the page (Priority: P1) MVP

**Goal**: every built page opens its connection to `https://consentcdn.cookiebot.com` early.

**Independent Test**: build the site; every page's head has the preconnect link before the Cookiebot script; the build's same-DOM check passes; Lighthouse no longer lists the origin under "Preconnect to required origins".

- [X] T001 [US1] In `scripts/format-html.ts`, export `COOKIEBOT_PRECONNECT = '<link rel="preconnect" href="https://consentcdn.cookiebot.com" crossorigin="">'` next to `COOKIEBOT_SCRIPT`, with a doc comment citing spec 086. Write it in step 6 as `<head>${COOKIEBOT_PRECONNECT}${COOKIEBOT_SCRIPT}${WHITESPACE_SCRIPT}...` (glued, no whitespace), and add `.replace(COOKIEBOT_PRECONNECT, "")` to the chain in `assertSameDom` (including the error message text in step 6 if it lists the injected scripts).
- [X] T002 [US1] In `tests/unit/build-output.test.ts`, add one `it` in the "built site" block: every built `.html` page contains `COOKIEBOT_PRECONNECT`, and it appears before `<script id="Cookiebot"`. No count assertions.
- [X] T003 [P] [US1] In `CLAUDE.md`, in the `bun run build` bullet that lists what the script adds to each `<head>`, say the Cookiebot script is preceded by a preconnect link for `https://consentcdn.cookiebot.com` (spec 086).

**Checkpoint**: `bun run build` succeeds and `out/index.html` has the link before the Cookiebot script.

## Phase 4: Polish

- [X] T004 Run `bun run format:check`, `bun run build`, `bun run test`, and the checks in `specs/086-preconnect-cookiebot/quickstart.md` (`bun run test:e2e` needs port 3000 free).
- [X] T005 Search the changed files for curly quotes and for hover underlines; fix any found.

## Dependencies and Execution Order

- T001 first. T002 needs T001's export. T003 is independent.
- T004 and T005 run after T001-T003.

## Implementation Strategy

One story, so the MVP is the whole feature: T001-T003, then verify with T004 and T005. Do not commit until the owner has viewed the result. Lighthouse numbers are checked by the owner on the deployed or served site.
