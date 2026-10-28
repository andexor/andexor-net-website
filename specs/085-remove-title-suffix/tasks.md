# Tasks: Remove the Title Suffix

**Input**: Design documents from `/specs/085-remove-title-suffix/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: no new tests. Two existing e2e tests are updated to expect the bare title (spec FR-005 and CLAUDE.md, Tests).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: the user story the task serves (US1)

## Phase 1: Setup

No setup needed: no new dependency or configuration.

## Phase 2: Foundational

No blocking prerequisites.

## Phase 3: User Story 1 - Titles without the suffix (Priority: P1) MVP

**Goal**: every page title is the page's headline text, with no " | Andexor Network".

**Independent Test**: open the home page, a content page, and a made-up address; each tab title is the bare headline.

- [X] T001 [P] [US1] In `src/app/layout.tsx`, change the default `title` to `"Enterprise services for small business"` and fix the comment above it so it says the title and meta description are both the headline text (no mention of a suffix).
- [X] T002 [P] [US1] In `src/app/not-found.tsx`, change `title` to `"Page not found"`.
- [X] T003 [P] [US1] In `src/app/[...slug]/page.tsx`, change `generateMetadata` so `title` is `page.title` (no template string).
- [X] T004 [P] [US1] In `content/README.md`, reword the `title` bullet (line 26-27) to: browser tab title; write the same text as the page's `# Heading`; defaults to the first `# Heading`, then to the file name. Remove the sentence about the site adding " | Andexor Network".
- [X] T005 [P] [US1] In `tests/e2e/page-metadata.spec.ts`, remove the `SUFFIX` constant, change the title check to `await expect(page).toHaveTitle(h1)`, and fix the header comment so it no longer mentions the suffix.
- [X] T006 [P] [US1] In `tests/e2e/not-found-style.spec.ts` (line 17), expect `toHaveTitle("Page not found")`.

**Checkpoint**: no file in `src/`, `tests/`, or `content/README.md` contains " | Andexor Network".

## Phase 4: Polish

- [X] T007 Run `bun run format:check`, `bun run build`, and the checks in `specs/085-remove-title-suffix/quickstart.md`; port 3000 must be free.
- [X] T008 Search the changed files for curly quotes and for hover underlines; fix any found.

## Dependencies and Execution Order

- T001-T006 touch different files and can run in parallel.
- T007 and T008 run after T001-T006.

## Implementation Strategy

One story, so the MVP is the whole feature: do T001-T006, then verify with T007 and T008. Do not commit until the owner has viewed the result.
