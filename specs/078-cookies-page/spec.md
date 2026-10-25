# Feature Specification: Cookies Page

**Feature Branch**: `87-implement-cookiebot`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Use the marker in content/cookies.md. Add a link to the new page in the Company column in
the footer. Let the link text be "Cookies"."

Follows spec 077 (Cookie Declaration in the footer), spec 076 (Cookiebot), spec 002 (Markdown content pages), and spec
062 (the Privacy and Terms footer links). It moves the declaration out of the footer: now that Cookiebot has scanned the
site, the declaration is a long table of cookies that does not fit under the copyright line.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitors read the cookie declaration on its own page (Priority: P1)

A visitor opens the Cookies page and reads the full declaration, Cookiebot's list of the cookies and similar
technologies the site uses, and can change their consent choice from it.

**Why this priority**: The declaration is part of telling visitors what is stored and why, and it needs room to be
readable.

**Independent Test**: Run `bun run build`, serve `out/`, and open `/cookies`.

**Acceptance Scenarios**:

1. **Given** `content/cookies.md` with the marker in it, **When** `/cookies` is opened, **Then** the page shows the
   page's own text and the Cookie Declaration appears where the marker is.
2. **Given** the built page, **When** its HTML is read, **Then** it contains the Cookie Declaration script element with
   `id="CookieDeclaration"`, `src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js"`,
   `type="text/javascript"`, and `async`, once, at the marker's position.
3. **Given** a narrow phone screen, **When** `/cookies` is opened, **Then** the page does not scroll sideways, and the
   declaration's table can be read.

---

### User Story 2 - Visitors find the page from the footer (Priority: P1)

A visitor sees "Cookies" in the Company column of the footer, with the other company links, and follows it.

**Independent Test**: Open any page, find the Company column in the footer, and click "Cookies".

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** the Company column is read, **Then** it has a link with the text
   "Cookies" that goes to `/cookies`.
2. **Given** the footer links, **When** the link is followed, **Then** the Cookies page opens in the same tab, like
   Privacy and Terms.

---

### User Story 3 - The footer no longer carries the declaration (Priority: P1)

The footer goes back to its earlier layout: the copyright line is followed directly by the social icons, with no
declaration under it.

**Independent Test**: Open any page and read the footer in the built HTML.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** its HTML is read, **Then** the Cookie Declaration script element is not
   in the footer.
2. **Given** any page other than `/cookies`, **When** its HTML is read, **Then** the Cookie Declaration script element
   does not appear in it.

---

### User Story 4 - The page still works (Priority: P1)

The Cookies page loads, hydrates, and responds, with or without a saved consent choice and after the banner is closed.

**Why this priority**: Cookiebot scripts have stopped pages from working before (spec 076, Changes after launch).

**Independent Test**: Load `/cookies` many times, with and without a saved consent choice, and close the banner.

**Acceptance Scenarios**:

1. **Given** `/cookies`, **When** it loads, **Then** it shows its content and the header, footer, and Contact Us button
   work, on every load.
2. **Given** a visitor with no saved consent choice, **When** they close the banner with any button, **Then** the page
   stays up with no reload.
3. **Given** the declaration fails to load, **When** `/cookies` loads, **Then** the page still shows its own text with
   no error, and the rest of the site works.

## Edge Cases

- The marker is used only on `/cookies`. If it is put in another Markdown page, that page gets the declaration too; if
  it appears twice in one page, the declaration appears once, and the build reports the extra use.
- If `content/cookies.md` has no marker, the page builds without a declaration and the build says so, because a missing
  declaration is easy to miss.
- A `draft: true` Cookies page is left out of the site, and the footer link would point to a missing page. The link and
  the page are published together.
- The declaration is a wide table. It must stay inside the page's width on a phone and be readable on the always-dark
  palette.
- Pages in `content/` are written by the owner. The marker must not need any change to how the owner writes the other
  pages.
- The sitemap lists `/cookies` once the page is published (spec 075).
- Local development: Cookiebot does not serve localhost (spec 076), so the declaration is empty there.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `content/cookies.md` MUST be a Markdown page at `/cookies`, written like the other pages in `content/`
  (spec 002).
- **FR-002**: The page MUST contain a marker, and the built page MUST have the Cookie Declaration script element
  exactly as in spec 077 (`id`, `src`, `type`, `async` unchanged) at the marker's position, once.
- **FR-003**: The marker MUST be a single line the owner can put anywhere in a Markdown page. It MUST NOT allow other
  raw HTML into Markdown pages.
- **FR-004**: The footer MUST NOT contain the Cookie Declaration, and no page except `/cookies` MUST contain it.
- **FR-005**: The Company column of the footer MUST have a link with the text "Cookies" to `/cookies`, with no new
  tab, in the same way as the Privacy and Terms links, and keep the column's other links and order.
- **FR-006**: `/cookies` MUST hydrate and show its content on every load, with or without a saved consent choice, and
  after the banner is closed.
- **FR-007**: The page MUST NOT scroll sideways at phone, tablet, and desktop widths because of the declaration.
- **FR-008**: The link MUST follow the project's link rules: no underline, a color change on hover, and no link to
  `#top`.
- **FR-009**: `/cookies` MUST be listed in `content/sitemap.xml`.
- **FR-010**: Tests check behavior, not wording: the script element's presence and attributes on `/cookies`, its absence
  from the footer and other pages, the footer link's target, and no sideways scrolling on a phone width. They do not
  check the declaration's text or the page's copy.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `/cookies` shows the declaration, and no other page does.
- **SC-002**: A visitor reaches the Cookies page from the footer of any page in one click.
- **SC-003**: 100% of page loads of `/cookies` still hydrate, in 10 repeated loads.
- **SC-004**: `/cookies` does not scroll sideways at 360, 768, and 1280 pixel widths.
- **SC-005**: The footer's copyright line is followed directly by the social icons, as before spec 077.

## Assumptions

- The page title is "Cookies" and the owner writes its text and any other front matter. A first version with a
  heading and the marker is created with the feature.
- The page uses the card layout, like Privacy and Terms, with one card holding the declaration.
- The Cookiebot account, the domain `andexor.net`, and the declaration's text and cookie list are managed in Cookiebot,
  not here.
- This replaces spec 077's placement: the footer container, its CSS if any, and its footer tests are removed, and the
  declaration test moves to `/cookies`.
- The exact marker syntax and how the build replaces it are plan questions.
- The second Cookiebot script is a third-party service that collects visitor data under its own terms.
