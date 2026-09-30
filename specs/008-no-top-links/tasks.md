---

description: "Task list for removing links to #top and making the footer logo plain"
---

# Tasks: No Links to "#top", and a Plain Footer Logo

**Input**: Design documents from `/specs/008-no-top-links/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/link-rules.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-004 requires an automated guard.

**Organization**: Grouped by user story. Both stories are small; run them in order (US1, US2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`); rely on contextual typing, as in `tests/e2e/link-style.spec.ts`

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - The footer logo is not a link (Priority: P1) 🎯 MVP

**Goal**: The footer logo and wordmark are plain branding: not a link, no tab stop, and not announced as a link.

**Independent Test**: Open `/`, `/web-development`, and `/nope`. In each footer the logo lockup is a plain block inside no link, tabbing never lands on it, and clicking it does nothing.

### Tests for User Story 1 (write first; they fail until T005)

- [X] T002 [P] [US1] Edit `tests/unit/logo.test.tsx`: replace the test "is used by the footer, linking to the top of the page" with one that renders `<Footer />` and asserts there is no link named "Andexor Network" (`screen.queryByRole("link", { name: "Andexor Network" })` is null), that the text "Andexor Network" is still present once inside an element with class `an-logo-lockup--light`, and that this element is a `DIV`. Change the sample `href="#top"` in the "modifier classes" test to `href="/"` so no test sample links to `#top`. Update the file's header comment to cite `specs/008-no-top-links/spec.md`.
- [X] T003 [P] [US1] Create `tests/e2e/no-top-links.spec.ts` (with license header). For `/`, `/web-development`, and `/nope`: `footer .an-logo-lockup` exists, is a `DIV`, and has no ancestor `a` (`el.closest("a")` is null), and `footer .an-logo-lockup` still shows the text "Andexor Network" with the light color `rgb(255, 255, 255)` on its wordmark (FR-002). On `/`: scroll the footer into view, record `window.scrollY`, click the footer lockup, and assert `window.scrollY` is unchanged and `new URL(page.url()).hash` is empty. Tab through the page (press Tab up to 80 times, skipping this test on `webkit` as in `link-style.spec.ts`) and assert `document.activeElement.closest(".an-logo-lockup")` is never inside the footer. On `/web-development`, assert the header logo `.an-content-header .an-logo-lockup` is an `A` with `href="/"` (FR-005). On `/`, assert the hero lockup `#top .an-logo-lockup` is a `DIV` (FR-006).

### Implementation for User Story 1

- [X] T004 [US1] Edit `src/components/marketing/Logo.tsx`: update the header comment so it says that with `href` the lockup is a link and without one it is a plain block, and that a lockup never links to `#top` (`specs/008-no-top-links`). Do not change behavior.
- [X] T005 [US1] Edit `src/components/marketing/Footer.tsx`: change `<Logo light href="#top" />` to `<Logo light />`. Nothing else in the file changes.
- [X] T006 [US1] Run `bun run test` (T002 passes) and `bunx playwright test tests/e2e/no-top-links.spec.ts --project=chromium` (T003 passes).

**Checkpoint**: The footer logo is plain branding.

---

## Phase 4: User Story 2 - No link to "#top" anywhere (Priority: P1)

**Goal**: No link goes to `#top`, and an automated check fails if one is ever added, including in Markdown.

**Independent Test**: The scan finds zero links to `#top` in `src/` and `content/`, and the rendered pages have none.

### Tests for User Story 2

