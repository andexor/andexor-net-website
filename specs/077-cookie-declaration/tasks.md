# Tasks: Cookie Declaration

**Input**: Design documents from `/specs/077-cookie-declaration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/footer-element.md, quickstart.md

**Tests**: One behavior test for the element's position and attributes, and for no sideways scroll (spec FR-007). No test of the declaration's text. No count checks.

## Phase 1: Setup

No setup needed: no new dependency, directory, or configuration.

## Phase 2: Foundational

No blocking work. Both user stories rest on the same change.

## Phase 3: User Story 1 - Visitors can see which cookies the site uses (Priority: P1)

**Goal**: Every page with the footer has the Cookie Declaration script element right after the copyright line.

**Independent Test**: `bun run build`, then `grep -L 'id="CookieDeclaration"' out/index.html out/web-development.html` prints nothing, and the element sits between the copyright paragraph and the social row.

- [x] T001 [US1] In `src/components/marketing/Footer.tsx`, add a constant `COOKIE_DECLARATION_SCRIPT` holding exactly `<script id="CookieDeclaration" src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js" type="text/javascript" async></script>`, with a short comment citing spec 077 and why it is rendered from a string (React leaves the container's content alone, so what Cookiebot adds beside the element cannot break hydration).
- [x] T002 [US1] In `src/components/marketing/Footer.tsx`, render `<div data-raw-html="" dangerouslySetInnerHTML={{ __html: COOKIE_DECLARATION_SCRIPT }} />` directly after the `an-footer__copyright` paragraph and before the `an-footer__social-row` div. Do not change the footer's other markup or order, and do not put a newline in React-rendered text.
- [x] T003 [US1] Run `bun run format` and `bun run build`; confirm the build passes (formatter, DOM gate, data-script check) and that `out/index.html` and a content page show the container between the copyright paragraph and the social row.
- [x] T004 [US1] Create `tests/e2e/cookie-declaration.spec.ts` (SPDX header, 4-space Prettier format, `import { expect, test } from "./fixtures"`, no type annotations in callbacks): for `/` and every content route listed from `content/*.md` (excluding `README.md`, as in `tests/e2e/cookiebot.spec.ts`), fetch the raw HTML with `request.get` and expect the copyright paragraph to be followed, ignoring whitespace, by a container that holds one script element with `id="CookieDeclaration"`, the `src` from the contract, `type="text/javascript"`, and `async`, and expect the social row to come after it. Do not check the declaration's text.

**Checkpoint**: Pages carry the element after the copyright line; `bun run test:e2e -- cookie-declaration` passes (port 3000 free).

## Phase 4: User Story 2 - The page still works (Priority: P1)

**Goal**: Hydration, layout, and the footer keep working with the declaration present.

**Independent Test**: Quickstart step 4: ten fresh loads of `https://andexor.net/` routed to the local build, each with the `h1` shown and no page errors, at 360, 768, and 1280 pixel widths with no sideways scroll.

- [x] T005 [US2] In `tests/e2e/cookie-declaration.spec.ts`, add a test that loads `/` and a content page at a 360 pixel wide viewport and expects `document.documentElement.scrollWidth` not to exceed the viewport width, and that the footer's links and social icons are still visible.
- [x] T006 [US2] Run the real-Cookiebot check from `specs/077-cookie-declaration/quickstart.md` step 4 with a throwaway script in the scratchpad directory (not in the repo): serve `out/` with `bun run server.ts`, route `https://andexor.net/**` to `http://localhost:3000` in a Playwright context, load `/` ten times in fresh contexts, and report `h1` shown, page errors, and horizontal overflow at 360, 768, and 1280 pixels. Also click the banner's "Allow all" once and confirm the page stays up.
- [x] T007 [US2] If T006 shows the declaration overflowing or crowding the footer, add the smallest rule to `src/styles/marketing.css` to contain it (for example `max-width: 100%` and `overflow-x: auto` on the container), with the license header already in the file; otherwise make no CSS change. Re-run T006 after any change. No underline on hover, no `prefers-color-scheme` switching.

**Checkpoint**: 10 of 10 loads hydrate; no sideways scroll at the three widths.

## Phase 5: Polish

- [x] T008 Run `bun run format:check` and the straight-quotes unit test (`bun run test`); grep the changed files for typographic quotes and for `underline` in any CSS touched.
- [x] T009 Run `bun run test:e2e --project=chromium --project=android` to confirm hydration, accessibility, and footer tests still pass; then check that port 3000 is free and stop any leftover `server.ts`.
- [x] T010 Add one line to the Formatting section of `CLAUDE.md` or the footer note near it saying the footer's Cookie Declaration container is rendered with `data-raw-html` on purpose (spec 077), so it is not "fixed" into plain JSX later.

## Dependencies

T001 -> T002 -> T003 -> T004 -> T005 -> T006 -> T007 -> T008 -> T009. T010 can run any time after T002.

## Parallel Opportunities

T004 (new test file) can be written while T001 and T002 are done, but it is checked only after T003. T010 touches only `CLAUDE.md`.

## Implementation Strategy

MVP is Phase 3 (User Story 1). User Story 2 is verified against the same change; its CSS task (T007) happens only if the real-Cookiebot check shows a layout problem. Deploying is not part of these tasks. The live-site check in quickstart step 5 happens after you deploy.

## Results

- T006 (real Cookiebot, home and Web Development pages served as andexor.net): 10 of 10 loads hydrated with no page
  errors; no sideways scroll at 360, 768, and 1280 pixels; after "Allow all" the page stayed up.
- T007: no CSS change. The declaration currently shows Cookiebot's short "Under construction" text because the site has
  not been scanned yet. Re-check the layout once the cookie table appears.
