---

description: "Task list for the consistent page left edge"
---

# Tasks: Consistent Page Left Edge

**Input**: Design documents from `/specs/009-consistent-left-edge/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/left-edge.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-005 requires an automated check (hidden or overlay scrollbars only; classic scrollbars are no longer tested).

**Organization**: Grouped by user story. The change is small; run US1 then US2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`); rely on contextual typing, as in `tests/e2e/link-style.spec.ts`
- `/nope` stands for any address the site does not have; it is used as the test address

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - Content starts in the same place on every page (Priority: P1) 🎯 MVP

**Goal**: With visible scrollbars, the content's left edge is identical on the home page, the Web Development page, and the "Page not found" page, at every window width.

**Independent Test**: In a Chromium window with visible scrollbars 1365px wide, `.an-content-header__inner` (and the home page's `.an-hero__inner`) starts at the same distance from the left on all three pages.

### Tests for User Story 1 (write first; they fail until T003)

- [X] T002 [US1] Create `tests/e2e/left-edge.spec.ts` (with license header, header comment citing `specs/009-consistent-left-edge/spec.md`, and a note that Playwright's loader here rejects type annotations). Import `chromium`, `expect`, and `test` from `@playwright/test`. Write a helper (contextual types only) that, for a page, returns `Math.round(el.getBoundingClientRect().left * 10) / 10` of the first element matching `.an-content-header__inner, .an-hero__inner`, the same for `footer .an-footer__grid`, and `innerWidth - document.documentElement.clientWidth`. In the header comment, record why the test exists: measured 2026-09-30 in Chromium with visible scrollbars at 1365px, the left edge was 15px on `/` and `/web-development` and 22.5px on `/nope` (a 15px scrollbar shifts centered content by 7.5px on pages that scroll); no stylesheet contains those numbers. Add these tests:
  1. ~~**Visible scrollbars (Chromium project only)**~~ **Removed 2026-09-30 by owner decision:** classic scrollbars are essentially obsolete, so this test (an own Chromium with `--hide-scrollbars` removed, five widths, three pages) is no longer kept. It was written first, failed with 15, 15, and 22.5px at 1365px before the CSS fix, and passed after it.
  2. **Default browsers (all projects)**: at 1600px wide (above the 1320px container, so the left edge is not simply 0), the header/hero left edge is equal on the three pages and, when the browser reports no scrollbar width (`innerWidth - clientWidth` is 0), equals the pre-change value `(1600 - 1320) / 2` (140px), so the fix is shown not to move anything with hidden or overlay scrollbars (FR-006, SC-003). Some engines may still show a scrollbar; then only the equality across pages is asserted.
  Include the failure message context (page and width) in each `expect`. Run it with `bunx playwright test tests/e2e/left-edge.spec.ts --project=chromium` and confirm the visible-scrollbars test fails at 1365px (15, 15, 22.5) before T003.

### Implementation for User Story 1

- [X] T003 [US1] Edit `src/styles/globals.css`: add, next to the existing `body { margin: 0; }` rule, a rule `html { scrollbar-gutter: stable; }` with a comment that it reserves the scrollbar's space on every page so a page that scrolls and one that does not line up (specs/009-consistent-left-edge), and that the value is 0 wide with overlay scrollbars. Do not change any padding, margin, or width.
- [X] T004 [US1] Run `bunx playwright test tests/e2e/left-edge.spec.ts` on all six projects; the tests pass (the visible-scrollbars test runs in `chromium` only and is skipped elsewhere).

**Checkpoint**: The left edge matches on every page.

---

## Phase 4: User Story 2 - The rule is written down (Priority: P2)

**Goal**: The design guide states the rule, and a test enforces it.

**Independent Test**: `design/DESIGN.md` section 4 has the rule; changing a page's left edge makes T002 fail.

### Implementation for User Story 2

- [X] T005 [P] [US2] Edit `design/DESIGN.md` section "4 · Spacing and Layout": add a bullet after the Containers bullet: **Consistent left edge.** Every page uses the same left edge: content starts at the same distance from the left of the window on every page, at every window width, whether or not the page is long enough to scroll. A visible scrollbar or a short page must never move content sideways, so the page root reserves the scrollbar's space (`scrollbar-gutter: stable` in `src/styles/globals.css`). A new page must not add its own side offsets to compensate. The value depends on the window width (centered container up to 1320px with 24px padding), so it is a rule about consistency, not a fixed pixel number. Enforced by `tests/e2e/left-edge.spec.ts`.

**Checkpoint**: The rule is written down and tested.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T006 Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` (all six projects, including WebKit). Do not skip failures; apply the flaky-test note from T001 if it applies.
- [X] T007 Run `./build.sh && ./run.sh`, work through `specs/009-consistent-left-edge/quickstart.md` as far as it can be done from the terminal, send one `^C`, and confirm the shutdown log line and no leftover container in `docker ps -a`.
- [X] T008 With the site running, take screenshots of `/`, `/web-development`, and `/nope` at 1365px wide in the same visible-scrollbars Chromium used by T002 (save them to the scratchpad directory, not the repo), and confirm the header logo starts at the same x on all three. Also confirm that in the default headless browser (hidden scrollbars) the pages look as they did before (FR-006, SC-003).

---

## Dependencies & Execution Order

- Phase 1 first. US1: T002 (test, fails), T003 (CSS), T004 (passes). US2: T005 has no dependency on the code and can be done at any point after T001.
- Polish (T006 to T008) last.

### Parallel opportunities

- T005 (design guide) is in a different file from T002 to T004 and can run in parallel with them.

## Implementation Strategy

**MVP**: Phases 1 and 3 (User Story 1): the one-line CSS fix and its test. US2 (the design guide rule) is a single documentation edit and follows immediately.
