---

description: "Task list for moving pages and static resources (issue #118)"
---

# Tasks: Move Pages and Static Resources

**Input**: Design documents from `/specs/093-move-pages-static-resources/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/urls.md, quickstart.md

**Tests**: Included. The spec's acceptance criteria require every unit and end-to-end test to pass, and the plan
defines two new checks (the redirect-list test and the no-old-prefix check over the build output). No test is
written for wording, lifetimes, or documents.

**Organization**: Tasks are grouped by user story. The file moves in Phase 2 are the one shared prerequisite.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 to US5, as numbered in spec.md)
- Every task names the file it touches

## Path Conventions

Single project at the repository root: `content/`, `public/`, `src/`, `tests/`, `scripts/`, `.specify/`.

## Standing rules for every task

- Straight quotes only, in every file. Check after writing.
- No link to `#top`, no underline on links, no newline inside React-rendered text.
- Use `git mv` for moves so history follows the file.
- Do not commit and do not run `wrangler deploy`. The owner reviews the result first and says when to commit.
- The address map in data-model.md is the single source for old-to-new pairs. Do not invent a new name.

---

## Phase 1: Setup

**Purpose**: confirm the working state before moving files.

- [X] T001 Confirm the branch is `118-move-pages-and-static-resources`, the tree is clean (`git status`), and nothing
      listens on port 3000 (`lsof -i :3000`); stop any leftover `bun run server.ts` from an earlier run.

---

## Phase 2: Foundational (file moves)

**Purpose**: put every page and resource at the path that is its new route. Every user story reads from these paths.

**CRITICAL**: no story task starts before all three moves are done; otherwise links are updated to addresses that do
not exist yet.

- [X] T002 [P] Move the eight service pages with `git mv` into `content/services/`: `agentic-systems.md`,
      `cost-reduction.md`, `growth-marketing.md`, `lead-generation.md`, `process-re-engineering.md`,
      `technical-seo.md`, `web-development.md`, `web-hosting.md`. `content/README.md`, `content/robots.txt`, and
      `content/sitemap.xml` stay at the root of `content/`.
- [X] T003 [P] Move the four company pages with `git mv` into `content/company/`: `about-us.md`, `privacy-policy.md`,
      `security-policy.md`, `terms-of-service.md`.
- [X] T004 [P] Move the three resource folders with `git mv`: `public/fonts/` to `public/static/fonts/`,
      `public/images/` to `public/static/images/`, `public/logo/` to `public/static/logo/` (23 files in all; see the
      resource table in data-model.md). Favicons, `site.webmanifest`, `browserconfig.xml`, `_headers`, and
      `.well-known/` stay where they are.
- [X] T005 Confirm the layout with `bun run build`: `out/services/*.html` (8), `out/company/*.html` (4), and
      `out/static/{fonts,images,logo}/` exist, and no file is left under `out/fonts/`, `out/images/`, or `out/logo/`.
      Broken image and font references are expected at this point; they are fixed in Phase 3.

**Checkpoint**: the new addresses render (with missing images); the old ones answer 404 locally.

---

## Phase 3: User Story 1 - Pages live under their section prefix (Priority: P1) MVP

**Goal**: every link and resource reference the site emits points at a new address, so each page renders fully at
`/services/...` or `/company/...` with its images, logo, and fonts from `/static/...`.

**Independent Test**: build, open all twelve pages at their new addresses, and confirm no image, font, or logo
request fails and no `href` or `src` on any page starts with an old prefix. The built-output check in T025 makes
this a unit test; `bun run test:e2e` covers the visitor's view.

### Content (frontmatter and body links)

- [X] T006 [P] [US1] In each of the eight files under `content/services/`, change the frontmatter `image:` from
      `/images/<name>.png` to `/static/images/<name>.png` (the file name does not change).
- [X] T007 [P] [US1] In each of the four files under `content/company/`, change the frontmatter `image:` to
      `/static/images/<name>.png` (`about-us.png`, `privacy.png`, `security.png`, `terms.png`).
- [X] T008 [P] [US1] Update body links to service pages in `content/services/web-development.md` (lines linking
      `/web-hosting`, `/technical-seo`, `/process-re-engineering`, `/agentic-systems`, `/growth-marketing`,
      `/lead-generation`, `/cost-reduction`), `content/services/cost-reduction.md` (`/web-hosting` twice,
      `/process-re-engineering`), and `content/services/technical-seo.md` (`/web-hosting`, `/growth-marketing`) to
      `/services/<page>`. Change only the link target, never the link text.
