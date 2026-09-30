---

description: "Task list for the not-found page style"
---

# Tasks: Not-Found Page Style

**Input**: Design documents from `/specs/006-not-found-page-style/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/not-found-page.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and the accessibility check is the acceptance gate (FR-010).

**Organization**: Grouped by user story. All three stories touch `not-found.tsx`, `ContentPage.tsx`, and `cards.css`, so run them in order (US1, US2, US3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`); rely on contextual typing, as in `tests/e2e/link-style.spec.ts`
- `/nope` stands for any address the site does not have; it is used as the test address

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - A branded "Page not found" page (Priority: P1) 🎯 MVP

**Goal**: An unknown address shows the Web Development style hero with the 404 image, the headline, the explanation and link, and no card, eyebrow, or grid.

**Independent Test**: Open `/nope`. It shows the hero with the 404 illustration beside "Page not found" and the sentence with a link home; no card, label, or grid pattern.

### Tests for User Story 1 (write first; they fail until T007)

- [X] T002 [P] [US1] Edit `tests/unit/not-found.test.tsx`: keep the existing tests (headline, link `href="/"`, footer, no `<style>`), and add tests that `NotFound` renders an `<img>` with `src="/404.png"` and a non-empty `alt`; renders no element with class `an-tile`, `an-cards`, `an-cardhero__eyebrow`, or `an-cardhero__grid`; and renders the hero section with class `an-cardhero--solo`. Update the header comment to cite `specs/006-not-found-page-style/spec.md`.
- [X] T003 [P] [US1] Create `tests/e2e/not-found-style.spec.ts` (with license header). On `/nope`: the `h1` is "Page not found"; the hero image is visible and loaded (`naturalWidth` greater than 0) with a non-empty `alt`; `.an-tile`, `.an-cards`, `.an-cardhero__eyebrow`, and `.an-cardhero__grid` each have count 0; the link "Go to the home page" points to `/`, and the sentence "We could not find that page." is shown. Also assert `toHaveTitle("Page not found | Andexor Network")`, that the header has a logo link to `/`, and that the `footer` is visible (FR-007). The link's no-underline check is already covered by `tests/e2e/link-style.spec.ts` (spec 007), so it is not repeated here. On `/web-development`: `.an-cardhero__grid`, `.an-cardhero__eyebrow`, and at least one `.an-tile` are present (SC-005, FR-012). Use contextual typing only.

### Implementation for User Story 1

- [X] T004 [US1] Edit `src/lib/content.ts`: add optional `grid?: boolean` to the `CardsLayout` interface, with a one-line comment that an absent value or `true` shows the grid and `false` hides it. Do not change `renderCards` or any Markdown behavior.
- [X] T005 [US1] Edit `src/components/content/ContentPage.tsx`: render `<div className="an-cardhero__grid" aria-hidden="true" />` only when `cards.grid !== false`; add class `an-cardhero--solo` to the section when `cards.cardsHtml` is empty; render the `an-cards` div only when `cards.cardsHtml` is not empty. With the existing Markdown pages, output is unchanged.
- [X] T006 [US1] Edit `src/app/not-found.tsx`: keep the metadata title `"Page not found | Andexor Network"`; render `<ContentPage html="" cards={...} />` with `image: { src: "/404.png", alt: "Gold isometric laptop showing 404 next to a magnifying glass with a question mark" }`, `headingHtml: "Page not found"`, `introHtml: '<p>We could not find that page. <a href="/">Go to the home page</a>.</p>'`, `cardsHtml: ""`, `grid: false`, and no `eyebrow`, per `data-model.md`. Keep the comment explaining why it replaces the framework default.
- [X] T007 [US1] Edit `src/styles/cards.css`: place these rules right after the base `.an-cardhero` rule and before the `@media (max-width: 860px)` block, so the media-query override in T010 wins on narrow screens. Add `.an-cardhero--solo { padding-bottom: var(--space-12); }`, and `.an-cardhero--solo .an-cardhero__intro { color: var(--slate-50); }` with `.an-cardhero--solo .an-cardhero__intro a { color: var(--blue-400); }` and `.an-cardhero--solo .an-cardhero__intro a:hover { color: var(--blue-300); }`. Add a short comment: links have no underline (spec 007) so the link needs 3:1 against the text.
- [X] T008 [US1] Run `bun run test` (T002 passes) and `bunx playwright test tests/e2e/not-found-style.spec.ts --project=chromium` (T003 passes).

**Checkpoint**: The page has the new look on desktop.

---

## Phase 4: User Story 2 - Works on every screen size (Priority: P2)

**Goal**: The hero arranges correctly at 320px, 768px, and 1280px with no horizontal scrolling and no large empty gap above the footer.

**Independent Test**: View `/nope` at the three widths; layout is readable with no sideways scroll.

### Tests for User Story 2