- [X] T007 [P] [US2] Create `tests/unit/no-top-links.test.ts` (with license header). Walk `src/` for `.ts` and `.tsx` files and `content/` for `.md` files (skip `content/README.md`, which documents the rule) with `node:fs`, and assert none contains a link to `#top`. A link to `#top` means a match of `/href\s*[:=]\s*\{?\s*["'`][^"'`]*#top["'`]/` or the Markdown form `/\]\(\s*[^)\s]*#top\s*\)/`. Add guard tests for the scanner itself: each of `href="#top"`, `href={"#top"}`, `href: "#top"`, `href="/#top"`, `href="/page#top"`, and `[Top](#top)` is detected; `id="top"`, `href="#"`, `href="/"`, and `href="#topic"` are not. Name the offending file in the failure message. Structure the scanner as a function that takes a directory and returns the offending file paths, so T010 can point it at a temporary directory.
- [X] T008 [P] [US2] Extend `tests/e2e/no-top-links.spec.ts`: for `/`, `/web-development`, and `/nope`, read every `a[href]` with `page.evaluate` and assert none has an `href` whose fragment is exactly `top` (`new URL(a.href).hash === "#top"` is false for all).

### Implementation for User Story 2

- [X] T009 [US2] Run `grep -rn "#top" src content` and confirm the only matches are `id="top"` attributes and comments, and that none is a link. Fix any link found.
- [X] T010 [US2] Run `bun run test` and `bunx playwright test tests/e2e/no-top-links.spec.ts` on all six projects; T007 and T008 pass. Do not edit real source files to test the guard; T007's guard tests already prove the scanner detects each pattern. To also check it end to end, make the scanner in `tests/unit/no-top-links.test.ts` a function that takes a directory, and add one test that writes a temporary file containing `<a href="#top">x</a>` into a directory under `os.tmpdir()`, runs the scanner on it, expects that file to be named as an offender, and deletes the directory afterward.

**Checkpoint**: The rule is enforced by tests.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T011 [P] Edit `.specify/memory/constitution.md` Principle IV: add a sentence that no link on the site MAY go to `#top` (a page anchor whose fragment is `top`), that the footer logo and the home page hero logo are plain branding and not links, and that the rule is enforced by `tests/unit/no-top-links.test.ts`. Bump `**Version**` to 1.4.0 with `**Last Amended**: 2026-09-30`, add a Sync Impact Report entry (MINOR: new prohibition; owner decision, spec 008; templates in `.specify/templates/` checked: none mention it), and update the "Modified principles" line.
- [X] T012 [P] Edit `CLAUDE.md`: add a section "No links to #top" saying never to link to `#top` anywhere, the footer logo is not a link, that `tests/unit/no-top-links.test.ts` enforces it, to fix conflicting text on sight, and not to ask the owner again; update "currently v1.3.2" to "v1.4.0" and add "no-top-links" to the constitution rule list.
- [X] T013 [P] Edit the earlier specs so they match: `specs/002-content-pages-card-template/spec.md` FR-010 (the logo on a content page links to the home page; no logo scrolls to the top; add "amended by spec 008"), `specs/002-content-pages-card-template/contracts/content-contracts.md` (the "Logo on home page | `#top`" row becomes "Logo in the home page hero and every footer | not a link"), `specs/001-homepage-contact-us/spec.md` Amendments (add a dated 2026-09-30 entry for spec 008: the footer logo is not a link), and `specs/003-logo-wordmark/contracts/logo-component.md` (the `Footer` caller row becomes `light`, with no `href`). Leave historical `plan.md` and `tasks.md` files in earlier specs unchanged.
- [X] T014 Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` (all six projects, including WebKit). Do not skip failures; apply the flaky-test note from T001 if it applies.
- [X] T015 Run `./build.sh && ./run.sh`, work through `specs/008-no-top-links/quickstart.md`, send one `^C`, and confirm the shutdown log line and no leftover container in `docker ps -a`.
- [X] T016 Look at the footer on `/` and `/web-development` at 1280px and 320px and confirm the logo looks exactly as before (FR-002, SC-005), and that hovering it shows no pointer cursor or color change.

---

## Dependencies & Execution Order

- Phase 1 first. US1 (T002 to T006), then US2 (T007 to T010). T005 is the only source change; T004 is a comment.
- Polish (T011 to T016) last. T011, T012, and T013 edit different files.

### Parallel opportunities

- T002 and T003 (different files).
- T007 and T008 (different files: `tests/unit/no-top-links.test.ts` and `tests/e2e/no-top-links.spec.ts`; T003 and T008 also edit the same e2e file, so do T008 after T003).
- T011, T012, and T013 (different files).

## Implementation Strategy

**MVP**: Phases 1 and 3 (User Story 1): the footer logo is plain. US2 (the standing guard) follows immediately, since it is small and shares the same e2e file. Then the rule is recorded in the constitution and `CLAUDE.md`.
