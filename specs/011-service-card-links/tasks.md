---

description: "Task list for linking the home page service cards to their pages"
---

# Tasks: Home Page Service Cards Link to Their Pages

**Input**: Design documents from `/specs/011-service-card-links/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/service-card-links.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-008 requires an automated check that each card's page exists.

**Organization**: Grouped by user story. US1 is the whole fix; US2 only adds a check and needs spec 010 (footer links) built first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`); rely on contextual typing, as in `tests/e2e/link-style.spec.ts`
- Spec 010 also edits `tests/unit/content-links.test.tsx` (the approved-pages list). Keep it as one list; add only the pages that are not already in it.

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - Each service card opens its page (Priority: P1) 🎯 MVP

**Goal**: The Technical SEO, Agentic Systems, and Growth Marketing cards open their pages, and Web Development still does. No card has a placeholder link.

**Independent Test**: On `/`, activate each of the four cards. Each opens a page whose heading matches the card title.

### Tests for User Story 1 (write first; they fail until T005)

- [X] T002 [P] [US1] In `tests/unit/content-links.test.tsx`, extend `APPROVED` to `["/agentic-systems", "/growth-marketing", "/technical-seo", "/web-development"]` (sorted; the "links no page other than the approved ones" test compares a sorted list, and the services-only test `internalPaths(services)` must equal the four card pages in card order: `/web-development`, `/technical-seo`, `/agentic-systems`, `/growth-marketing`). Update the file's comment to say the owner approved these pages for the home page cards. The existing "published (not drafts)" test then covers FR-008.
- [X] T003 [P] [US1] In `tests/unit/services.test.tsx`, add a test that every entry in `SERVICES` has an `href` that starts with `/` and does not start with `#`, and that the four `href` values are `/web-development`, `/technical-seo`, `/agentic-systems`, `/growth-marketing`, matched to their titles. Also assert each rendered card link (`screen.getAllByRole("link")`) has the `href` of its service.
- [X] T004 [P] [US1] In `tests/e2e/homepage-content.spec.ts`, add a test in the "Homepage content" group: for each of Technical SEO (`/technical-seo`), Agentic Systems (`/agentic-systems`), Growth Marketing (`/growth-marketing`), and Web Development (`/web-development`), go to `/`, click the link inside `#services` whose name matches the title, expect the URL to end with the path and a level 1 heading with the title (`{ level: 1, name: title, exact: true }`) to be visible.

### Implementation for User Story 1

- [X] T005 [US1] In `src/components/marketing/services-data.ts`, make `href` required in `ServiceOffering` (`href: string;`) and add `href: "/technical-seo"`, `href: "/agentic-systems"`, and `href: "/growth-marketing"` to the Technical SEO, Agentic Systems, and Growth Marketing entries, after `title`, as Web Development does. Update the comment above `SERVICES` to say every card links to its page.
- [X] T006 [US1] In `src/components/marketing/Services.tsx`, change `href={service.href ?? \`#${service.tag.toLowerCase()}\`}` to `href={service.href}` and replace the comment that says cards are placeholder links (FR-017) with one saying each card links to its page.
- [X] T007 [US1] Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e`. All must pass, including T002 to T004, `tests/unit/no-hover-underline.test.ts`, `tests/unit/no-top-links.test.ts`, and the axe checks in `tests/e2e/homepage-a11y.spec.ts`.

**Checkpoint**: US1 is complete and shippable on its own.

---

## Phase 4: User Story 2 - Cards and footer agree (Priority: P2)

**Goal**: A card and the footer entry of the same name open the same page.

**Independent Test**: For Web Development, Technical SEO, Agentic Systems, and Growth Marketing, the card `href` equals the footer link `href`.

**Depends on**: spec 010 (`specs/010-footer-page-links/`) built, so the footer links exist. If it is not built yet, do not start this phase.

- [X] T008 [US2] In `tests/e2e/homepage-content.spec.ts`, add a test: on `/`, for each of the four titles, read the `href` of the link inside `#services` named for the title and the `href` of the link inside `footer` of the same name; expect them to be equal. (For "Web Development" and "Technical SEO" use `exact: true`, as card link names include the description text; match the card with a regular expression on the title.)
- [X] T009 [US2] Run `bun run test:e2e` and confirm T008 passes.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T010 [P] In `specs/001-homepage-contact-us/spec.md`, add a dated entry to the Amendments (2026-09-30, see `specs/011-service-card-links/spec.md`): the four service cards link to their pages, and FR-017 no longer applies to service cards. Add the same note to FR-017's parenthetical. Do not change other requirements.
- [X] T011 [P] Check `specs/001-homepage-contact-us/tasks.md`, `data-model.md`, and `quickstart.md` for lines that say the Technical SEO, Agentic Systems, or Growth Marketing cards are placeholder links, and correct them.
- [X] T012 Grep the CSS and `src/` for hover underlines and links to `#top` (`grep -rn "underline" src/styles` and `grep -rn "#top" src content`), and confirm nothing new. Run the manual steps in `quickstart.md`, including the Docker shutdown check (`./build.sh && ./run.sh`, one `^C`, `docker ps -a` shows no leftover container).
- [ ] T013 Update `README`/`CLAUDE.md` only if they say service cards are placeholders (`grep -n "placeholder" CLAUDE.md content/README.md`). Do not open a PR unless asked. Commit with `git commit -s`, subject ending in `Closes #N.` for the GitHub issue.

---

## Dependencies & Execution Order

- T001, then T002 to T004 in parallel (different files), then T005 and T006 (different files, both after the tests), then T007.
- US2 (T008, T009) needs spec 010 built. T010 and T011 can run any time after T007.
- T012 and T013 come last.

## Parallel Example: User Story 1

```text
T002 tests/unit/content-links.test.tsx
T003 tests/unit/services.test.tsx
T004 tests/e2e/homepage-content.spec.ts
```

## Implementation Strategy

MVP is US1 (T001 to T007): three data values, one deleted fallback, and the tests. Build spec 010
next on the same branch, then add US2's check. Stop after T007 to validate if you want to ship the
card links first.
