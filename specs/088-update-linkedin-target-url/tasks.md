# Tasks: Point the Footer LinkedIn Icon at the Company Page

**Input**: Design documents from `/specs/088-update-linkedin-target-url/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: none added; the address is a constant. The existing footer e2e checks must still pass.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: the user story the task serves (US1)

## Phase 1: Setup

No setup needed: no new dependency or configuration.

## Phase 2: Foundational

No blocking prerequisites.

## Phase 3: User Story 1 - Reach the company page from the footer (Priority: P1) MVP

**Goal**: the footer's LinkedIn icon opens the Andexor Network company page.

**Independent Test**: build the site; the footer's LinkedIn link in `out/index.html` has `href="https://www.linkedin.com/company/andexor/"`, and no footer link points to `https://www.linkedin.com/in/ejenkins/`.

- [X] T001 [US1] In `src/components/marketing/Footer.tsx`, in the `linkedin` entry of `SOCIAL_LINKS`, change `href` from `"https://www.linkedin.com/in/ejenkins/"` to `"https://www.linkedin.com/company/andexor/"`. Leave `key`, `label`, and `icon` as they are. Leave the founder's link in `content/about-us.md` as it is.

**Checkpoint**: `bun run build` succeeds and the footer link has the new address.

## Phase 4: Polish

- [X] T002 Run `bun run format:check`, `bun run build`, `bun run test`, and the checks in `specs/088-update-linkedin-target-url/quickstart.md` (`bun run test:e2e` needs port 3000 free).
- [X] T003 Search the changed files for curly quotes and for hover underlines; fix any found.

## Dependencies and Execution Order

T001 first, then T002 and T003 (T003 can run beside T002). One story, so MVP is the whole feature.
