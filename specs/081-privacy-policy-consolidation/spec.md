# Feature Specification: Privacy Policy Consolidation

**Feature Branch**: `89-update-privacy-content-and-links`

**Created**: 2026-10-26

**Status**: Draft. The owner answered four questions on 2026-10-26; see Decisions.

**Input**: User description: "Rename Company files using git mv (privacy.md -> privacy-policy.md, terms.md ->
terms-of-service.md, security.md -> security-policy.md). Update the link text in the Company column of the footer
(Privacy -> Privacy Policy, Terms -> Terms Of Service, Security -> Security Policy). Move the contents of cookies.md into
privacy.md, after section 19, and update all links in privacy.md that point to cookies.md so they now point to sections
within privacy.md. Move the special handling logic for the cookie-declaration marker from cookies.md to privacy.md,
keeping it as the last section of the page. Remove references to the Cookie Policy since now it is embedded in the
Privacy Policy. The Do Not Sell or Share My Personal Information link should point to the Privacy Policy now. Add a new
link to the Company section in the footer, Privacy Settings, that opens the Cookiebot dialog like
`<a onclick="window.Cookiebot.renew()" href="#">`. When you're done with that, we can remove cookies.md. Re-order the
links in the Company section: About Us, Terms Of Service, Security Policy, Privacy Policy, Privacy Settings."

Follows spec 078 (the Cookies page), spec 076 (Cookiebot), spec 062 (the Privacy and Terms footer links), and spec 002
(Markdown content pages). It folds the Cookies page into the Privacy Policy, so there is one policy page for personal
information and cookies, names the three policy pages by their full titles in their routes and in the footer, and gives
visitors a footer link that reopens the cookie banner from any page.

## What the code does today

- `content/privacy.md`, `content/terms.md`, and `content/security.md` serve `/privacy`, `/terms`, and `/security`. The
  footer's Company column reads About Us, Privacy, Terms, Security.
- `content/cookies.md` serves `/cookies`, the Cookie Policy, with the `<!-- cookie-declaration -->` marker as its last
  section. The footer's Do Not Sell or Share My Personal Information link opens it. The Privacy Policy links to it three
  times as "our Cookie Policy".
- The only way to change a consent choice is the control inside the Cookie Declaration. Cookiebot's `renew()` method,
  which reopens the banner, is not used.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One Privacy Policy covers cookies too (Priority: P1)

A visitor opens the Privacy Policy and finds, after its contact section, the cookie sections that used to be the Cookie
Policy, ending with the Cookie Declaration and its consent controls.

**Independent Test**: Run `bun run build`, serve `out/`, open `/privacy-policy`, and read Sections 20 to 25.

**Acceptance Scenarios**:

1. **Given** `/privacy-policy`, **When** it is read past Section 19, **Then** Sections 20 to 24 explain cookie scope,
   what cookies are, the four categories, who sets them, and the visitor's choices, and Section 25 is the Cookie
   Declaration, last on the page.
2. **Given** the built page, **When** its HTML is read, **Then** the Cookie Declaration script element (spec 078) is
   there once, at the marker, and no other page has it.
3. **Given** the Privacy Policy's text, **When** it is searched, **Then** nothing refers to a separate Cookie Policy or
   to `/cookies`; the places that did now point at the sections in the same page.
4. **Given** `/cookies`, **When** it is opened, **Then** the site's not-found page is shown (no redirect; see Decisions).

---

### User Story 2 - Policy pages are named by their titles (Priority: P1)

A visitor sees Terms Of Service, Security Policy, and Privacy Policy in the footer, and the addresses match.

**Independent Test**: Open any page and follow the three links from the footer's Company column.

**Acceptance Scenarios**:

1. **Given** the footer, **When** the Company column is read, **Then** its links are, in order: About Us, Terms Of
   Service, Security Policy, Privacy Policy, Privacy Settings.
2. **Given** the three policy links, **When** each is followed, **Then** it opens `/terms-of-service`,
   `/security-policy`, or `/privacy-policy`, whose page heading is the link text.
3. **Given** the Contact Us popup, **When** its note line is read, **Then** the links still say Privacy and Terms and
   open the renamed pages in a new tab (spec 065).
4. **Given** the other policy pages, `sitemap.xml`, and `security.txt`, **When** they are read, **Then** every link to a
   policy page uses its new address, and the sitemap has no `/cookies` entry.

---

### User Story 3 - Privacy Settings reopens the cookie banner (Priority: P1)

A visitor who wants to change a consent choice clicks Privacy Settings in the footer and the cookie banner opens again,
on whatever page they are on, without the page moving.

**Independent Test**: On the live site, click Privacy Settings in the footer; Cookiebot's banner opens.

**Acceptance Scenarios**:

1. **Given** any page, **When** Privacy Settings is clicked, **Then** Cookiebot's `renew()` is called once and the page
   neither navigates nor scrolls to the top.
2. **Given** keyboard focus on Privacy Settings, **When** Enter is pressed, **Then** the same happens.
3. **Given** a browser that blocked Cookiebot, **When** Privacy Settings is clicked, **Then** nothing happens and
   nothing breaks.

---

