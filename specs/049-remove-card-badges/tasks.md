---

description: "Task list for Remove Card Badges"
---

# Tasks: Remove Card Badges

**Input**: Design documents from `/specs/049-remove-card-badges/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of cards. Playwright specs must
not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. `Badge` is imported and rendered once in `src/components/marketing/Services.tsx`
  (inside `.an-services__card-top`), fed by `service.tag` and `service.badgeTone` from
  `src/components/marketing/services-data.ts`. Grep `src/` and `tests/` for `an-badge`, `Badge`, `badgeTone`, and
  `.tag`, and confirm nothing else reads them. Leave `src/components/ui/Badge.tsx` and the `.an-badge*` rules in
  `src/styles/components.css` alone

---

## Phase 2: User Story 1 - Service cards show no badge (Priority: P1) MVP

**Goal**: The eight home page service cards show no badge; the icon sits alone at the top left; card heights and
everything else are unchanged.

**Independent Test**: Open `/`: no card has a tag in its top right corner, and no element has the `an-badge` class.

### Tests (write first, see them fail)

- [X] T002 [US1] In `tests/e2e/homepage-content.spec.ts` add a test "service cards have no badge": on `/`, the page has
  no element matching `.an-badge`, and no `.an-services__card` contains a `.an-badge`. Do not assert how many cards
  exist. Also assert that each card's
  top row (`.an-services__card-top`) is as tall as its `.an-services__icon-tile` (44px), so the row height does not
  depend on a badge
- [X] T003 Run `bun run test:e2e -- homepage-content --project=chromium` and confirm T002 fails

### Implementation

- [X] T004 [US1] In `src/components/marketing/Services.tsx` remove the `import { Badge }` line and the
  `<Badge tone={service.badgeTone}>{service.tag}</Badge>` element. Leave `.an-services__card-top` and the icon tile as
  they are
- [X] T005 [US1] In `src/components/marketing/services-data.ts` remove `tag` and `badgeTone` from the
  `ServiceOffering` interface and from all eight entries
- [X] T006 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test again; confirm they pass

**Checkpoint**: no badges on the home page.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T007 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass. Port 3000 must be free
- [X] T008 Build, serve, and look at `/` at 360, 768, and 1280 pixels: icon at the top left, same card heights, no
  overlap, no horizontal scrolling
- [X] T009 Grep `src/styles/*.css` for `underline` and the changed files for typographic quotes; walk through
  `quickstart.md`. Leave the work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 and T005 are different files, but do both before T006 (the type check fails
  between them). T006 after both.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
