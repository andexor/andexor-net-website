---

description: "Task list for linking the footer entries to the new stub pages"
---

# Tasks: Footer Links to the New Stub Pages

**Input**: Design documents from `/specs/010-footer-page-links/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/footer-links.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-007 requires an automated check that each footer page exists.

**Organization**: Grouped by user story. The source change is one map in `Footer.tsx`, filled in two steps (US1 then US2); US3 adds only tests.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`); rely on contextual typing, as in `tests/e2e/link-style.spec.ts`
- Spec 011 (service cards) also edits `tests/unit/content-links.test.tsx`. Keep two constants there, `CARD_PAGES` (four card pages) and `FOOTER_PAGES` (nine footer pages, including `/web-development`), and make `APPROVED` their sorted, de-duplicated union. If 011 already changed the file, add only what is missing.

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - Footer service links open their pages (Priority: P1) 🎯 MVP

**Goal**: Web Hosting, Technical SEO, Agentic Systems, Cost Reduction, Lead Generation, Growth Marketing, and Process Re-engineering each open their page from the home page footer.

**Independent Test**: On `/`, activate each of the seven entries. Each opens a page whose level 1 heading matches the entry.

### Tests for User Story 1 (write first; they fail until T005)

- [X] T002 [US1] Create `tests/e2e/footer-links.spec.ts` (with the SPDX header). Define a `PAGES` array of `[label, path]` pairs: `["Web Hosting", "/web-hosting"]`, `["Technical SEO", "/technical-seo"]`, `["Agentic Systems", "/agentic-systems"]`, `["Cost Reduction", "/cost-reduction"]`, `["Lead Generation", "/lead-generation"]`, `["Growth Marketing", "/growth-marketing"]`, `["Process Re-engineering", "/process-re-engineering"]`, `["About Us", "/about-us"]`. Add a data-driven test per entry: `page.goto("/")`, click `page.locator("footer").getByRole("link", { name: label, exact: true })`, expect `page` to have URL ending with the path and `getByRole("heading", { level: 1, name: label, exact: true })` to be visible. (About Us is exercised by T006; include the whole array now so the file is written once.)
- [X] T003 [US1] In `tests/unit/content-links.test.tsx`, define `FOOTER_PAGES = ["/about-us", "/agentic-systems", "/cost-reduction", "/growth-marketing", "/lead-generation", "/process-re-engineering", "/technical-seo", "/web-development", "/web-hosting"]` (sorted) and change the footer test to expect the sorted internal links of the rendered `<Footer />` to equal `FOOTER_PAGES` (replacing `toContain("/web-development")`). Keep `APPROVED` as the sorted union with `CARD_PAGES` (see Format notes) and update the file's comment to say the owner approved these pages for the footer. The existing "published (not drafts)" test then covers FR-007.

### Implementation for User Story 1

