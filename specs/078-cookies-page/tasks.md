# Tasks: Cookies Page

**Input**: Design documents from `/specs/078-cookies-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/cookies-page.md, quickstart.md

**Tests**: Behavior tests only (spec FR-010): the script element's presence and attributes, where it is and is not, the footer link's target, and no sideways scroll on a phone. No test of the declaration's text or the page's copy. No count checks.

## Phase 1: Setup

No setup needed: no new dependency, directory, or configuration.

## Phase 2: Foundational

No blocking work. The marker plugin is part of User Story 1.

## Phase 3: User Story 1 - Visitors read the cookie declaration on its own page (Priority: P1)

**Goal**: `content/cookies.md` is published at `/cookies`, and its marker line becomes the Cookie Declaration script element.

**Independent Test**: `bun run build`, then `out/cookies.html` contains one `id="CookieDeclaration"` element, and no other page does.

- [x] T001 [US1] In `src/lib/content.ts`, add a remark plugin `remarkCookieDeclaration`, placed in `markdownProcessor()` right after `remarkTableCellLineBreaks`. It walks the tree; an `html` node whose trimmed value is exactly `<!-- cookie-declaration -->` is replaced (the first one only) by a node with `data: { hName: "script", hProperties: { id: "CookieDeclaration", src: "https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js", type: "text/javascript", async: true } }`. Any later marker node is removed, and `console.warn` says so (the warning names no page; `getContentPage` already prefixes errors with the file, so catch and rethrow is not needed). Every other `html` node stays as it is, so the pipeline still drops raw HTML. Add a comment citing spec 078 and that the element is built from the tree on purpose (FR-003). Match the file's comment style.
- [x] T002 [P] [US1] Create `tests/unit/cookie-declaration-marker.test.ts` (SPDX header, vitest, 4-space format): `renderMarkdown` turns the marker into one script element with `id="CookieDeclaration"`, the contract's `src`, `type="text/javascript"`, and `async`; a second marker produces no second element; a different HTML comment and a raw `<script>` in Markdown are still dropped; the real `content/cookies.md`, rendered with `getContentPage(["cookies"])`, contains the element (this catches a missing marker). No check of the page's wording.
- [x] T003 [US1] Create `content/cookies.md` with front matter `title: Cookies`, `description: Cookies`, a `# Cookies` heading, one short intro sentence saying which cookies the site uses and that the visitor can change their consent here, and the marker line `<!-- cookie-declaration -->` on its own line. Card layout like `privacy.md` (`layout: cards`, `section: company`, `eyebrow: Company`, no image), with one `## Cookie Declaration` card holding the marker. Straight quotes only; spell out any acronym on first use.
- [x] T004 [US1] Run `bun run format` and `bun run sitemap`; confirm `content/sitemap.xml` now lists `https://andexor.net/cookies` (FR-009).
- [x] T005 [US1] Document the marker in `content/README.md`: a short section saying `<!-- cookie-declaration -->` on its own line inserts the Cookie Declaration, once per page, and is used in `cookies.md`.

**Checkpoint**: `bun run test` passes; after `bun run build`, `grep -c 'id="CookieDeclaration"' out/cookies.html` prints 1.

## Phase 4: User Story 2 - Visitors find the page from the footer (Priority: P1)

**Goal**: A "Cookies" link in the Company column opens `/cookies`.

**Independent Test**: Open any page, click "Cookies" in the footer, and land on `/cookies`.

- [x] T006 [US2] In `src/components/marketing/Footer.tsx`, add `"Cookies"` after `"Security"` in the COMPANY `items`, and `Cookies: "/cookies"` after `Security` in `ITEM_HREFS`. No other markup or CSS change; update the comment above `Footer` to mention spec 078.
- [x] T007 [P] [US2] In `tests/e2e/footer-links.spec.ts`, add `["Cookies", "/cookies", "Cookies"]` to `LEGAL` and update the spec comment to say Cookies (spec 078). The existing loop checks the link, the URL, and the heading from each start page.

**Checkpoint**: `bun run test:e2e -- footer-links` passes (port 3000 free).

## Phase 5: User Story 3 - The footer no longer carries the declaration (Priority: P1)

**Goal**: The footer is as it was before spec 077, and only `/cookies` has the declaration.

**Independent Test**: `grep -L 'id="CookieDeclaration"' out/index.html out/web-development.html` lists both files.

