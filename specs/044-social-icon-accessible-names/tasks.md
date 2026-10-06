---

description: "Task list for Social Icon Accessible Names"
---

# Tasks: Social Icon Accessible Names

**Input**: Design documents from `/specs/044-social-icon-accessible-names/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Assert attributes and names; never assert a count of
links or icons. Playwright specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
Search changed files for U+2018 to U+201F before finishing (T008).

**Organization**: One user story. New `.ts` files start with the SPDX license header and are formatted with Prettier.
Do not commit until the owner has looked at the result.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state: `bun run build`, then in `out/index.html` each social `<svg>` has `aria-hidden="true"` and
  no `aria-label`, and each social `<a>` has the lowercase `aria-label` ("linkedin", "twitter", "github"). Run
  `bunx playwright test tests/e2e/homepage-a11y.spec.ts tests/e2e/content-page-a11y.spec.ts --project=chromium` and note
  that it passes today

---

## Phase 2: User Story 1 - The icons carry their own names (Priority: P1) MVP

**Goal**: The three social icons are not hidden and carry the names "LinkedIn", "X", and "GitHub" on the `<svg>`; the links
have no `aria-label` of their own.

**Independent Test**: In the built footer, each social link is named "LinkedIn", "X", or "GitHub" once, its `<svg>` has
that `aria-label` and no `aria-hidden="true"`, and nothing has an `alt` attribute.

### Tests (write first, see them fail)

- [X] T002 [P] [US1] Update the "shows footer social links" test in `tests/e2e/homepage-content.spec.ts` to look the links up by the
  new names ("LinkedIn", "X", "GitHub", with `exact: true`) and not the lowercase labels. It fails until T004
- [X] T003 [P] [US1] Create `tests/e2e/social-icon-names.spec.ts` (license header, no type annotations). For each of
  `["LinkedIn", "X", "GitHub"]`: the footer link whose accessible name is exactly that name exists and is visible
  (`getByRole("link", { name, exact: true })`); the link has no `aria-label` attribute; its `<svg>` has `aria-label` equal
  to the name, an `aria-hidden` that is not `"true"`, and `role="img"`. Also: no element inside the social links has an
  `alt` attribute. It fails until T004

### Implementation

- [X] T004 [US1] In `src/components/marketing/Footer.tsx`, set each `SOCIAL_LINKS` entry's `label` to `"LinkedIn"`, `"X"`, and
  `"GitHub"`; remove `aria-label={label}` from the `<a>`; and render `<FontAwesomeIcon icon={icon} aria-label={label} />`
  with no `aria-hidden`. Do not add `alt`, and leave the URLs, `target`, `rel`, and the class names as they are
  (FR-005)
- [X] T005 [US1] `bun run build`, then run T002 and T003 and the two accessibility specs from T001 on Chromium; all must pass
  with no new axe violation. Read `out/index.html` and confirm the attributes match `data-model.md` (the icons show
  `aria-hidden="false"` from FontAwesome, which is accepted)

**Checkpoint**: the footer names are correct and every check passes.

---

## Phase 3: Polish & Cross-Cutting

- [X] T006 Update `specs/044-social-icon-accessible-names/spec.md` Status to Implemented and tick the tasks above
- [X] T007 Run `bun run format` and `bun run format:check`, `bun run test` (unit), and the whole Chromium e2e run
  (`bunx playwright test --project=chromium`); all pass. Confirm the footer looks and behaves the same as before (specs
  042 and 043)
- [X] T008 Run `bun run test` (it includes `tests/unit/straight-quotes.test.ts`) and confirm it passes. It checks every
  repository file for the typographic quote characters and their HTML references, so the changed and new files are covered

- [X] T009 Stop and tell the owner it is ready to look at (UI change: the owner reviews before any commit). Suggested commit
  subject when asked: "Named the footer social icons for assistive technology. Closes #23." with `git commit -s`; leave
  `setup.md` and `setup.sh` out

---

## Dependencies & Order

- T001 first. T002 and T003 are in different files and can run in parallel; both must fail before T004. T004 then T005.
  T006 to T009 follow in order.

## Parallel Examples

- T002 and T003 together (different test files).

## Implementation Strategy

- One story, so the MVP is the whole feature: write the two tests, make the one component change, then verify. If an axe
  check reports a new violation for the named, visible icon, stop and tell the owner before changing the approach.
