# Tasks: Footer Text Size

**Input**: Design documents from `/specs/079-footer-text-size/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: None added (spec Assumptions: no test of pixel sizes, per the project's testing rules). The existing footer and no-sideways-scroll checks run as a regression check.

## Phase 1: Setup

No setup needed: no new dependency, directory, or configuration.

## Phase 2: Foundational

No blocking work.

## Phase 3: User Story 1 - The footer text is one size (Priority: P1)

**Goal**: The copyright line and the "Do Not Sell or Share My Personal Information" link are 16px, like the column links.

**Independent Test**: `bun run build`, serve `out/`, and compare the two lines with the column links on any page, then at 360px.

- [x] T001 [US1] In `src/styles/marketing.css`, change `font-size: 13px` to `font-size: 16px` in the `.an-footer__copyright` rule and in the `.an-footer__legal-link` rule. Change nothing else in either rule (margins, colors, hover, and `text-decoration: none` stay).

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T002 Run `bun run format`, then `bun run format:check` and `bun run test`; all must pass.
- [x] T003 Free port 3000, then run `bun run test:e2e -- tests/e2e/footer-links.spec.ts tests/e2e/cookie-declaration.spec.ts --project=chromium`; all must pass. Free port 3000 afterward.
- [x] T004 With `out/` served by `bun server.ts`, use a throwaway Playwright script in the scratchpad (not committed) to confirm the computed font size of the copyright line and the link is 16px, and that at 360px both lines are fully visible and the page has no horizontal overflow. Free port 3000 afterward.
- [x] T005 Grep `src/styles/marketing.css` for hover underlines and `grep` the changed files for typographic quotes; none may be found. Mark T001-T005 `[x]` and add a short Results section.

## Dependencies

T001 first. T002 to T004 follow it, and T005 comes last. There is one story, so the MVP is T001.

## Results

- `format:check` passes; vitest 154 passed; e2e (chromium) footer-links and cookie-declaration 49 passed.
- Computed font size of the copyright line, the Do Not Sell or Share link, and the column links is 16px at 360px and 1280px.
- At 360px the link wraps to two lines and stays inside the viewport; no horizontal overflow at either width.
- No hover underline in `src/styles/marketing.css`; no typographic quotes.