- [x] T008 [US3] In `src/components/marketing/Footer.tsx`, delete the `COOKIE_DECLARATION_SCRIPT` constant with its comment, and the `<div data-raw-html="" dangerouslySetInnerHTML=... />` container after the copyright paragraph. Leave the copyright paragraph and social row as they were.
- [x] T009 [US3] Rewrite `tests/e2e/cookie-declaration.spec.ts` (keep the SPDX header and `import { expect, test } from "./fixtures"`, no type annotations in callbacks): fetch the raw HTML of `/cookies` and expect exactly one script element with `id="CookieDeclaration"`, the contract's `src`, `type="text/javascript"`, and `async`; for `/` and every other content route (from `content/*.md`, excluding `README.md` and `cookies.md`) expect no element with that id. Do not check the declaration's text.
- [x] T010 [US3] Update `CLAUDE.md`: replace the bullet about the footer's Cookie Declaration (spec 077) with one saying the marker `<!-- cookie-declaration -->` in `content/cookies.md` is turned into the script by `src/lib/content.ts` (spec 078), rendered inside the page body's `data-raw-html` container on purpose so React does not hydrate what Cookiebot adds, and that raw HTML in Markdown is still dropped. Re-read the file before editing.

**Checkpoint**: `bun run test:e2e -- cookie-declaration` passes.

## Phase 6: User Story 4 - The page still works (Priority: P1)

**Goal**: `/cookies` hydrates, lays out, and responds with the real Cookiebot.

**Independent Test**: Quickstart step "Check with the real Cookiebot": ten fresh loads of `/cookies` hydrate with no page errors, and no sideways scroll at 360, 768, and 1280 pixels.

- [x] T011 [US4] In `tests/e2e/cookie-declaration.spec.ts`, add a test that loads `/cookies` at a 360 pixel wide viewport and expects `document.documentElement.scrollWidth` not to exceed the viewport width, and the footer's links to be visible.
- [x] T012 [US4] Run the real-Cookiebot check from `quickstart.md` with a throwaway script in the scratchpad directory (not in the repo): serve `out/` with `bun server.ts`, route `https://andexor.net/**` to `http://localhost:3000` in a Playwright context, load `/cookies` ten times in fresh contexts, and report `h1` shown, page errors, the declaration's presence at the marker, and horizontal overflow at 360, 768, and 1280 pixels. Also click the banner's "Allow all" once and confirm the page stays up. Use `https://andexor.net/cookies`, which the harness routes to the local build.
- [x] T013 [US4] If T012 shows the declaration overflowing, add the smallest rule to `src/styles/content.css` to contain it (for example `max-width: 100%` and `overflow-x: auto` on the content body's Cookiebot table), otherwise make no CSS change. Re-run T012 after any change. No underline on hover, no `prefers-color-scheme` switching.

**Checkpoint**: 10 of 10 loads hydrate; no sideways scroll at the three widths.

## Phase 7: Polish

- [ ] T014 Run `bun run format:check`, `bun run test`, and the Chromium and Android e2e projects (`bunx playwright test --project=chromium --project=android`; port 3000 free first and after). Search the changed files for typographic quotes. Mark spec 077's footer placement as replaced by spec 078 with a one-line note at the top of `specs/077-cookie-declaration/spec.md`. Append a Results section to this file.

## Dependencies

- US1 (T001-T005) first. US2 (T006-T007) and US3 (T008-T010) edit the same file (`Footer.tsx`) so do T006 before T008. T009 needs T003 and T008. US4 needs a build with all of the above.
- T002 and T007 can run alongside other tasks (different files).

## Implementation strategy

MVP is US1: the page with the marker. Then the footer link and cleanup, then the real-Cookiebot check, then the full test run.

## Results

- Unit tests 154 passed; `format:check` passes; e2e on Chromium and Android: 615 passed, 1 skipped, 0 failed. Firefox, WebKit, iPhone, and iPad were not run.
- Built `/cookies` has one `CookieDeclaration` element; no other page has it, and the footer has none.
- Real Cookiebot (build served as andexor.net): `/cookies` hydrated on 10 of 10 loads with no page errors; no sideways scroll at 360, 768, and 1280 pixels; Allow all left the page up; the real declaration text appeared at the marker. Cookiebot's own tables scroll inside themselves, so T013 needed no CSS.
- The plain layout failed the build's indentation test, so `cookies.md` uses the card layout like Privacy and Terms (spec, plan, and research updated). `/cookies` was added to the approved links in `tests/unit/content-links.test.tsx`.