### User Story 4 - Do Not Sell or Share lands on the consent controls (Priority: P2)

A visitor who clicks Do Not Sell or Share My Personal Information under the copyright line is taken to the Cookie
Declaration section of the Privacy Policy, where the consent controls are.

**Acceptance Scenarios**:

1. **Given** the footer's Do Not Sell or Share link, **When** it is followed, **Then** the browser opens
   `/privacy-policy` with a fragment that names the Cookie Declaration heading, and the heading exists on the page.

## Decisions

The owner answered on 2026-10-26:

- **Structure**: flat sections. The cookie page's own title, intro, and Document History are dropped. Scope, What
  Cookies Are, The Four Categories, Who Sets Cookies, and Your Choices become Sections 20 to 24 ("Cookie Scope", "What
  Cookies Are", "The Four Cookie Categories", "Who Sets Cookies", "Your Cookie Choices"). The cookie page's Changes and
  Contact sections are folded into Sections 18 and 19: Section 18 already says what the cookie Changes section said, and
  Section 19 gains one sentence about cookie questions. The Cookie Declaration is Section 25, last.
- **Do Not Sell or Share**: `/privacy-policy#25-cookie-declaration`, the Cookie Declaration heading's id, so an opt-out
  is one click away. The id comes from `rehype-slug` and changes if the section is renumbered, so the footer test checks
  that the fragment still names a heading on the page.
- **Contact Us popup**: its links keep the short labels Privacy and Terms; only their addresses change.
- **Redirects**: none. The old addresses `/privacy`, `/terms`, `/security`, and `/cookies` return the not-found page.
  Links elsewhere (ad accounts, Cookiebot's settings) are the owner's to update.

Not asked, decided here: the new link's text is "Privacy Settings", title case like the other Company links (Cookiebot's
sample reads "Privacy settings"). The Privacy Policy's Last Updated and Effective Date become October 26, 2026, since the
merged text is a revision under Section 18; Last Reviewed is left to the owner. `public/images/cookies.png` is left in
place.

## Requirements *(mandatory)*

- **FR-001**: The three policy files MUST be renamed with `git mv`, so history follows them:
  `privacy.md -> privacy-policy.md`, `terms.md -> terms-of-service.md`, `security.md -> security-policy.md`. Every link
  to the old routes in `content/`, `src/`, `public/`, and the tests MUST use the new ones.
- **FR-002**: The footer's Company column MUST read, in order: About Us, Terms Of Service, Security Policy, Privacy
  Policy, Privacy Settings. The three policy links open the renamed pages.
- **FR-003**: The body of `content/cookies.md` MUST be moved into `content/privacy-policy.md` after Section 19 as
  Sections 20 to 25 per Decisions, with the `<!-- cookie-declaration -->` marker as the last section of the page. The
  Privacy Policy's links to `/cookies` MUST become references to those sections (in-page links to
  `#25-cookie-declaration` where a link is useful), and the words "Cookie Policy" MUST not appear in it.
- **FR-004**: `content/cookies.md` MUST be removed, and its sitemap entry with it. The sitemap and `security.txt` MUST
  list the new addresses.
- **FR-005**: The footer's Do Not Sell or Share My Personal Information link MUST open
  `/privacy-policy#25-cookie-declaration`.
- **FR-006**: The Privacy Settings link MUST be an `<a href="#">` that calls `window.Cookiebot.renew()` on click. Because
  the site's pages are React, the click is handled by a client component that prevents the default, so the page does
  not scroll to the top; the link is a no-op when `window.Cookiebot` is absent. It MUST look like the other Company
  links (`.an-footer__col-link`) and MUST not link to `#top` (constitution Principle IV).
- **FR-007**: The Privacy Policy's Document History MUST show the revision date.
- **FR-008**: `CLAUDE.md`, `content/README.md`, and the tests that name the old routes MUST be updated. The older specs
  (062, 078) are history and are not rewritten.
- **FR-009**: Tests cover behavior only: the footer links open their pages, the Company column order, Privacy Settings
  calls `renew()` by click and by keyboard without moving the page, the Do Not Sell or Share fragment names a heading,
  and the Cookie Declaration is on `/privacy-policy` only. No test checks the policy's wording.

## Success Criteria *(mandatory)*

- **SC-001**: `/privacy-policy`, `/terms-of-service`, and `/security-policy` build and are linked from the footer; the
  old routes and `/cookies` are gone from the build.
- **SC-002**: The Cookie Declaration appears once, as the last section of the Privacy Policy, and on no other page.
- **SC-003**: Privacy Settings reopens the banner on the live site, from every page.
- **SC-004**: `bun run format:check`, `bun run test`, and the e2e tests for the footer, the popup links, the Cookie
  Declaration, no-top links, and accessibility pass.

## Assumptions

- Cookiebot's `renew()` is the documented way to reopen the banner, and it is available on `window.Cookiebot` once
  `uc.js` (spec 076) has loaded. The tests stub Cookiebot (fixtures.ts), so they install a fake that counts calls.
- "Section 25" is the heading's number today. If a section is added before it, the footer's fragment and the in-page
  links in Sections 5, 23, and 24 change with it; the footer test catches a stale fragment.
