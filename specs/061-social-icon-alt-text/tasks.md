---

description: "Task list for Social Icon Descriptions"
---

# Tasks: Social Icon Descriptions

**Input**: Design documents from `/specs/061-social-icon-alt-text/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). Nothing visible changes, but the owner reviews before committing, so do not commit. Stay on the
current branch; never create or switch branches.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/marketing/Footer.tsx`, `SOCIAL_LINKS` has the labels "LinkedIn",
  "X", and "GitHub", and each is passed as `aria-label={label}` to the `FontAwesomeIcon` (the `<a>` has no label of its
  own). Read `tests/e2e/social-icon-names.spec.ts` and lines 85-100 of `tests/e2e/homepage-content.spec.ts`. Grep `src/`
  and `tests/` for the three short names to confirm no other test or component finds these links by them (the size and
  color specs select by class)

---

## Phase 2: User Story 1 - Social icons say where they go (Priority: P1) MVP

**Goal**: Each footer social icon's name is the full description from the spec, written as the `aria-label` on the
icon's `<svg>`, with nothing changing on screen and no `alt` attribute written.

**Independent Test**: Open `/` and `/web-development` and read the three footer icons' names:
"LinkedIn logo, Andexor profile, opens in new tab", "X logo, Andexor profile, opens in new tab", and "GitHub logo,
Andexor organization, opens in new tab".

### Tests (write first, see them fail)

- [X] T002 [P] [US1] In `tests/e2e/social-icon-names.spec.ts` (keep the SPDX header, no type annotations), mention spec 061
  in the header comment and replace the `NAMES` array with the three full descriptions above, keeping `exact: true` and the
  existing checks (the `<a>` has no `aria-label`; the svg has `aria-label` equal to the name, `role="img"`, and no
  `aria-hidden="true"`). Keep the "no alt attribute" test. Use the short name only in the test titles if wanted
- [X] T003 [P] [US1] In `tests/e2e/homepage-content.spec.ts` lines 92-94, find the three footer links by the full
  descriptions (keep `exact: true`)
- [X] T004 [US1] Run `bun run build` and `bun run test:e2e -- social-icon-names homepage-content --project=chromium`.
  Confirm the new expectations fail because the names are still "LinkedIn", "X", and "GitHub" (not because of a typo or
  server startup). Port 3000 must be free

### Implementation

- [X] T005 [US1] In `src/components/marketing/Footer.tsx`, change the `label` of the three `SOCIAL_LINKS` entries to exactly
  "LinkedIn logo, Andexor profile, opens in new tab", "X logo, Andexor profile, opens in new tab", and "GitHub logo,
  Andexor organization, opens in new tab". Change nothing else: keep `aria-label={label}` on the icon, the `href`s, and
  `target="_blank"`
- [X] T006 [P] [US1] At the top of `specs/044-social-icon-accessible-names/spec.md`, after the Input line, add a short note
  that the names "LinkedIn", "X", and "GitHub" are superseded by the full descriptions in
  `specs/061-social-icon-alt-text/spec.md`, and that the rest of spec 044 (name on the svg, not the link; no `alt`)
  still holds
- [X] T007 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T004 tests; confirm they pass. If another e2e spec fails
  because it finds a social link by its short name, fix the lookup to the new name rather than the source

**Checkpoint**: every footer social icon has its full description.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T008 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the social icon size and color specs and the a11y specs. Port 3000 must be
  free. A flaky webkit or ipad failure on the full run should be re-run alone before being reported
- [X] T009 Grep the changed files for curly quotes, hover underlines, and `alt=` on the social icons; confirm none. Look at
  `out/index.html` for the three `aria-label` values on the footer icons
- [X] T010 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #29.`

---

## Dependencies & Execution Order

- T001 first. T002 and T003 touch different files and can run together. T004 follows them. T005 and T006 follow T004 and can
  run together (different files). T007 follows both. T008 to T010 run last, in order.

## Implementation Strategy

One story, so the MVP is the whole feature: tests first and failing, then the three strings, then the full suite.