- [X] T009 [P] [US1] Update body links to policy pages in `content/company/terms-of-service.md` (`/privacy-policy`
      twice, `/security-policy`), `content/company/privacy-policy.md` (`/terms-of-service`, `/security-policy`
      twice), and `content/company/security-policy.md` (`/terms-of-service`) to `/company/<page>`. Change only the
      link target.

### Components and styles

- [X] T010 [P] [US1] In `src/components/marketing/Footer.tsx`, change every value in `ITEM_HREFS`: the eight service
      entries to `/services/<page>`, and About Us, Terms Of Service, Security Policy, Privacy Policy to
      `/company/<page>`.
- [X] T011 [P] [US1] In `src/components/marketing/services-data.ts`, change each card `href` to
      `/services/<page>` (eight cards).
- [X] T012 [P] [US1] In `src/components/contact/ContactPopup.tsx`, change the logo `src` to
      `/static/logo/logo-gold.svg` and the Privacy and Terms links to `/company/privacy-policy` and
      `/company/terms-of-service`. Keep their white color and new-tab behavior.
- [X] T013 [P] [US1] In `src/components/marketing/Logo.tsx`, change the `img` `src` to `/static/logo/logo-gold.svg`.
- [X] T014 [P] [US1] In `src/app/not-found.tsx`, change the illustration `src` to `/static/images/404.png`.
- [X] T015 [P] [US1] In `src/app/layout.tsx`, change the four font preload addresses to `/static/fonts/<file>`.
- [X] T016 [P] [US1] In `src/styles/fonts.css`, change the four `@font-face` `src: url(...)` addresses to
      `/static/fonts/<file>`.
- [X] T017 [P] [US1] In `src/styles/cards.css`, change the hero backdrop `url("/images/city-grid.svg")` to
      `url("/static/images/city-grid.svg")`.

### Existing tests (addresses only)

- [X] T018 [P] [US1] In `tests/unit/content-links.test.tsx`, change `CARD_PAGES` to the `/services/...` addresses and
      `FOOTER_PAGES` to the `/services/...` and `/company/...` addresses; keep the sets otherwise identical.
- [X] T019 [P] [US1] In `tests/unit/services.test.tsx`, change the expected card hrefs to `/services/<page>`.
- [X] T020 [P] [US1] In `tests/unit/contact-popup.test.tsx`, change the expected logo `src` to
      `/static/logo/logo-gold.svg` (two places) and the `sourcePath` used in the submit test to
      `/services/web-development` (two places).
- [X] T021 [P] [US1] In `tests/unit/not-found.test.tsx`, change the expected illustration `src` to
      `/static/images/404.png`. In `tests/unit/contact-service.test.ts` and `tests/unit/contact-provider.test.tsx`,
      change the sample `sourcePath` and `mockPathname` values from `/web-development` to
      `/services/web-development`.
- [X] T022 [P] [US1] In the Playwright specs that list footer or card links, change the expected addresses:
      `tests/e2e/footer-links.spec.ts` (the twelve `LINKS` pairs and the `START_PAGES` and loop addresses),
      `tests/e2e/homepage-content.spec.ts` (the eight card pairs), `tests/e2e/contact-popup-links.spec.ts` (Privacy
      and Terms), `tests/e2e/contact-popup-logo.spec.ts` (logo `src`, two places), `tests/e2e/not-found-style.spec.ts`
      (`/static/images/404.png` and the visited pages), `tests/e2e/font-loading.spec.ts` (route pattern
      `**/static/fonts/*.woff2`), `tests/e2e/contact-submit.spec.ts` (visited page and expected `sourcePath`).
- [X] T023 [P] [US1] In the remaining Playwright specs that only visit a content page, replace `/web-development`
      with `/services/web-development`, `/web-hosting` with `/services/web-hosting`, `/cost-reduction` with
      `/services/cost-reduction`, `/about-us` with `/company/about-us`, and `/privacy-policy`, `/security-policy`,
      `/terms-of-service` with their `/company/` addresses in: `phone-links.spec.ts`, `cookie-declaration.spec.ts`,
      `dark-mode.spec.ts`, `static-server.spec.ts`, `service-page-cta.spec.ts`, `web-development-responsive.spec.ts`,
      `web-development.spec.ts`, `brand-wordmark.spec.ts`, `no-top-links.spec.ts`, `card-no-hover.spec.ts`,
      `wide-card.spec.ts`, `link-style.spec.ts`, `card-grid.spec.ts`, `readable-output.spec.ts`,
      `left-edge.spec.ts`, `content-page-a11y.spec.ts`, `contact-escape.spec.ts`. Leave `/nope` and `/` alone.
