---

description: "As-built task list for content pages, card template, and Web Development page"
---

# Tasks: Content Pages, Card Template, and Web Development Page

**Input**: Design documents from `/specs/002-content-pages-card-template/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content-contracts.md

**Note**: As-built list. Tasks for work that already exists are checked. Tests were not requested
here; `/speckit-converge` will append any remaining gaps.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Add Markdown pipeline dependencies (`unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-slug`, `rehype-external-links`, `rehype-stringify`, `gray-matter`) to package.json
- [X] T002 [P] Create `content/README.md` documenting routes, front matter, card layout, copy rules, and publishing

## Phase 2: Foundational

- [X] T003 Implement content discovery, front matter, draft skipping, and title fallback in src/lib/content.ts
- [X] T004 Implement Markdown rendering (GFM, anchors, external links, raw HTML dropped) in src/lib/content.ts
- [X] T005 Create catch-all route with static params, metadata, and 404 in src/app/[...slug]/page.tsx
- [X] T006 Create the content page shell (logo bar, article, footer) in src/components/content/ContentPage.tsx
- [X] T007 [P] Add prose styles in src/styles/content.css and import them in src/styles/globals.css
- [X] T008 [P] Add `href` prop (default `#top`) to src/components/marketing/Logo.tsx

## Phase 3: User Story 2 - Author a page as Markdown (P1)

**Goal**: Owner adds a Markdown file and it publishes.
**Independent Test**: Add `content/about.md`, rebuild, open `/about`; add `draft: true`, rebuild, 404.

- [X] T009 [US2] Map `content/<path>.md` and `<folder>/index.md` to routes; ignore README and root index in src/lib/content.ts
- [X] T010 [US2] Unit tests for routing, front matter, rendering, and links in tests/unit/content.test.ts

## Phase 4: User Story 1 - Read a service page (P1)

**Goal**: Visitor reaches and reads the Web Development page.
**Independent Test**: Click the service card and the footer link; page shows H1 "Web Development" and nine cards.

