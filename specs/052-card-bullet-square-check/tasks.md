---

description: "Task list for Card Bullet Square Check"
---

# Tasks: Card Bullet Square Check

**Input**: Design documents from `/specs/052-card-bullet-square-check/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of cards or bullets. Playwright
specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state (spec 051 is built but uncommitted). In `src/components/marketing/Services.tsx`
  the bullet icon is `<FontAwesomeIcon icon={faCheck} aria-hidden="true" className="an-services__bullet-icon" />`, and
  `faCheck` is imported from `@awesome.me/kit-0a6c11d394/icons/duotone/solid`. In `src/styles/marketing.css`,
  `.svg-inline--fa.fa-check { height: 15px; width: 15px; }` sits after the footer social icon rules, and
  `.an-services__bullet-icon` has `color: var(--gold-600)` and `flex: none`. Confirm `faSquareCheck` is exported by the
  same module, and that `--gold-300` exists in `src/styles/tokens/colors.css`. Confirm nothing else in `src/` uses
  `faCheck` or `fa-check`. Leave `src/components/contact/ContactPopup.tsx` alone

---

## Phase 2: User Story 1 - Bullets use the square check (Priority: P1) MVP

**Goal**: Every bullet in the eight home page service cards starts with the FontAwesome duotone square-check, 15 by 15
pixels, in `--gold-300`, with the square layer fully clear so only the check mark shows, a transparent background,
hidden from assistive technology, and text position and card heights unchanged.

**Independent Test**: Open `/`: every bullet starts with a gold-300 check mark, 15 by 15, with nothing drawn behind it.

### Tests (write first, see them fail)

- [X] T002 [US1] Update `tests/e2e/card-bullet-check-icon.spec.ts` (keep the file name and the SPDX header, no type
  annotations). Change the comment and test names to say square-check (spec 052). In the loop over
  `.an-services__bullet` (never assert how many), assert: the `svg` has class `fa-square-check` (not `fa-check`); its
  box is 15 by 15 within 0.5px; `aria-hidden` is `true`; its computed `color` equals the resolved `--gold-300` (the
  probe element's `style.color` is `var(--gold-300)` instead of `var(--gold-600)`); the `svg`'s and the bullet's computed
  `background-color` are `rgba(0, 0, 0, 0)`; the svg's `.fa-secondary` path (the square layer) has computed `opacity` of
  `0`; the svg's `.fa-primary` path has computed `opacity` of `1`; and the text span's left edge is within 1px of the `svg`'s
  right edge plus 8px
- [X] T003 Run `bun run test:e2e -- card-bullet-check-icon --project=chromium` and confirm T002 fails

### Implementation

- [X] T004 [US1] In `src/components/marketing/Services.tsx` change the import of `faCheck` to `faSquareCheck` and the
  icon prop to `icon={faSquareCheck}`. Nothing else in the file changes
- [X] T005 [US1] In `src/styles/marketing.css` change the rule `.svg-inline--fa.fa-check` to
  `.svg-inline--fa.fa-square-check` (keeping `height: 15px; width: 15px`), and in `.an-services__bullet-icon` change
  `color: var(--gold-600)` to `color: var(--gold-300)` and add `background: transparent` and
  `--fa-secondary-opacity: 0`. Keep `flex: none`. No rule named `.fa-check` is left
- [X] T006 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test; confirm they pass

**Checkpoint**: clear-square, gold-300 checks on all bullets.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T007 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass. Port 3000 must be free
- [X] T008 Build, serve, and look at `/` at 360, 768, and 1280 pixels: each bullet shows a light gold check mark with
  nothing behind it, aligned with the first line of its text, same card heights, no overlap, no horizontal scrolling
- [X] T009 Grep `src/styles/*.css` for `underline`, `src` for `faCheck` and `fa-check` (no matches), and the changed
  files for typographic quotes; walk through `quickstart.md`. Leave the work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 and T005 are different files and can be done together, but do both before T006.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