- [X] T024 [US1] Run `grep -rnE '"/(fonts|images|logo)/|["(]/(web-development|web-hosting|technical-seo|agentic-systems|cost-reduction|lead-generation|growth-marketing|process-re-engineering|about-us|privacy-policy|security-policy|terms-of-service)["#/)]' src content tests` and fix any reference T006 to T023 missed. Expect no output except `tests/unit/redirects.test.ts` once T027 exists.

### New check (spec FR-005)

- [X] T025 [US1] In `tests/unit/build-output.test.ts`, add one test inside the existing `describe.skipIf(!fs.existsSync(OUT))("built site")` block:
      for every `out/**/*.html` and every file in the `built-site-css` group, assert the text contains none of
      `"/fonts/`, `"/images/`, `"/logo/`, `url("/fonts/`, `url("/images/`, `url("/logo/`, `andexor.net/fonts/`,
      `andexor.net/images/`, `andexor.net/logo/`, and, for each of the twelve moved pages in `tests/unit/moved-pages.ts`
      (the same list T027 uses), neither `href="/<page>"` nor `andexor.net/<page>` followed by `"` or `/`. Name the
      failing file and the matched text in the assertion message. Reference spec 093 FR-005 in a comment.

### Verify

- [X] T026 [US1] Run `bun run build && bun run test`, then `bun run test:e2e`. Everything passes. Open
      `http://localhost:3000/services/web-development` and `http://localhost:3000/company/about-us` and confirm the
      hero image, header logo, and brand fonts load (quickstart.md, step 4).

**Checkpoint**: the site is whole at its new addresses. Old addresses are 404 locally. This is the MVP.

---

## Phase 4: User Story 2 - Old addresses redirect permanently in production (Priority: P1)

**Goal**: a redirect file the production host reads, with one 301 per moved page and resource folder, and the two
section placeholders going to `/`.

**Independent Test**: the redirect-list unit test passes against `public/_redirects`; optionally `bun run preview`
answers an old address with 301 and the new `Location` (quickstart.md, step 5).

- [X] T027 [P] [US2] Write `tests/unit/redirects.test.ts`. It reads `public/_redirects`, ignores `#` lines and blank
      lines, and parses each rule as `source destination status`. The twelve moved page names from the address map
      in data-model.md (eight service pages, four company pages) live in a small exported constant in
      `tests/unit/moved-pages.ts`; the test does not derive them from the content folder, so a page added later under
      `/services/` or `/company/` needs no redirect and no test change. Assert: (a) for each of the twelve, exactly
      one rule has source `/<page>`, destination `/services/<page>` or `/company/<page>` as the map says, and status
      `301`; (b) each of `/fonts/*`, `/images/*`, `/logo/*` has exactly one rule with destination
      `/static/<folder>/:splat` and status `301`, and `public/static/<folder>` is a directory; (c) `/services` and
      `/company` each have one rule with destination `/` and status `302`; (d) every rule's destination is `/`, one of
      the three `/static/<folder>/:splat` values, or a page that `listContentSlugs()` publishes, so no rule points at
      an address that does not exist; (e) no destination starts with `/fonts/`, `/images/`, or `/logo/`, and no
      destination is one of the twelve old addresses; (f) every rule's source is one of those named in (a) to (c).
      Reference spec 093 FR-006 to FR-008. This test fails until T028 exists.
- [X] T028 [US2] Create `public/_redirects`: the Apache-2.0 license header as `#` comments (same three lines as
      `public/_headers`), a comment saying Workers Static Assets reads it from `out/` and does not serve it, then the
      17 rules in the order of the address map in data-model.md: twelve page rules with `301`, the three splat rules
      `/fonts/* /static/fonts/:splat 301`, `/images/* /static/images/:splat 301`, `/logo/* /static/logo/:splat 301`,
      and `/services / 302`, `/company / 302`. One rule per line, fields separated by spaces.
- [X] T029 [US2] Run `bun run test` (the redirect test passes) and `bun run build`, then confirm `out/_redirects`
      exists and matches `public/_redirects`.
- [X] T030 [US2] Optional hand check: `bun run preview`, then the four `curl -sI` lines in quickstart.md step 5.
      Expect 301 with the new address for a page and a logo, 302 to `/` for `/services`. Stop the preview after.

**Checkpoint**: production will answer every old address with a redirect once deployed. No local test depends on it.

---

## Phase 5: User Story 3 - Crawlers see only the new addresses (Priority: P2)

**Goal**: sitemap, security.txt, and the home page's structured data name only new addresses; root crawler files
still answer 200.

