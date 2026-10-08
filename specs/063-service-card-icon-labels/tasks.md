---

description: "Task list for Service Card Icon Labels"
---

# Tasks: Service Card Icon Labels

**Input**: Design documents from `/specs/063-service-card-icon-labels/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. New and edited files keep or get the SPDX license header and are formatted with
Prettier (`bun run format`). Nothing visible changes, but the owner reviews before committing, so do not commit. Stay on
the current branch; never create or switch branches.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/marketing/Services.tsx` the title icon is
  `<FontAwesomeIcon icon={service.icon} aria-hidden="true" />` inside `.an-services__icon-tile`, and the bullet icon also
  has `aria-hidden="true"`. In `src/components/marketing/services-data.ts`, `ServiceOffering` has no label field. Read
  `tests/e2e/social-icon-names.spec.ts` as the model for the new test. Grep `tests/` for anything that finds a service
  card by its full link name (the layout specs and `homepage-content.spec.ts` use the title heading or classes)

---

## Phase 2: User Story 1 - Service card icons describe themselves (Priority: P1) MVP

**Goal**: Each of the eight home page service card title icons has the label from the spec, written as the `aria-label`
on the icon's `<svg>` (`role="img"`, not hidden), with nothing changing on screen, no `alt` attribute, and the bullet
check marks still hidden.

**Independent Test**: Open `/` and read each card's title icon: Web Development "source code icon", Web Hosting "web
servers icon", Technical SEO "magnifying glass icon", Agentic Systems "A.I. chip icon", Cost Reduction "line chart
trending down icon", Lead Generation "sales funnel icon", Growth Marketing "line chart trending up icon", Process
Re-engineering "roadmap icon".

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/service-card-icon-labels.spec.ts` (SPDX header as `//` comments, no type annotations,
  header comment mentioning spec 063 and that the label is an `aria-label` because an inline SVG has no `alt`). Hold the
  eight title/label pairs from the spec's table in an array and loop over it, one test per pair (no counting). Each test
  goes to `/`, finds the card by `.an-services__card` filtered with `has: page.getByRole("heading", { name: title, exact:
  true })`, and checks that its `.an-services__icon-tile svg` has `aria-label` equal to the label, `role="img"`, and no
  `aria-hidden="true"`. Add one test that no `.an-services__card [alt]` exists and that the svg inside each
  `.an-services__bullet` still has `aria-hidden="true"`
- [X] T003 [US1] Run `bun run build` and `bun run test:e2e -- service-card-icon-labels --project=chromium`. Confirm the
  new tests fail because the icons have no `aria-label` and are hidden (not because of a typo or server startup). Port
  3000 must be free

### Implementation

- [X] T004 [US1] In `src/components/marketing/services-data.ts`, add `iconLabel: string` to `ServiceOffering` and an
  `iconLabel` to each of the eight `SERVICES` entries, exactly as in `data-model.md`: "source code icon", "web servers
  icon", "magnifying glass icon", "A.I. chip icon", "line chart trending down icon", "sales funnel icon", "line chart
  trending up icon", "roadmap icon"
- [X] T005 [US1] In `src/components/marketing/Services.tsx`, on the title icon only, replace `aria-hidden="true"` with
  `aria-label={service.iconLabel}`. Leave the bullet icon's `aria-hidden="true"` and everything else unchanged
- [X] T006 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T003 tests; confirm they pass. Then run
  `bun run test:e2e -- card-title-beside-icon card-bullet-check-icon homepage-content --project=chromium`. If another
  spec fails because it relied on the old card link name, fix its lookup rather than the source

**Checkpoint**: every service card title icon has its label.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T007 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the a11y specs (no new axe violations). Port 3000 must be free. A flaky webkit
  or ipad failure on the full run should be re-run alone before being reported
- [X] T008 Grep the changed files for curly quotes, hover underlines, and `alt=` on the card icons; confirm none. Look at
  `out/index.html` for the eight `aria-label` values on the card icons
- [X] T009 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #29.`

---

## Dependencies & Execution Order

- T001 first, then T002, then T003. T004 and T005 follow T003 (different files, can run together). T006 follows both.
  T007 to T009 run last, in order.

## Implementation Strategy

One story, so the MVP is the whole feature: the test first and failing, then the data field and the attribute, then the
full suite.
