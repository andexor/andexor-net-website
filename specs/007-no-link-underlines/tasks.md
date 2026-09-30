---

description: "Task list for removing underlines from all links"
---

# Tasks: No Underlines on Any Link

**Input**: Design documents from `/specs/007-no-link-underlines/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/link-style.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and the accessibility check is the acceptance gate (FR-008).

**Organization**: Grouped by user story. Both stories edit the same two stylesheets, so run them in order. Removing the underline (US1) without the color change (US2) fails the accessibility test, so ship US1 and US2 together.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header (constitution, license header rule)
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`); rely on contextual typing, as in `tests/e2e/brand-wordmark.spec.ts`

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline. The two stylesheets are edited under the user stories.

---

## Phase 3: User Story 1 - Links look like the footer links everywhere (Priority: P1) 🎯 MVP

**Goal**: No link on the site is underlined at rest, on hover, or on focus.

**Independent Test**: Open `/nope`, `/web-development`, and `/`. Every link shows no underline.

### Tests for User Story 1 (write first, they fail until T005)

- [X] T002 [P] [US1] Edit `tests/unit/no-hover-underline.test.ts`: keep the hover check, and add a second check that fails when any rule whose selector targets a link (a type selector `a`, matched with `/(^|[\s,>+~])a(?![\w-])/`, including `a:hover` and `a:focus-visible`) sets `text-decoration` or `text-decoration-line` to `underline`, at rest or otherwise. Add a guard test for the checker itself with `".x a { text-decoration: underline; }"` (offender) and `".x a { color: red; }"` (clean). Update the file's header comment to cite `specs/007-no-link-underlines/spec.md`. Scan the same roots as today (`src/styles`, `design/tokens`, `design/components`, `design/styles.css`).
- [X] T003 [P] [US1] Create `tests/e2e/link-style.spec.ts` (with license header). For `/`, `/web-development`, and `/nope`, read every `a` element's computed `text-decoration-line` with `page.evaluate` at rest, and assert each is `none`. On `/nope`, also hover the "Go to the home page" link with `page.hover` and tab to it with the keyboard, and assert `none` again. On `/web-development`, do the same for one link in body text if present and for the footer's first link. Also loop over every `.an-prose a` and `.an-tile a` on the three pages, and every footer link, and assert none is underlined; this covers pages added later (FR-006), since the styles are scoped to the containers, not to one page. At a 320px viewport, assert the same for a link that wraps across two lines on `/nope`. Use contextual typing only.

### Implementation for User Story 1

- [X] T004 [US1] Edit `src/styles/content.css`: in the `.an-prose a` rule, delete `text-decoration: underline;` and `text-underline-offset: 2px;` (leave `color`). The global `a { text-decoration: none }` in `src/styles/tokens/base.css` then applies.
- [X] T005 [US1] Edit `src/styles/cards.css`: in the `.an-tile a` rule, delete `text-decoration: underline;` and `text-underline-offset: 2px;` (leave `color`).
- [X] T006 [US1] Run `bun run test` (T002 passes) and `bunx playwright test tests/e2e/link-style.spec.ts` (T003 passes).

**Checkpoint**: No link is underlined. The accessibility test on `/nope` is expected to fail until US2.

---

## Phase 4: User Story 2 - Links still read as links (Priority: P1)

**Goal**: Body and card links stay distinguishable without an underline: at least 3:1 from the surrounding text, at least 4.5:1 against the background, a color change on hover, and a visible focus ring.

**Independent Test**: The axe accessibility specs pass on `/nope` and `/web-development` in all six projects; hovering a body or card link changes its color.

### Tests for User Story 2

- [X] T007 [P] [US2] Extend `tests/e2e/link-style.spec.ts`: on `/nope`, assert the link's computed `color` changes when hovered, and that its color at rest is `rgb(74, 139, 208)` (`--blue-400`) and its parent paragraph's color is `rgb(248, 250, 252)` (`--slate-50`); assert the focused link has a non-empty `box-shadow`; then tab through every `.an-prose a` and `.an-tile a` on the two pages and assert each focused link has a non-empty `box-shadow` (SC-002). On `/web-development`, assert the same hover color change for a link inside a card if one exists, and otherwise skip that check with a comment.
- [X] T008 [US2] Confirm `tests/e2e/content-page-a11y.spec.ts` (axe, WCAG 2.1 AA, `/web-development` and `/nope`) is unchanged and is the acceptance gate. It currently fails on `/nope` after T004 with the `link-in-text-block` violation.