**Independent Test**: `grep` the three sources for old addresses and find none; `/favicon.ico`, `/robots.txt`, and
`/sitemap.xml` answer 200 locally (quickstart.md, steps 2 and 4).

- [X] T031 [P] [US3] Run `bun run sitemap` to regenerate `content/sitemap.xml` from the moved files. Confirm it lists
      `https://andexor.net/`, the eight `/services/...` and the four `/company/...` addresses, and nothing else, with
      a `lastmod` on every page entry.
- [X] T032 [P] [US3] In `public/.well-known/security.txt`, change the `Contact:` URL, `Policy:`, and
      `Acknowledgments:` lines to `https://andexor.net/company/security-policy`. Leave the mailto contact, `Expires`,
      `Preferred-Languages`, and `Canonical` as they are.
- [X] T033 [P] [US3] In `src/lib/schema/organization.json`, change `logo` to
      `https://andexor.net/static/logo/logo-gold.svg`. In `src/lib/schema/ed.json`, change `url` to
      `https://andexor.net/company/about-us` and the nested organization `logo` to
      `https://andexor.net/static/logo/logo-gold.svg`. The `@id` values stay.
- [X] T034 [US3] Run `bun run build && bun run test` (the existing structured-data test compares the built home page
      to the JSON files) and the greps in quickstart.md step 2. With `bun run server.ts` running, confirm
      `/favicon.ico`, `/robots.txt`, and `/sitemap.xml` answer 200.

**Checkpoint**: nothing a crawler reads names an old address.

---

## Phase 6: User Story 4 - Caching rules follow the resources (Priority: P2)

**Goal**: the three resource prefixes keep their lifetimes at the new addresses; no rule names an old prefix.

**Independent Test**: read `public/_headers` and confirm the three new patterns with the lifetimes in data-model.md
and no `/fonts/*`, `/images/*`, or `/logo/*` block. Optionally check a `Cache-Control` header in preview
(quickstart.md, step 5).

- [X] T035 [US4] In `public/_headers`, rename the pattern `/fonts/*` to `/static/fonts/*` (keep
      `public, max-age=31536000, immutable`), `/images/*` to `/static/images/*` and `/logo/*` to `/static/logo/*`
      (keep `public, max-age=2592000`). Leave every other block unchanged. Keep the comment about renaming a changed
      font file; it still names `src/styles/fonts.css` and `src/app/layout.tsx` correctly.
- [X] T036 [US4] Confirm with `grep -nE '^/(fonts|images|logo)/' public/_headers` (no output) and
      `grep -nE '^/static/' public/_headers` (three lines). After `bun run build`, `out/_headers` matches.

**Checkpoint**: returning visitors cache fonts, images, and logos as before.

---

## Phase 7: User Story 5 - The namespaces are reserved in writing (Priority: P3)

**Goal**: the constitution, the authoring guide, and the assistant guidance say where pages go, what stays at the
root, and that a moved address keeps a permanent redirect.

**Independent Test**: read the three documents (quickstart.md, step 7).

