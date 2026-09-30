---

description: "Task list for the single-line Andexor Network logo wordmark"
---

# Tasks: Single-Line "Andexor Network" Logo Wordmark

**Input**: Design documents from `/specs/003-logo-wordmark/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/logo-component.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change.

**Organization**: Grouped by user story. All three stories touch the same component and stylesheet, so run them in order (US1, US2, US3) rather than in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New and edited source files keep the SPDX license header (constitution Principle VII)

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bun run test`, and `bun run test:e2e` from the repo root and record that they pass before any edits. Port 3000 must be free.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline. The component and stylesheet are the shared base, and they are edited under US1.

---

## Phase 3: User Story 1 - One consistent brand name everywhere (Priority: P1) 🎯 MVP

**Goal**: Every header and footer shows the mark and the single line "Andexor Network", with no "Network, Inc." wordmark line.

**Independent Test**: Open `/`, `/web-development`, and `/nope`. Each header (or hero) and footer shows "Andexor Network" on one line and no "Network, Inc." lockup text.

### Tests for User Story 1

- [X] T002 [P] [US1] Create `tests/unit/logo.test.tsx` (with license header) testing `Logo` from `src/components/marketing/Logo.tsx`: renders the text "Andexor Network" once; renders no "Network, Inc." text; mark `<img>` has `alt=""`; with `href` it renders a link named "Andexor Network" pointing at that `href`; without `href` it renders no link; `light` adds the light modifier class; `size="hero"` adds the hero modifier class. Tests fail until T004.
- [X] T003 [P] [US1] Add `tests/e2e/brand-wordmark.spec.ts` (with license header; no existing e2e spec depended on the old wordmark; Playwright's loader here rejects type annotations in spec files, so it relies on contextual typing). For `/`, `/web-development`, and `/nope`, assert the header (hero on `/`) and the footer each show "Andexor Network", and `page.getByText("Network, Inc.")` matches only the footer copyright line and never a logo lockup. Assert on `/web-development` that the header logo link goes to `/`.

### Implementation for User Story 1

- [X] T004 [US1] Edit `src/components/marketing/Logo.tsx` per `contracts/logo-component.md`: remove `compact` and the `.an-logo-tagline` span; render one `<span className="an-logo-wordmark">Andexor Network</span>`; set the mark to `alt=""`; add `size?: "default" | "hero"` (default `"default"`); make `href` optional, rendering `<a>` when present and `<div>` when absent; keep `light`.
- [X] T005 [US1] Edit `src/components/marketing/Footer.tsx`: pass `href="#top"` to `<Logo light />` (the default `href` is removed in T004).
- [X] T006 [US1] Edit `src/components/marketing/Hero.tsx`: replace the hand-written `<img>` and `an-hero__brand-name` span in the brand row with `<Logo size="hero" light />`. Keep the glow div and the row wrapper. Remove the eslint-disable comment that no longer applies.
- [X] T007 [US1] Edit `src/styles/marketing.css` lockup styles: delete `.an-logo-tagline` and `.an-logo-wordmark--light .an-logo-tagline`; make `.an-logo-wordmark` a single-line `white-space: nowrap` block; keep `.an-logo-wordmark--light` color `#ffffff`. Remove `.an-hero__logo` and `.an-hero__brand-name` once Hero no longer uses them, and in the same edit add the `.an-logo-lockup--hero` rules (see T011) so the hero looks unchanged at the US1 checkpoint.
- [X] T011 [US1] Edit `src/styles/marketing.css` hero modifier (do this together with T007): add `.an-logo-lockup--hero` with `gap: 22px`, `--logo-mark-size: clamp(72px, 9vw, 112px)` and `--logo-wordmark-size: clamp(32px, 4.4vw, 54px)` per `design/README.md`. These are the design system's hero sizes (plan.md, Design Decisions). Verify the hero looks the same as before the change.
- [X] T008 [US1] Run `bun run lint` and `bun run test`; T002 must now pass.

**Checkpoint**: Wordmark text is correct on every page.

---

## Phase 4: User Story 2 - Logo mark and wordmark have their own sizes (Priority: P1)

**Goal**: The mark (38px) and the wordmark text (26px) have separate size settings, and the lockup fits on one line at every width.

**Independent Test**: At desktop and 320px widths, the wordmark text height matches the mark height in header and footer, the lockup does not wrap, and the page has no horizontal scroll.

### Tests for User Story 2

- [X] T009 [US2] Extend `tests/e2e/brand-wordmark.spec.ts`: for the header logo on `/web-development` and the footer logo on `/`, at 1280px and 320px viewport widths, assert (a) the mark's rendered height is 38px and the wordmark's computed `font-size` is 26px, (b) the wordmark's bounding box height is at most one line, (c) the lockup's right edge is inside its container and `document.documentElement.scrollWidth <= innerWidth`. Also assert the footer lockup does not overflow at 800px and 1024px widths.

### Implementation for User Story 2

- [X] T010 [US2] Edit `src/styles/marketing.css`: define `--logo-mark-size: 38px` and `--logo-wordmark-size: 26px` on `.an-logo-lockup`; set `.an-logo-mark` to `width`/`height: var(--logo-mark-size)`; set `.an-logo-wordmark` to `font-size: var(--logo-wordmark-size)`, `line-height: 1`, `font-family: var(--font-display)`, `font-weight: 700`, `letter-spacing: -0.02em`, `color: var(--text-heading)`; keep `gap: 11px` between mark and text (scale it down with the size if it looks off at 26px).
- [X] T012 [US2] Edit `src/styles/marketing.css` footer grid so the first column fits the lockup: widen the first `grid-template-columns` track (for example `minmax(20rem, 1.6fr) repeat(3, 1fr)`), and raise the single-column breakpoint from 720px if the lockup does not fit between 721px and 1024px. Choose values by measuring in T009, not by guessing. *Result: measured at 320, 725, 800, 1024, and 1280px; the grid already grows the first column to fit the lockup (354px), so no grid change was needed and other columns only wrap a little at 800px.*
- [X] T013 [US2] Run `bun run test:e2e`; T009 must pass in every configured project. Fix any wrap or overflow found by adjusting T010 or T012, not by weakening the test.

**Checkpoint**: Mark and wordmark are sized separately, and fit everywhere.

---

## Phase 5: User Story 3 - Change the logo in one place (Priority: P2)

**Goal**: Exactly one definition of the mark-plus-wordmark lockup, used by every header and footer.

**Independent Test**: A repo search finds "Andexor Network" as wordmark text and the `logo-gold.svg` mark only inside `Logo.tsx`, apart from page metadata, copy, and the copyright line.

### Tests for User Story 3

- [X] T014 [P] [US3] Add to `tests/unit/logo.test.tsx`: read `src/components/marketing/Hero.tsx`, `src/components/marketing/Footer.tsx`, and `src/components/content/ContentPage.tsx` as text and assert none contains `logo-gold.svg` (only `Logo.tsx` references the mark). Add a render test that `ContentPage` (via `NotFound`) and `Footer` each render the shared lockup: a link named "Andexor Network" with the light modifier in the footer.

### Implementation for User Story 3

- [X] T015 [US3] Run `grep -rn "logo-gold\|an-logo\|an-hero__logo\|an-hero__brand-name\|Network, Inc\." src` and confirm every remaining match is either in `Logo.tsx`, `marketing.css`'s lockup rules, page titles, or the copyright line. Remove any leftover copy or dead CSS.
- [X] T016 [US3] Edit `src/components/marketing/Hero.tsx` header comment and `src/styles/marketing.css` comment block (top of file mentions Logo) if they describe the old lockup.

**Checkpoint**: One lockup definition.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T017 [P] Add one dated entry to the Amendments section of `specs/001-homepage-contact-us/spec.md` (002 has no Amendments section; its conflicts are recorded there) noting the single-line wordmark, the removed `compact` variant, and that the home page's top brand area is no longer a link. Amend `specs/002-content-pages-card-template/spec.md` FR-010 to read: the logo on a content page MUST link to the home page, and the footer logo MUST keep scrolling to the top of the home page. Point both at `specs/003-logo-wordmark/spec.md`. Leave the historical 001 `tasks.md` alone.
- [X] T018 [P] Grep the CSS for hover underlines (`grep -rn "underline" src/styles`), and run `tests/unit/no-hover-underline.test.ts`; the lockup must change color on hover, never underline.
- [X] T019 Run `bun run lint`, `bun run test`, and `bun run test:e2e` (all projects, including WebKit). Do not skip failures.
- [X] T020 Run `./build.sh && ./run.sh`, work through `specs/003-logo-wordmark/quickstart.md` manually, send one `^C`, and confirm the shutdown log line and no leftover container in `docker ps -a`.
- [X] T021 Look at the running site at 320px, 768px, and 1280px widths (home, `/web-development`, `/nope`) and confirm the lockup looks balanced in header, hero, and footer.

---

## Dependencies & Execution Order

- Phase 1 first. T004 blocks T005 to T007. T007 and T010 to T012 edit the same CSS file, so do them in order.
- US1 (T002 to T008) then US2 (T009 to T013) then US3 (T014 to T016). US2 builds on the classes US1 creates; US3 is a check on the finished result.
- Polish (T017 to T021) last.

### Parallel opportunities

- T002 and T003 (different files).
- T014 can be written alongside T009.
- T017 and T018 (different files).

## Implementation Strategy

**MVP**: Phases 1 and 3 (User Story 1). That delivers the new wording on every page. Sizing (US2) follows immediately; without it the wordmark would keep its old 19px size, so ship US1 and US2 together in practice.

## Phase 7: Revision (2026-09-30, owner review)

The owner clarified that "same size as the logo" meant the visible pixels of the image, and asked for two settings. They also asked to drop ", Inc." from page titles.

- [X] T022 [US2] Edit `src/styles/marketing.css`: replace the single `--logo-size` with `--logo-mark-size: 38px` and `--logo-wordmark-size: 26px`; remove the phone `clamp`; update the hero modifier to override both.
- [X] T023 [US2] Edit `tests/e2e/brand-wordmark.spec.ts`: assert a 38px mark and a 26px wordmark instead of matching sizes.
- [X] T024 Drop ", Inc." from page titles in `src/app/layout.tsx`, `src/app/not-found.tsx`, and `src/app/[...slug]/page.tsx`; keep it in the footer copyright line in `src/components/marketing/Footer.tsx`.
- [X] T025 Update `tests/e2e/web-development.spec.ts` (title now "Web Development | Andexor Network") and add title assertions to `tests/e2e/brand-wordmark.spec.ts`.
- [X] T026 Update spec 003 (FR-003, FR-010, SC-003, US2, assumptions), plan, research, data model, contract, quickstart, and spec 002's title rule.
- [X] T027 Run lint, `tsc`, unit tests, and the full e2e suite, and check the sizes visually.