- [X] T004 [US1] In `src/components/marketing/Footer.tsx`, add these entries to `ITEM_HREFS`, after `"Web Development"`: `"Web Hosting": "/web-hosting"`, `"Technical SEO": "/technical-seo"`, `"Agentic Systems": "/agentic-systems"`, `"Cost Reduction": "/cost-reduction"`, `"Lead Generation": "/lead-generation"`, `"Growth Marketing": "/growth-marketing"`, `"Process Re-engineering": "/process-re-engineering"`. Leave `slugify` and the `?? \`#${slugify(item)}\`` fallback (still used by "Contact") and leave the "Privacy" and "Terms" links alone.
- [X] T005 [US1] Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e`. The seven US1 tests in `tests/e2e/footer-links.spec.ts` must pass. T003's unit test still fails until T006 (`/about-us` is not linked yet); that is expected.

**Checkpoint**: Seven of the eight links work. Stop here only if About Us is deliberately deferred.

---

## Phase 4: User Story 2 - The About Us link opens its page (Priority: P1)

**Goal**: "About Us" in the Company column opens the About Us page.

**Independent Test**: On `/`, activate "About Us" in the footer; the About Us page opens.

- [X] T006 [US2] In `src/components/marketing/Footer.tsx`, add `"About Us": "/about-us"` to `ITEM_HREFS`. Update the comment above `Footer` (it says all links are placeholders per FR-017) to say the service and About Us entries link to their pages, and Contact, Privacy, Terms, and the social links are unchanged.
- [X] T007 [US2] Run `bun run test` and `bun run test:e2e`. T003's unit test and the "About Us" case in `tests/e2e/footer-links.spec.ts` must now pass.

**Checkpoint**: All eight links work from the home page.

---

## Phase 5: User Story 3 - Footer links work from every page (Priority: P2)

**Goal**: The same links lead to the same pages from a content page and from the not-found page.

**Independent Test**: From `/web-development` and `/nope`, activate each updated footer link; each opens the right page.

- [X] T008 [US3] In `tests/e2e/footer-links.spec.ts`, run the same loop from T002 for each start page in `["/", "/web-development", "/nope"]` (an outer loop over start pages, an inner loop over `PAGES`, test titles like `footer "Web Hosting" opens /web-hosting from /nope`). Replace the home-page-only loop from T002 rather than duplicating it. Add one more test that, on each start page, the footer's "Contact", "Privacy", and "Terms" links still have `href` `#contact`, `#privacy`, and `#terms` (FR-003). No source change is expected.
- [X] T009 [US3] Run `bun run test:e2e` and confirm the new tests pass in all six projects. If a start-page case fails, fix `Footer.tsx` (addresses must start with `/`); do not special-case a page.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T010 [P] In `specs/001-homepage-contact-us/spec.md`, add a dated entry to the Amendments (2026-09-30, see `specs/010-footer-page-links/spec.md`): the footer links Web Hosting, Technical SEO, Agentic Systems, Cost Reduction, Lead Generation, Growth Marketing, Process Re-engineering, and About Us to their pages; Contact, Privacy, and Terms remain placeholders. Update FR-017's parenthetical to match. If spec 011 already added a note there, merge the two into one.
- [X] T011 [P] Check `specs/001-homepage-contact-us/tasks.md`, `data-model.md`, and `quickstart.md`, and `specs/002-content-pages-card-template/spec.md`, for lines that say footer links other than Web Development are placeholders, and correct them.
- [X] T012 Grep for regressions: `grep -rn "underline" src/styles`, `grep -rn "#top" src content`, and `grep -n "placeholder" CLAUDE.md content/README.md`. Confirm nothing new, and update `CLAUDE.md` only if it says footer links are placeholders. Then run the manual steps in `quickstart.md`, including the Docker shutdown check (`./build.sh && ./run.sh`, one `^C`, `docker ps -a` shows no leftover container).
- [ ] T013 Do not open a PR unless asked. Commit with `git commit -s`, subject ending in `Closes #N.` for the GitHub issue.

---

## Dependencies & Execution Order

- T001, then T002 and T003 (different files, can run in parallel; both are written before T004), then T004, T005.
- US2 (T006, T007) follows T004 because both edit `Footer.tsx`. US3 (T008, T009) follows T007 and edits the file T002 created.
- T010 and T011 can run any time after T007. T012 and T013 come last.
- Spec 011's US2 (card and footer agree) needs this spec through T007.

## Parallel Example: User Story 1

```text
T002 tests/e2e/footer-links.spec.ts
T003 tests/unit/content-links.test.tsx
```

## Implementation Strategy

MVP is US1 (T001 to T005): seven map entries and the tests. US2 is one more entry and is the same
change in practice, so do T004 and T006 together if you are not stopping at a checkpoint. US3 adds
coverage only, since absolute addresses already work from every page. Build spec 011 before or
after this on the same branch; the two only share the approved-pages list in
`tests/unit/content-links.test.tsx`.