- [X] T011 [US1] Write the Web Development page in content/web-development.md (nine cards, featured "Need a web application?" and "How about an AI agent?")
- [X] T012 [P] [US1] Add hero illustration public/web-development.png
- [X] T013 [US1] Add optional `href` to src/components/marketing/services-data.ts and use it in src/components/marketing/Services.tsx
- [X] T014 [US1] Add `ITEM_HREFS` for Web Development in src/components/marketing/Footer.tsx
- [X] T015 [US1] Use `<Logo href="/" />` in src/components/content/ContentPage.tsx
- [X] T016 [US1] Rename H1 to "Web Development" (issue #7) and update copy (issue #9) in content/web-development.md

## Phase 5: User Story 3 - Control when a page is discoverable (P2)

**Goal**: Pages stay unlinked until approved.
**Independent Test**: Confirm no home-page or footer link to an unapproved page.

- [X] T017 [US3] Document the unlinked-until-approved policy in content/README.md and CLAUDE.md
- [X] T018 [US3] Record the policy as constitution Principle VIII in .specify/memory/constitution.md

## Phase 6: User Story 4 - Read cards comfortably on any device (P2)

**Goal**: Hero blends into cards, cards align.
**Independent Test**: Check 320px, 768px, 1920px.

- [X] T019 [US4] Split rendered HTML into hero, intro, and cards; deal into two columns; support `>> Label` and `featured` in src/lib/content.ts
- [X] T020 [US4] Render the card hero and cards in src/components/content/ContentPage.tsx
- [X] T021 [US4] Create src/styles/cards.css (hero, tiles, columns, stacked narrow layout) and import in src/styles/globals.css
- [X] T022 [US4] Fade hero background from `--surface-ink` into `--surface-page` in src/styles/cards.css
- [X] T023 [US4] Add `align-items: stretch` to the single-column `.an-cards` layout in src/styles/cards.css
- [X] T024 [US4] Unit tests for card splitting, labels, and featured in tests/unit/content.test.ts

## Phase 7: User Story 5 - Always see the dark look (P2)

**Goal**: Same dark page for all visitors.
**Independent Test**: Light and dark OS setting give identical background.

- [X] T025 [US5] Make dark aliases unconditional with `color-scheme: dark` in src/styles/tokens/colors.css
- [X] T026 [US5] Update e2e test for identical backgrounds and no toggle in tests/e2e/dark-mode.spec.ts

## Phase 8: User Story 6 - Stop the site cleanly (P3)

**Goal**: One `Ctrl+C` or `docker stop` ends the container.
**Independent Test**: Send one SIGINT; log line, exit 0, no leftover container.

- [X] T027 [US6] Add SIGINT/SIGTERM handlers with drain, repeat-signal guard, and 5s fallback in server.ts

## Phase 9: User Story 7 - Hover signals by color only (P3)

**Goal**: No underline on hover anywhere.
**Independent Test**: Hover all link types.

- [X] T028 [P] [US7] Remove the hover underline rule in design/tokens/base.css
- [X] T029 [P] [US7] Keep no hover underline in src/styles/tokens/base.css
- [X] T030 [US7] Record the rule in CLAUDE.md and constitution Principle VI

## Phase 10: Polish & Cross-Cutting

- [X] T031 Amend specs/001-homepage-contact-us/spec.md for the always-dark and link changes
- [X] T032 Update CLAUDE.md project status and constitution note
- [X] T033 Amend the constitution to v1.1.0 in .specify/memory/constitution.md

## Dependencies & Execution Order

- Phases 1 and 2 first. US2 and US1 (P1) next, then US3 to US5 (P2), then US6 and US7 (P3).
- US4 depends on T003 to T006. US1 depends on US2 and US4 for rendering.

## Phase 11: Convergence

- [X] T034 CRITICAL Verify graceful shutdown in Docker: run `./build.sh`, start the container, send one SIGINT, confirm the `Received SIGINT, shutting down` log line, exit status 0, and no leftover container in `docker ps -a`; repeat with `docker stop`; record the result in specs/002-content-pages-card-template/quickstart.md per Constitution VII (partial)
- [X] T035 [P] CRITICAL Add Playwright accessibility (axe) and keyboard-navigation checks for `/web-development` covering focus visibility on links and the footer in tests/e2e/content-page-a11y.spec.ts per Constitution III and SC-008 (missing). Done for `/web-development` and the not-found page.
- [X] T036 [P] [US1] Add Playwright test that the home-page Web Development service card and the footer link both lead to `/web-development`, and that the page shows H1 "Web Development", eyebrow "Technical Services", nine cards in order, and the two featured cards, in tests/e2e/web-development.spec.ts per US1/AC1-AC5 and FR-020 to FR-023 (missing)
- [X] T037 [P] [US4] Add Playwright responsive checks for `/web-development` at 320px, 768px, and 1920px: no horizontal scroll, two columns when wide, one column with equal-width cards at 320px, in tests/e2e/web-development-responsive.spec.ts per FR-017, FR-019, and SC-006 (missing)
- [X] T038 [US5] Extend tests/e2e/dark-mode.spec.ts so `/web-development` and `/nope` render the same page background in light and dark OS settings per SC-003 (partial). The not-found page (`/nope`) is included; Playwright now runs against the production build because `next dev` returns 500 for unknown slugs under static export.
- [X] T039 [US5] Check that an unknown address (for example `/nope`) shows a dark "not found" page; if the default framework 404 renders light or unstyled, add src/app/not-found.tsx using the site header, tokens, and footer, with the SPDX header, per FR-006 and FR-024 (partial). Done: the default 404 injected a light `body{background:#fff}`; replaced by src/app/not-found.tsx, tested in tests/unit/not-found.test.tsx and in the e2e specs against the production build.
- [X] T040 [US7] Add an automated check (unit test reading src/styles and design/tokens CSS) that no rule with a `:hover` selector sets `text-decoration: underline`, in tests/unit/no-hover-underline.test.ts per FR-026, SC-004, and Constitution VI (missing)
- [X] T041 [US3] Add a unit or e2e test that the only content-page links on the home page and footer are the approved `/web-development` ones, and that `draft: true` pages do not appear, per FR-013 and SC-007 (missing)
- [X] T042 [P] Review and either reference or delete the unreferenced public/web-development.png (about 318 KB; the page uses public/web-development.png). Deleted (nothing referenced it; still in git history) per plan: source layout (unrequested)
- [X] T043 [P] Fix the stale comment in src/styles/content.css that says the logo bar sits on a light surface; the site is always dark per FR-024 (contradicts)
