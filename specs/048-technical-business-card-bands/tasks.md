---

description: "Task list for Technical and Business Card Bands"
---

# Tasks: Technical and Business Card Bands

**Input**: Design documents from `/specs/048-technical-business-card-bands/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of cards: compare titles and
links as lists. Playwright specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: Two user stories. Files edited keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. `src/components/marketing/services-data.ts` has 4 entries; `Services.tsx` renders
  one `<section id="services">`. Grep `tests/` and `src/` for `#services`, `an-services`, `SERVICES`, and
  `services-data`. Known users: `tests/unit/services.test.tsx`, `tests/e2e/homepage-content.spec.ts`,
  `tests/e2e/list-markers.spec.ts`, `tests/e2e/service-card-hover.spec.ts`. Confirm `Server`, `TrendingDown`, `Filter`,
  and `Route` exist in `lucide-react`

---

## Phase 2: User Story 1 - Every service has a card, grouped by kind (Priority: P1) MVP

**Goal**: Two sections, technical then business, each with a heading, a sub-heading, and four cards in footer order,
each card linking to its page.

**Independent Test**: Open `/`; read each section's heading, sub-heading, and card titles in order; click each card.

### Tests (write first, see them fail)

- [X] T002 [US1] Update `tests/unit/services.test.tsx`: render `Services` and check that the section headings
  "Technical services built to scale" and "Business services that drive growth" exist at level 2; that the card titles
  inside each region, read in order, equal the footer's column items (`COLUMNS` in `Footer.tsx` is not exported, so compare with
  the literal lists from the spec); that every `SERVICES` entry has a `kind` of `technical` or `business`; and that each
  card's `href` matches the footer's address for the same title. Remove the old "fixed service set" test and the old
  link map that lists only four pages. No count assertions
- [X] T003 [P] [US1] Update `tests/e2e/homepage-content.spec.ts`: the "shows each service offering" test and the link
  test loop cover all 8 titles and paths (`/web-development`, `/web-hosting`, `/technical-seo`, `/agentic-systems`,
  `/cost-reduction`, `/lead-generation`, `/growth-marketing`, `/process-re-engineering`), locating cards in the page's
  `main` instead of `#services` alone. Add a test that the technical region's card titles in order equal the footer's
  TECHNICAL SERVICES links and the business region's equal BUSINESS SERVICES, read from the page itself. Update the
  comment "The footer has more entries than there are cards"
- [X] T004 Run `bun run test` and `bun run test:e2e -- homepage-content` and confirm the new checks fail

### Implementation

- [X] T005 [US1] In `src/components/marketing/services-data.ts` add `kind: "technical" | "business"` to
  `ServiceOffering`, set it on the four existing entries, and add four entries so the list is in footer order: Web
  Development, Web Hosting, Technical SEO, Agentic Systems, Cost Reduction, Lead Generation, Growth Marketing, Process
  Re-engineering. New entries per research.md: Web Hosting (Server, tag "Hosting", tone accent, `/web-hosting`), Cost
  Reduction (TrendingDown, "Cost", brand, `/cost-reduction`), Lead Generation (Filter, "Leads", accent,
  `/lead-generation`), Process Re-engineering (Route, "Process", brand, `/process-re-engineering`). Each has a
  one-sentence description and exactly three short bullets in the style of the existing cards; no curly quotes; update
  the "Exactly 4 entries" comment
- [X] T006 [US1] In `src/components/marketing/Services.tsx` replace the single section with one `<section>` per kind,
  from a small table: technical (`id="technical-services"`, renamed from `services`, heading "Technical services built to scale", lede "Web, hosting,
  search, and AI that stay fast as you grow.") and business (`id="business-services"`, heading "Business services that
  drive growth", lede "Lower costs, more leads, and better processes, with campaigns to match."). Each section has
  `aria-labelledby` pointing at its `h2` id, the same `an-services*` classes, and the cards of its kind from `SERVICES`.
  Update the "exactly 4 service offerings" comment. No newline inside React-rendered text
- [X] T007 [US1] Run `bun run test` and `bun run test:e2e -- homepage-content`; confirm T002 and T003 now pass

**Checkpoint**: both sections show, with 8 working cards.

---

## Phase 3: User Story 2 - The new cards look like the existing ones (Priority: P2)

**Goal**: Same look, behavior, and responsiveness for all 8 cards, with sensible spacing between the two sections.

**Independent Test**: Compare old and new cards at rest, hover, press, and focus; check 360, 768, and 1280 pixel
widths.

- [X] T008 [P] [US2] Update `tests/e2e/service-card-hover.spec.ts` and `tests/e2e/list-markers.spec.ts` only if they
  break (they use `.first()` of `.an-services__card` and `svg.an-services__bullet-icon`). Add to the hover spec one check
  that a card in the business section has the same gold ring on hover as the first card
- [X] T009 [US2] Build (`bun run build`), serve, and look at `/` at 360, 768, and 1280 pixels. Check the gap between the
  two sections. If it is too large, add one rule in `src/styles/marketing.css` removing the second section's top
  padding (research.md, Spacing). Check no horizontal scroll and that each band wraps within itself
- [X] T010 [US2] Check the new cards' icon tiles, badges, hover ring, press move, and Tab focus ring against an old card

---

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T011 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and `bun run test:e2e`.
  All pass. Port 3000 must be free
- [X] T012 Grep `src/styles/*.css` for `underline` and `src/` and `content/` for `#top`; check the changed files for
  typographic quotes
- [X] T013 Walk through `quickstart.md`. Leave the work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002 and T003 are independent files and can be written together; T004 follows both.
- T005 before T006 (the component reads `kind`). T007 after T006.
- US2 (T008 to T010) needs US1 done. T008 can run alongside T009.
- Polish last.

## Implementation Strategy

MVP is User Story 1: eight cards in two sections. User Story 2 is verification and spacing.