### Implementation for User Story 2

- [X] T009 [US2] Edit `src/styles/content.css`: on `.an-prose`, add `--text-body: var(--slate-50);` and `--text-link: var(--blue-400);`. Change `.an-prose a:hover` to `color: var(--blue-300);` (it is `var(--text-heading)` today, which equals the new body text color, so hover would blend in).
- [X] T010 [US2] Edit `src/styles/cards.css`: on `.an-tile`, add the same two custom properties. Add a rule `.an-tile a:hover { color: var(--blue-300); }` (card links have no hover color today). Do not touch `.an-tile--ink`, which keeps its `--blue-200` text; add a one-line comment there that a link on it would need its own color (2.45:1 with `--blue-400`).
- [X] T011 [US2] Run `bunx playwright test tests/e2e/content-page-a11y.spec.ts tests/e2e/homepage-a11y.spec.ts tests/e2e/contact-popup-a11y.spec.ts tests/e2e/link-style.spec.ts` on all six projects; all must pass. If the axe check still fails, adjust the values (not the test) and update `research.md` with the new numbers.

**Checkpoint**: Links have no underline and still pass WCAG 2.1 AA.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T012 [P] Amend `.specify/memory/constitution.md` Principle VI: replace "Underlines at rest on inline body links are allowed." with a rule that links MUST NOT be underlined at rest, on hover, or on focus, that body links stay distinguishable by color at WCAG 2.1 AA contrast, and the rationale. Keep the heading "VI. Always-Dark Appearance and Color-Only Hover" unchanged, since spec 002 and other files cite it. Bump `**Version**` to 1.3.0 with `**Last Amended**: 2026-09-30`, add a line to the Sync Impact Report (MINOR: rule materially expanded; owner decision, spec 007), and update every other place the file or `CLAUDE.md` names the principle.
- [X] T013 [P] Edit `CLAUDE.md`: rewrite the "No underline on hover" section as "No underline on links" (never underline a link at rest, on hover, or on focus; signal hover with a color change; keep body links distinguishable by color), update "currently v1.2.2" to "v1.3.0", and mention `--slate-50` and `--blue-400` scoped to `.an-prose` and `.an-tile`.
- [X] T014 [P] Edit `specs/002-content-pages-card-template/spec.md` (User Story 7 scenario 2 and the Assumptions line "Underlined links in body text (at rest) are allowed"), `specs/002-content-pages-card-template/research.md` ("No hover underline" decision) and `specs/002-content-pages-card-template/quickstart.md` step 6, so they say links are never underlined and point to `specs/007-no-link-underlines/spec.md`. Add one "Amended by spec 007" line under spec 002's retrospective note (spec 002 has no Amendments section).
- [X] T015 Run `grep -rn "underline" src/styles design/tokens design/components design/styles.css` and confirm no rule underlines a link (SC-005); leave `design/DESIGN.md` line 112 alone unless the owner asks for it to be edited, and mention it in the final report.
- [X] T016 Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` (all six projects, including WebKit). Do not skip failures.
- [X] T017 Run `./build.sh && ./run.sh`, work through `specs/007-no-link-underlines/quickstart.md`, send one `^C`, and confirm the shutdown log line and no leftover container in `docker ps -a`.
- [X] T018 Look at `/nope`, `/web-development`, and `/` at 320px and 1280px and confirm links read as links, hover is visible, and the home page and footer look unchanged (FR-007, FR-009).

---

## Dependencies & Execution Order

- Phase 1 first. US1 (T002 to T006) then US2 (T007 to T011). T004 and T005 edit different files but T009 and T004 edit the same file, so do the stylesheet tasks in the order listed.
- After T004 and T005 and before T009 and T010, the accessibility test on `/nope` fails. That is expected. Do not stop between US1 and US2.
- Polish (T012 to T018) last. T012, T013, and T014 edit different files.

### Parallel opportunities

- T002 and T003 (different files).
- T012, T013, and T014 (different files).

## Implementation Strategy

**MVP**: Phases 1, 3, and 4 together (US1 and US2). Removing the underline alone fails the accessibility gate, so there is no useful stop between them. Then the amendments in Phase 5.
