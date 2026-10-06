---

description: "Task list for Social Link Colors"
---

# Tasks: Social Link Colors

**Input**: Design documents from `/specs/045-social-link-colors/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Assert computed colors and the absence of an underline;
never assert a count of links or icons. Playwright specs must not use TypeScript type annotations (the loader fails on
them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check (T007).

**Organization**: One user story. New `.ts` files start with the SPDX license header and are formatted with Prettier. This
is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state in `src/styles/marketing.css`: `.an-footer__social-link` has `color: var(--blue-200)`,
  its `:hover` rule has `color: var(--blue-100)`, its `:active` rule has no `color`, and `:active` is written after
  `:hover`. Confirm the tokens `--blue-200`, `--blue-300`, and `--blue-400` exist in `src/styles/tokens/colors.css`

---

## Phase 2: User Story 1 - The social icons change color as they are used (Priority: P1) MVP

**Goal**: The social links' icon color is blue-300 at rest, blue-200 on hover, and blue-400 while pressed, with the press
color winning when the pointer is also over the link.

**Independent Test**: In the browser, a social link is blue-300 at rest, blue-200 with the pointer over it, and blue-400
while the mouse button is held on it; nothing is underlined.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/social-link-colors.spec.ts` (license header, no type annotations). For each social link
  (`.an-footer__social-link`), read the expected colors by resolving the tokens on the page: set a probe element's
  `color` to `var(--blue-300)`, `var(--blue-200)`, and `var(--blue-400)` and read its computed `color`, so the test names
  the tokens and not literals. Check, with `toHaveCSS("color", ...)` so the 0.15s transition is waited for: at rest it is
  blue-300; after `hover()` it is blue-200; after `hover()` then `page.mouse.down()` it is blue-400 (press wins over
  hover); after `page.mouse.up()` and moving the pointer away it is blue-300 again. Also check that
  `text-decoration-line` is `none` in each state. It fails until T003

### Implementation

- [X] T003 [US1] In `src/styles/marketing.css`, set `color: var(--blue-300)` on `.an-footer__social-link`, change the
  `:hover` rule's color from `var(--blue-100)` to `var(--blue-200)`, and add `color: var(--blue-400)` to the existing
  `.an-footer__social-link:active` rule, keeping it after `:hover`. Change nothing else (FR-004). Update the comment above
  the rules if it mentions the old colors
- [X] T004 [US1] `bun run build`, then run `tests/e2e/social-link-colors.spec.ts`, `tests/e2e/link-style.spec.ts`,
  `tests/e2e/social-icon-size.spec.ts`, `tests/e2e/social-icon-names.spec.ts`, and the two accessibility specs on
  Chromium; all must pass

**Checkpoint**: the colors are right in every state and the earlier social-link checks still pass.

---

## Phase 3: Polish & Cross-Cutting

- [X] T005 Update `specs/045-social-link-colors/spec.md` Status to Implemented, and update the color wording in
  `specs/043-social-icon-box-size/spec.md` only if it states the old resting or hover colors (it does not name them, so
  expect no change)
- [X] T006 Run `bun run format`, `bun run format:check`, and the whole Chromium e2e run
  (`bunx playwright test --project=chromium`); all pass
- [X] T007 Run `bun run test` (unit, includes `tests/unit/straight-quotes.test.ts`); all pass
- [X] T008 Stop and tell the owner it is ready to look at, with how to see it (`./build.sh`, `./run.sh`, the footer). Do not
  commit. When asked, the commit is `git commit -s` with a subject such as "Set the footer social link colors. Closes
  #23.", leaving `setup.md`, `setup.sh`, and `src/app/not-found.tsx` out

---

## Dependencies & Order

- T001 first, then T002 (must fail), then T003, then T004. T005 to T008 follow in order.

## Parallel Examples

- None worth running in parallel: one test file and one CSS file, in sequence.

## Implementation Strategy

- One story, so the MVP is the whole feature: write the color test, change three color declarations, verify, and show the
  owner. Any further color tweaks are the owner's to ask for after looking.
