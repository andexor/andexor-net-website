# Tasks: Privacy Policy Consolidation

**Input**: Design documents from `/specs/081-privacy-policy-consolidation/`

**Prerequisites**: plan.md, spec.md

**Tests**: behavior tests only (spec FR-009), in the existing files plus new cases in `footer-links.spec.ts`.

## Phase 1: Setup

No setup needed: no new dependency or configuration.

## Phase 2: Foundational

- [x] T001 `git mv content/privacy.md content/privacy-policy.md`, `git mv content/terms.md content/terms-of-service.md`,
  `git mv content/security.md content/security-policy.md`. In the three files, change `](/privacy)`, `](/terms)`, and
  `](/security)` to the new routes. Update `content/sitemap.xml` (new addresses, drop `/cookies`, bump the Privacy
  Policy's `lastmod`) and `public/.well-known/security.txt`.

## Phase 3: User Story 1 - One Privacy Policy covers cookies too (Priority: P1)

- [x] T002 [US1] In `content/privacy-policy.md`: replace the three "Cookie Policy" references (Sections 1 and 5) with
  references to Sections 20 to 25 and in-page links to `#25-cookie-declaration`; mention Privacy Settings in Sections 5
  and 11; add the cookie-questions sentence to Section 19; set Last Updated and Effective Date to October 26, 2026.
- [x] T003 [US1] Append Sections 20 to 25 from `content/cookies.md` (Scope, What Cookies Are, Four Categories, Who Sets
  Cookies, Your Choices, Cookie Declaration with the marker last), with the cookie page's links to the Privacy Policy and
  its own title, intro, Document History, Changes, and Contact sections removed.
- [x] T004 [US1] `git rm content/cookies.md`. Update `content/README.md` and `CLAUDE.md` so they say the marker is in
  `privacy-policy.md`.

## Phase 4: User Story 2 - Policy pages are named by their titles (Priority: P1)

- [x] T005 [US2] In `src/components/marketing/Footer.tsx`: Company items become About Us, Terms Of Service, Security
  Policy, Privacy Policy, Privacy Settings; `ITEM_HREFS` gets the new routes; the Do Not Sell or Share href becomes
  `/privacy-policy#25-cookie-declaration`; update the comment.
- [x] T006 [P] [US2] In `src/components/contact/ContactPopup.tsx`, change the two hrefs to `/privacy-policy` and
  `/terms-of-service`; labels stay Privacy and Terms.

## Phase 5: User Story 3 - Privacy Settings reopens the cookie banner (Priority: P1)

- [x] T007a [US2] In `src/styles/marketing.css`, add a `@media (max-width: 860px)` rule that makes `.an-footer__grid`
  two columns, above the existing 720px one-column rule, so the longer Company labels fit at tablet widths (plan.md,
  "Footer width at tablet sizes").
- [x] T007 [US3] Add `src/components/marketing/PrivacySettingsLink.tsx` (`"use client"`): an `<a href="#">` with the
  footer link class whose click prevents the default and calls `window.Cookiebot?.renew()`; declare `Window.Cookiebot`.
  Render it for the Privacy Settings item in the footer.

## Phase 6: Tests and Polish

- [x] T008 Update `tests/unit/content-links.test.tsx` (approved footer pages), `tests/e2e/cookie-declaration.spec.ts`
  (`/privacy-policy`, exclude `privacy-policy.md`, footer link "Privacy Policy"), and
  `tests/e2e/contact-popup-links.spec.ts` (routes).
- [x] T009 Rewrite `tests/e2e/footer-links.spec.ts`: the policy pages join `PAGES` (heading equals label); add the
  Company column order, Privacy Settings by click and by Enter (a fake `window.Cookiebot` counts `renew()` calls, URL and
  scroll position unchanged), and the Do Not Sell or Share fragment naming the Cookie Declaration heading.
- [x] T010 `bun run format`, `bun run format:check`, `bun run build`, `bun run test`; grep the changed files for
  typographic quotes and `/cookies`.
- [x] T011 Free port 3000, then run the e2e suites for the footer, popup links, Cookie Declaration, no-top links, and
  accessibility (chromium). Free port 3000 afterward.

## Dependencies

T001 before T002 to T004 (the file names). T005 to T007 are independent of the content. T008 and T009 after T005 to
T007. T010 and T011 last.

## Results

- Built pages: `/privacy-policy`, `/terms-of-service`, `/security-policy`; no `/privacy`, `/terms`, `/security`, or
  `/cookies` in `out/`. The Cookie Declaration script is once on `/privacy-policy`, after the `25. Cookie Declaration`
  heading (`id="25-cookie-declaration"`), and on no other page. The Privacy Policy has four in-page links to it.
- `format:check` passes; vitest 154 passed; the Chromium e2e run of footer-links, contact-popup-links,
  contact-legal-new-tab, cookie-declaration, no-top-links, responsive, not-found-style, link-style, keyboard-navigation,
  and the three accessibility suites: all pass. Two tests in `link-style.spec.ts` and `not-found-style.spec.ts` had
  been failing since spec 080 because they asserted the not-found link's exact colors (blue-400); at the owner's
  request their color assertions were removed, leaving the hover-change and focus-ring checks.
- A measurement script at 360, 721, 768, 860, 861, 900, and 1024px wide found no horizontal overflow after the footer
  grid change.
- No typographic quotes in the changed files; no `/cookies`, `cookies.md`, or "Cookie Policy" left in `src/`, `tests/`,
  `content/`, `public/`, or `CLAUDE.md`.