- [X] T009 [US2] Extend `tests/e2e/not-found-style.spec.ts` with one test per width (1280, 768, 320) on `/nope`: `document.documentElement.scrollWidth <= window.innerWidth`; at 1280 the image's right edge is left of the headline's left edge (side by side); at 768 and at 320 the image's bottom edge is above the headline's top edge (stacked, since the layout stacks below 860px); and the gap between the bottom of `.an-cardhero__intro` and the top of the `footer` is at most 160px (the spec's definition of no large empty gap). Read positions with `getBoundingClientRect` inside `page.evaluate`.

### Implementation for User Story 2

- [X] T010 [US2] Edit `src/styles/cards.css` inside the existing `@media (max-width: 860px)` block: add `.an-cardhero--solo { padding-bottom: var(--space-8); }` after the existing `.an-cardhero` rule (which sets 88px for the card overlap). Adjust the values (not the test) until T009 passes.
- [X] T011 [US2] Run `bunx playwright test tests/e2e/not-found-style.spec.ts` on all six projects; T009 must pass in each.

**Checkpoint**: The page works at all sizes.

---

## Phase 5: User Story 3 - Accessible, and still a real "not found" (Priority: P2)

**Goal**: The page passes WCAG 2.1 AA, keeps a visible focus ring, and keeps the invalid address in the browser with a 404 status.

**Independent Test**: The axe spec passes on `/nope`; loading `/nope` keeps `/nope` in the address bar with status 404.

### Tests for User Story 3

- [X] T012 [US3] Extend `tests/e2e/not-found-style.spec.ts`: for each of `/nope`, `/nope?ref=1`, and `/some/deep/missing-page`, call `page.goto`, assert `response.status()` is 404, assert the browser URL after load (`new URL(page.url())`) has the same pathname and search as requested (no redirect, FR-013, SC-006), assert the `h1` is "Page not found", and assert `response.request().redirectedFrom()` is null. Also click "Go to the home page" on `/nope` and assert the URL becomes `/`. Then delete the older test "unknown address shows the not-found page" from `tests/e2e/web-development.spec.ts` (its 404 status, headline, and click-home checks are now in this spec; leave the rest of that file and its header comments as they are).
- [X] T013 [US3] Extend `tests/e2e/not-found-style.spec.ts`: on `/nope` at desktop, the link's computed `color` is `rgb(74, 139, 208)` and the intro text color is `rgb(248, 250, 252)`; hovering the link changes its color; tabbing to the link gives it a non-empty `box-shadow` (skip the tab check on webkit, as in `link-style.spec.ts`).
- [X] T014 [US3] Confirm `tests/e2e/content-page-a11y.spec.ts` (axe, WCAG 2.1 AA, includes `/nope`) is unchanged and is the acceptance gate for FR-010 and SC-003. If it fails on the link, adjust the colors in T007 (not the test) and update `research.md` Decision 4 with the new numbers.
- [X] T015 [US3] Run `bunx playwright test tests/e2e/not-found-style.spec.ts tests/e2e/content-page-a11y.spec.ts tests/e2e/web-development.spec.ts` on all six projects; all must pass.

**Checkpoint**: The page is accessible and never redirects.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T016 [P] Edit `specs/002-content-pages-card-template/spec.md` FR-006 (the not-found requirement) and its quickstart step for `/nope` so they point at `specs/006-not-found-page-style/spec.md` ("Amended by spec 006: hero style, no redirect").
- [X] T017 [P] Confirm no link in the new code is underlined and no hover underline was added: run `bun run test` (the stylesheet check) and `grep -n "underline" src/styles/cards.css`.
- [X] T018 Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` (all six projects, including WebKit). Do not skip failures.
- [X] T019 Run `./build.sh && ./run.sh`, work through `specs/006-not-found-page-style/quickstart.md`, send one `^C`, and confirm the shutdown log line and no leftover container in `docker ps -a`. Also run `curl -si localhost:3000/nope | head -1` and confirm `404` with no `Location` header.
- [X] T020 Look at `/nope` at 320px, 768px, and 1280px, and at `/web-development` at 1280px, and confirm the not-found page looks like the Web Development hero (no card, eyebrow, or grid) and the Web Development page is unchanged.

---

## Dependencies & Execution Order

- Phase 1 first. US1 (T002 to T008), then US2 (T009 to T011), then US3 (T012 to T015). T004 blocks T005 and T006 (the type); T005 and T006 block the e2e runs; T007 and T010 edit the same file, so do them in order.
- Polish (T016 to T020) last.

### Parallel opportunities

- T002 and T003 (different files).
- T012 and T013 extend the same spec file, so they are not marked `[P]`; write them in one edit.
- T016 and T017 (different files).

## Implementation Strategy

**MVP**: Phases 1 and 3 (User Story 1). That gives the new look on desktop. US2 and US3 follow immediately, since responsiveness and the no-redirect check are quick and share the same files.