- [X] T037 [P] [US5] In `.specify/memory/constitution.md`, add a short "URL structure" paragraph at the end of
      Principle VIII (before its Rationale) holding the seven-row prefix table from data-model.md and the sentence:
      "A new page goes under an existing prefix, a new prefix needs a spec, and a moved URL keeps a permanent
      redirect." Bump the footer to `**Version**: 1.10.0` with `**Last Amended**: 2026-11-07`, and add a sync-impact
      entry at the top: 1.9.0 to 1.10.0, MINOR, Principle VIII gains the URL structure (issue #118, spec 093),
      templates checked and none affected.
- [X] T038 [P] [US5] In `content/README.md`: replace the Routes table rows with `content/services/web-development.md`
      to `/services/web-development`, `content/company/about-us.md` to `/company/about-us`, and
      `content/services/index.md` to `/services`; add that pages live in `content/services/` (service pages) or
      `content/company/` (About Us and the policies), nothing else sits at the root of `content/` except this README
      and the crawler files `robots.txt` and `sitemap.xml`, and a folder's `index.md` is that section's landing page
      (none exists yet; until one does, the section address redirects to the home page in production). Change the
      card-layout example `image:` to `/static/images/web-development.png`, "Images go in `public/`" to "Images go in
      `public/static/images/`" with the example `![Team](/static/images/team.jpg)`, and the link example to
      `[About Us](/company/about-us)`.
- [X] T039 [P] [US5] In `CLAUDE.md`, rewrite the "Markdown content pages" paragraph so the route example is
      `content/company/about-us.md` to `/company/about-us`, it says service pages live in `content/services/` and
      company pages in `content/company/` with nothing at the root of `content/` except the README and the crawler
      files, and that a moved address keeps a permanent redirect in `public/_redirects` (spec 093). Update the two
      incidental references elsewhere in the file: `/privacy-policy` in the Cookie Declaration paragraph becomes
      `/company/privacy-policy`, and `about-us.txt beside about-us.html` becomes `company/about-us.txt beside
      company/about-us.html`.

**Checkpoint**: the next page added lands under a prefix.

---

## Phase 8: Polish and cross-cutting

- [X] T040 Run `bun run format` and `bun run format:check`; run `bun run lint`.
- [X] T041 Run `bun run test` (the straight-quotes, no-top-links, and no-hover-underline tests cover every file
      written here) and `bun run test:e2e`. Report only failures that remain.
- [X] T042 Walk quickstart.md steps 1 to 4 end to end on a clean build and confirm each expected result. Steps 5 and
      6 are optional or for the owner after deploy.
- [X] T043 Set `**Status**` in `specs/093-move-pages-static-resources/spec.md` to `Implemented` and note the two
      decisions the plan made beyond the issue: 302 for the section placeholders and no trailing-slash rules.
- [X] T044 Stop any local server left running on port 3000. Leave the tree uncommitted for the owner's review; when
      the owner says to commit, use `git commit -s` with a subject ending `Closes #118.`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: none.
- **Phase 2 (moves)**: after Phase 1. Blocks everything else: links must point at files that exist.
- **Phases 3 to 7 (US1 to US5)**: each after Phase 2. They touch disjoint files and can run in any order or in
  parallel, with one exception noted below.
- **Phase 8 (Polish)**: after every story the owner wants in this change (all five are in issue #118).

### User Story Dependencies

- **US1** (pages and references): only Phase 2. The MVP.
- **US2** (redirects): only Phase 2. Its test reads content slugs, so it needs the moved files, not US1.
- **US3** (crawlers): only Phase 2. T034's build-output comparison works with or without US1.
- **US4** (caching): only Phase 2.
- **US5** (documents): nothing in code; can even be written first. The constitution text should match the final
  redirect statuses chosen in US2 (301 moved, 302 sections).

The one cross-story touch point: T025 (US1) and T027 (US2) both call `listContentSlugs()` from `src/lib/content.ts`,
which is unchanged. No file is edited by two stories.

### Parallel Opportunities

- Phase 2: T002, T003, T004 together.
- US1: T006 to T023 are all different files and can run together; T024 after them; T025 any time; T026 last.
- US2: T027 and T028 together (test first is fine; it fails until the file exists), then T029.
- US3: T031, T032, T033 together, then T034.
- US5: T037, T038, T039 together.
- Across stories: US2, US3, US4, US5 can all run while US1 is in progress.

## Parallel Example: User Story 1

```bash
# After Phase 2, in one pass:
Task: "Frontmatter images in content/services/*.md"            (T006)
Task: "Frontmatter images in content/company/*.md"             (T007)
Task: "Body links in the three service pages"                  (T008)
Task: "Body links in the three policy pages"                   (T009)
Task: "Footer.tsx, services-data.ts, ContactPopup.tsx, Logo.tsx, not-found.tsx, layout.tsx, fonts.css, cards.css"  (T010 to T017)
Task: "Unit and e2e test addresses"                            (T018 to T023)
# Then:
Task: "Grep for anything missed"                               (T024)
Task: "Built-output no-old-prefix check"                       (T025)
Task: "Build, unit, e2e"                                       (T026)
```

## Implementation Strategy

### MVP First (US1)

1. Phase 1, Phase 2.
2. Phase 3 (US1). Stop and validate: the site is whole at the new addresses, tests pass.

This alone is not deployable: deploying without US2 breaks every inbound link. US1 and US2 ship together.

### Incremental Delivery

1. US1 then US2: a deployable move with redirects.
2. US3 and US4: crawler hygiene and caching, both small, both before deploy.
3. US5: documents, any time before the commit.
4. Phase 8, then hand to the owner for review, commit, and deploy.

## Notes

- Every task names its file. [P] tasks touch different files and share no incomplete dependency.
- T024 is the safety net for the long list of address edits; run it before calling US1 done.
- The redirect test (T027) and the built-output check (T025) are the only new tests. Do not add tests for the
  headers file's lifetimes, the documents, or the sitemap's wording.
- Nothing here runs `wrangler deploy` or commits.
