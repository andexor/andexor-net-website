# Tasks: Link Color

**Input**: Design documents from `/specs/080-link-color/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: None added (spec FR-007: no tests for colors). The existing axe accessibility tests run as the check (FR-006), plus a throwaway axe script over the built pages.

## Phase 1: Setup

No setup needed: no new dependency, directory, or configuration.

## Phase 2: Foundational

- [x] T001 In `src/styles/tokens/colors.css`, add `--text-link-hover: var(--blue-200);` in the always-dark block, directly after `--text-link: var(--blue-300);`. Do not touch the light block's values or `design/tokens/`.

## Phase 3: User Story 1 - Links are easier to see (Priority: P1)

**Goal**: Links in content pages, cards, and the not-found page use `--blue-300` through `--text-link`, with the heavier weight that keeps them distinct from the text around them.

**Independent Test**: `bun run build`, then axe (WCAG 2.1 A and AA) finds no violations on `/`, `/privacy`, `/terms`, `/security`, `/cookies`, `/web-development`, `/about-us`, and `/nope`.

- [x] T002 [P] [US1] In `src/styles/content.css`: delete the `--text-link: var(--blue-400);` line in `.an-prose` and rewrite the comment above it (it explains the old `--blue-400` choice) to say links have no underline (spec 007), so they carry `font-weight: 600` as the cue that is not color, since `--blue-300` is only 2.02:1 from the body text (spec 080). In `.an-prose a` add `font-weight: 600;`. In `.an-prose a:hover` change `color: var(--blue-300)` to `color: var(--text-link-hover)`. Leave `:focus-visible` as it is.
- [x] T003 [P] [US1] In `src/styles/cards.css`: delete the `--text-link: var(--blue-400);` line in `.an-tile` and update the comment above it the same way. In `.an-tile a` add `font-weight: 600;` and in `.an-tile a:hover` use `var(--text-link-hover)`. For the not-found hero, `.an-cardhero--solo .an-cardhero__intro a`: change `color: var(--blue-400)` to `color: var(--text-link)`, add `font-weight: 600;`, and in its `:hover` rule use `var(--text-link-hover)`; update the comment above `.an-cardhero--solo` (it says "--blue-400 link").

## Phase 4: User Story 2 - All links share one color (Priority: P1)

**Goal**: The footer and the Contact Us popup links use `--text-link` and the shared hover token.

**Independent Test**: `grep -n "blue-400" src/styles/*.css` finds no link color, and a visual check of the footer and the popup shows the same blue as the content pages.

- [x] T004 [US2] In `src/styles/marketing.css`, footer: `.an-footer__copyright` color `var(--blue-400)` becomes `var(--text-link)`. `.an-footer__col-link` and `.an-footer__legal-link` colors (`var(--blue-200)`) become `var(--text-link)`, and their `:hover` colors (`#ffffff`) become `var(--text-link-hover)`. Do not change `.an-footer__social-link` (icon links are out of scope) or add weight to footer links.
- [x] T005 [US2] In `src/styles/marketing.css`, popup: in `.an-contact-form__legal a` change `color: #ffffff` to `color: var(--text-link)` (keep `font-weight: 600` and `text-decoration: none`), and in its `:hover` change `var(--blue-200)` to `var(--text-link-hover)`. In `.an-contact-form__legal .svg-inline--fa` change `color: #ffffff` to `color: var(--text-link)` and update the comment above it if it says the icon is drawn in white.

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T006 Update the notes that describe the old colors: in `CLAUDE.md` ("No underline on links": links are `--blue-400`, hover `--blue-300`) say that links are `--blue-300` through `--text-link` with `font-weight: 600` as the second cue, hover `--blue-200`; and add a short spec 080 note there. Grep `.specify/memory/constitution.md`, `content/README.md`, `design/README.md`, and `design/DESIGN.md` for the same statement and correct it where found (do not ask the owner again about design-document underline text). Update the older specs only where they now state something false about the site's link color; do not rewrite history.
- [x] T007 Run `bun run format`, then `bun run format:check` and `bun run test`; all must pass. Grep the changed files for typographic quotes and `text-decoration: underline`; none may be found.
- [x] T008 Free port 3000, then run `bun run test:e2e -- tests/e2e/homepage-a11y.spec.ts tests/e2e/content-page-a11y.spec.ts tests/e2e/contact-popup-a11y.spec.ts tests/e2e/footer-links.spec.ts --project=chromium`; all must pass. Free port 3000 afterward.
- [x] T009 With `out/` served by `bun server.ts`, run a throwaway axe script (scratchpad, new browser context, WCAG 2.1 A and AA) on the eight pages in quickstart.md plus the Contact Us popup opened; no violations. Also confirm in the script that a content-page link, a footer column link, and a popup link all compute to `rgb(143, 182, 226)` and that a hovered link of each kind computes to `rgb(197, 216, 239)`. Free port 3000 afterward.
- [x] T010 Mark T001-T010 `[x]` and add a short Results section.

## Dependencies

T001 first (the other tasks use the token). T002 and T003 are in different files and can run together. T004 and T005 edit the same file, so they run in order. T006 to T010 follow, in order.

## Parallel example

T002 and T003 together after T001.

## Implementation strategy

MVP is T001 to T003 (content pages, cards, and the not-found page, where the accessibility risk is). T004 and T005 then bring the footer and the popup in line.

## Results

- `--text-link-hover: var(--blue-200)` added; the `--blue-400` overrides and the not-found `--blue-400` are gone. `--blue-400` remains only as a button border (`components.css`) and the social icon's pressed color, neither a text link.
- `format:check` passes; vitest 154 passed; e2e (chromium) homepage, content-page, and contact-popup accessibility plus footer-links: 45 passed.
- Throwaway axe (WCAG 2.1 A and AA) on `/`, `/privacy`, `/terms`, `/security`, `/cookies`, `/web-development`, `/about-us`, `/nope`, and the open Contact Us popup: no violations.
- Computed colors: prose/tile link, popup link, footer column link, Do Not Sell link, and copyright all `rgb(143, 182, 226)` (`--blue-300`); hovered prose and footer links `rgb(197, 216, 239)` (`--blue-200`). Links in running text and the popup are weight 600; footer links are 400.
- `CLAUDE.md` "No underline on links" rewritten for the new treatment. No hover underline and no typographic quotes found.
