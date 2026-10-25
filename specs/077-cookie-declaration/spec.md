# Feature Specification: Cookie Declaration

**Feature Branch**: `87-implement-cookiebot`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "Add this to the footer, just below the copyright line.
<script id="CookieDeclaration" src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js"
type="text/javascript" async></script>"

Follows spec 076 (Cookiebot, which collects consent) and spec 001 (the footer, with its copyright line under the logo).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitors can see which cookies the site uses (Priority: P1)

A visitor scrolls to the footer of any page that has one and sees the cookie declaration, Cookiebot's list of the cookies
and similar technologies the site uses, directly below the copyright line.

**Why this priority**: A cookie declaration is part of telling visitors what is stored and why, next to the consent
banner from spec 076.

**Independent Test**: Run `bun run build`, serve `out/`, open the home page and a content page, and scroll to the footer.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** the footer is read in the built page, **Then** the Cookie Declaration
   script element is the next element after the copyright line, before the social links.
2. **Given** the script element, **When** its attributes are read, **Then** they are `id="CookieDeclaration"`,
   `src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js"`, `type="text/javascript"`, and
   `async`.
3. **Given** a visitor on a page, **When** Cookiebot's declaration loads, **Then** it appears below the copyright line
   and the rest of the footer is still readable and usable.

---

### User Story 2 - The page still works (Priority: P1)

Adding the declaration does not stop any page from loading, hydrating, or responding.

**Why this priority**: The consent script itself once stopped pages from working (spec 076, Changes after launch). This
is a second Cookiebot script placed inside the page's body, so the same risk applies.

**Independent Test**: Load each page type many times, with and without a saved consent choice, and use the Contact Us
button and a service card link on each.

**Acceptance Scenarios**:

1. **Given** any page, **When** it loads, **Then** it shows its content and the Contact Us button and links work, on
   every load.
2. **Given** a visitor who has no saved consent choice, **When** they close the banner with any button, **Then** the
   page stays up with no reload.
3. **Given** the declaration fails to load, **When** the page loads, **Then** the footer shows no gap or error and
   everything else works.

## Edge Cases

- The declaration is a wide table, and the copyright line sits in the footer's narrow first column, so it can overflow
  or crowd the columns beside it. It must not cause horizontal scrolling of the page on a phone, and it must stay inside
  the footer's width.
- The script puts content into the page after load. The page's own markup must not be replaced or broken by it
  (hydration, spec 038).
- On the Cookie Declaration, Cookiebot shows its own text and colors. They must be readable on the always-dark palette,
  or be set to fit it in Cookiebot Manager.
- The element appears once per page, only in the footer.
- Pages without the footer (if any) are unchanged.
- Local development: Cookiebot does not serve localhost (spec 076), so the declaration is empty there.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every page that has the footer MUST contain the Cookie Declaration script element exactly as given in the
  input, directly after the copyright line.
- **FR-002**: The element MUST keep `id`, `src`, `type`, and `async` unchanged.
- **FR-003**: Pages added in `content/` MUST get it with no per-page work.
- **FR-004**: Every page MUST still hydrate and show its content on every load, with or without a saved consent
  choice, and after the banner is closed.
- **FR-005**: The declaration MUST NOT make a page scroll sideways or push footer content out of view at phone,
  tablet, and desktop widths.
- **FR-006**: The footer's links, social icons, and copyright line MUST keep working and keep their order.
- **FR-007**: A test checks the behavior, not the wording: the element's position and attributes in the built HTML. It
  does not check the declaration's text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the site's pages that have the footer show the declaration below the copyright line.
- **SC-002**: 100% of page loads still hydrate, in 10 repeated loads of each page type.
- **SC-003**: No page scrolls sideways at 360, 768, and 1280 pixel widths because of the declaration.
- **SC-004**: The page's load time does not get worse by more than the time Cookiebot's own file takes to load.

## Assumptions

- The Cookiebot account and domain `andexor.net` are set up, and the declaration's text and cookie list are managed in
  Cookiebot, not here.
- The declaration goes on every page that has the footer, as asked, not on a page of its own.
- It sits between the copyright line and the social icons, in the footer's first column. If that column is too narrow,
  the layout is adjusted to fit, but the order stays.
- The element is placed exactly as given. How it is added to the page so that it runs and does not break hydration is a
  plan question.
- The second Cookiebot script is a third-party service that collects visitor data under its own terms.
