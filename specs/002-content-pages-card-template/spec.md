# Feature Specification: Content Pages, Card Template, and Web Development Page

**Feature Branch**: `retrospective-specs` (work originally shipped via issues #3, #5, #7, #9)

**Created**: 2026-09-29

**Status**: As-built (retrospective)

**Input**: User description: "As-built (retrospective) spec: Markdown content pages and the card-page service template, covering: the Markdown content-page system (content/ folder, path = route, catch-all route, front matter, unpublished-until-linked policy, Logo href on non-home pages); the card-page layout (hero fading into page background, equal-width stacked cards on small screens); the Web Development page (copy, hero image, H1 matching URL and title) and its links from the home-page service card and footer; always-dark theme (supersedes FR-016/SC-007); graceful shutdown of the Docker server on SIGINT/SIGTERM; no underline on hover, color change only; the small tweaks (H1 rename, gradient fade, align-items stretch, copywriting edits for issue #9)."

> **Retrospective note**: This feature was built outside the Spec Kit workflow (commits
> `0438462`, `bc947ba`, `b6065d3`, `c9b78ab`, `80e8ce1`, `099c92a`). This spec records what the
> site does today so that future changes have a written baseline. Where it conflicts with
> `specs/001-homepage-contact-us/spec.md`, this spec wins and the conflicts are recorded in
> that spec's Amendments section.
>
> Amended by `specs/007-no-link-underlines/spec.md`: links are never underlined, at rest or on
> hover (this spec allowed underlined body links at rest).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a service page (Priority: P1)

A prospective customer clicks "Web Development" on the home page (from the service card or the
footer) and lands on a page that explains, in short question-led cards, what Andexor can build
for them: new sites, re-designs, brochure sites, blogs, forms, shops, performance work, web
applications, and AI agents.

**Why this priority**: This is the visitor-facing value. The home page's service card is
otherwise a dead end, and this page is the first real destination the site offers.

**Independent Test**: From the home page, activate the Web Development service card, then
separately the footer's Web Development link. Each opens the Web Development page, which shows
the headline "Web Development", the hero illustration, and one card per topic.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page, **When** they activate the Web Development service
   card, **Then** they arrive at `/web-development`.
2. **Given** a visitor on the home page, **When** they activate "Web Development" in the footer's
   services column, **Then** they arrive at `/web-development`.
3. **Given** a visitor on the Web Development page, **When** the page loads, **Then** the
   browser tab title, the URL, and the page headline all say "Web Development" (the headline
   does not add the word "Services").
4. **Given** a visitor on the Web Development page, **When** they scroll, **Then** they see the
   sections, in order: Need a new website?, Is it time for a re-design?, Need a simple brochure
   site?, Want a blog?, How about some cool forms, right on your website?, Want to setup an
   e-commerce shop?, Got a site that loads too slow?, Need a web application?, and How about an
   AI agent?
5. **Given** a visitor on the Web Development page, **When** they read the "Need a web
   application?" card, **Then** they see the list of enterprise-style capabilities (automating
   routine tasks, background processing, batch queuing, database development and management,
   automatic data archival and removal, health-monitoring dashboards, business growth
   analytics, third-party integrations, and automatic failover).
6. **Given** a visitor on any content page, **When** they activate the logo, **Then** they
   return to the home page.
7. **Given** a visitor on the Web Development page, **When** they reach the bottom, **Then** they
   see the same footer as the home page.

---

### User Story 2 - Author a page as Markdown (Priority: P1)

The site owner adds or edits a Markdown file in the repository's content folder and, after a
rebuild, the page appears at the matching address with no code changes.

**Why this priority**: The owner writes all page copy themselves. Without this, every new page
would need hand-built layout code.

**Independent Test**: Add `content/about.md` containing a title heading and a paragraph, rebuild,
and open `/about`. Add `draft: true` to its front matter, rebuild, and confirm `/about` now
returns "not found".

**Acceptance Scenarios**:

1. **Given** a file `content/about.md`, **When** the site is built, **Then** a page exists at
   `/about`.
2. **Given** a file `content/services/web.md`, **When** the site is built, **Then** a page exists
   at `/services/web`.
3. **Given** a file `content/services/index.md`, **When** the site is built, **Then** a page
   exists at `/services`.
4. **Given** a root `content/index.md`, **When** the site is built, **Then** it is ignored,
   because `/` is the home page.
5. **Given** `content/README.md`, **When** the site is built, **Then** no page is published for
   it.
6. **Given** a page whose front matter says `draft: true`, **When** the site is built, **Then**
   no page is published for it and its address shows "not found".
7. **Given** a page with no `title` in its front matter, **When** it is built, **Then** its
   browser tab title is its first `#` heading, falling back to its file name in words.
8. **Given** an address with no matching page, **When** a visitor opens it, **Then** they see the
   site's "not found" page.
9. **Given** a Markdown page with tables, task lists, strikethrough, or bare links, **When** it is
   built, **Then** they render as such.
10. **Given** a link in a page whose address starts with `http`, **When** a visitor activates it,
    **Then** it opens in a new tab without giving the destination access to the originating
    page. **Given** a link to another route on the site, **Then** it opens in the same tab.
11. **Given** raw HTML written inside a Markdown file, **When** the page is built, **Then** the
    HTML is not rendered.
12. **Given** a Markdown page that does not use the card layout, **When** it renders, **Then** it
    shows a logo bar, a readable article column, and the site footer.

---

### User Story 3 - Control when a page is discoverable (Priority: P2)

The site owner can write and deploy a page without it being advertised. A page is only linked
from the home page or footer once the owner says it is ready.

**Why this priority**: It prevents half-finished pages from being surfaced to customers, but it
matters only once there is more than one content page.

**Independent Test**: With a finished page that has no links pointing at it, confirm no
home-page or footer link leads to it. Add a link, and confirm the link works.

**Acceptance Scenarios**:

1. **Given** a content page the owner has not approved for linking, **When** a visitor views the
   home page and footer, **Then** no link to that page appears.
2. **Given** the owner approves a page, **When** the link is added, **Then** it appears in the
   place they choose and leads to the page.
3. **Given** the footer's other items (for example About Us and Contact) that have no page yet,
   **When** a visitor activates them, **Then** they remain placeholders as defined in the home
   page spec.

---

### User Story 4 - Read cards comfortably on any device (Priority: P2)

A visitor on any device sees the card page's hero blend smoothly into the cards, and the cards
line up neatly rather than looking ragged.

**Why this priority**: It affects polish and legibility, but the content is readable without it.

**Independent Test**: Open the Web Development page at 320px, 768px, and 1920px wide and check
the hero, card widths, and card order.

**Acceptance Scenarios**:

1. **Given** a card page, **When** it loads, **Then** the hero band's background fades from the
   dark brand color at the top into the page background at the bottom, with no hard edge between
   the hero and the first cards.
2. **Given** a wide viewport, **When** cards are shown, **Then** they appear in two staggered
   columns, with odd-numbered cards in one column and even-numbered cards in the other.
3. **Given** a narrow viewport, **When** cards are shown, **Then** they stack in one column in
   reading order, and every card is the same width as the others.
4. **Given** a page that marks certain cards as featured, **When** it renders, **Then** those
   cards use the darker card style and the rest use the standard style.
5. **Given** a card with a small label, **When** it renders, **Then** the label appears above
   the card's heading.
6. **Given** a card page with a hero illustration, **When** it renders, **Then** the image has
   a text alternative describing it.

---

### User Story 5 - Always see the dark look (Priority: P2)

Every visitor sees the same dark-palette site, whatever their device's light or dark setting is.

**Why this priority**: It is a brand decision that affects every page, but it changes appearance
only, not function.

**Independent Test**: Load the home page and a content page with the device set to light, then
dark. The two loads have identical page background color.

**Acceptance Scenarios**:

1. **Given** a visitor whose device is set to light mode, **When** they open any page, **Then**
   they see the dark palette.
2. **Given** a visitor whose device is set to dark mode, **When** they open any page, **Then**
   they see the same dark palette.
3. **Given** any page, **When** a visitor looks for a theme control, **Then** none exists.
4. **Given** built-in browser controls (form fields, scrollbars), **When** they render, **Then**
   they also use the dark style.

---

### User Story 6 - Stop the site cleanly (Priority: P3)

The person running the site in a container can stop it with a single `Ctrl+C` or a
`docker stop`, and it stops promptly and cleanly.

**Why this priority**: It concerns the operator's workflow, not visitors, but a container that
ignores stop signals wastes time and leaves stale containers.

**Independent Test**: Start the container, send one interrupt, and confirm the log shows the
shutdown message, the process exits with status 0, and the container is gone.

**Acceptance Scenarios**:

1. **Given** the running site container, **When** the operator sends one interrupt (`Ctrl+C`),
   **Then** the site logs that it is shutting down, stops taking new connections, lets requests
   in progress finish, and exits with status 0.
2. **Given** the running site container, **When** the operator runs `docker stop`, **Then** it
   behaves the same as scenario 1.
3. **Given** a shutdown is already in progress, **When** further signals arrive, **Then** they
   are ignored.
4. **Given** a connection that will not close, **When** five seconds pass after shutdown begins,
   **Then** the site exits anyway.
5. **Given** the container was started with `--rm`, **When** it stops, **Then** no container
   remains afterward.

---

### User Story 7 - Hover signals by color only (Priority: P3)

A visitor hovering over any link sees its color change. Text never gains an underline on hover.

**Why this priority**: It is a small, sitewide polish rule that prevents a visible flicker.

**Independent Test**: Hover each kind of link (header, footer, cards, body links) and confirm
the color changes and no underline appears or disappears.

**Acceptance Scenarios**:

1. **Given** any link, **When** a visitor hovers over it, **Then** its color changes and no
   underline is added.
2. **Given** a link in body text on a content page, **When** the visitor hovers, **Then** only its
   color changes; it has no underline at rest, on hover, or on focus (amended by spec 007).
3. **Given** the stylesheets, **When** searched for a hover rule that adds an underline, **Then**
   none exist, including in the design-system base styles.

---

### Edge Cases

- What if there are no publishable content files at all? The site still builds, and every
  content address shows "not found".
- What if a card page has no hero image, eyebrow, intro text, or featured list? Each is
  optional and its area is simply omitted.
- What if a `featured` entry doesn't exactly match a card heading? That entry has no effect.
- What if a card page has text before its first `##` heading? It becomes the hero's intro text.
- What if the visitor's device asks for light mode? The dark look still applies (User Story 5).
- What if two files map to the same address (for example `a.md` and `a/index.md`)? The direct
  file wins.
- What if a file has missing front matter? The page still renders using the
  defaults in User Story 2, scenario 7.

## Requirements *(mandatory)*

### Functional Requirements

**Content pages**

- **FR-001**: Each Markdown file in the content folder MUST become a page at the address that
  matches its path, and `folder/index.md` MUST become the page at `/folder`.
- **FR-002**: Files named `README.md` (any case) and a root-level `index.md` MUST NOT be
  published.
- **FR-003**: A page whose front matter sets `draft: true` MUST NOT be published.
- **FR-004**: A page's browser tab title MUST come from front matter `title`, else the first `#`
  heading, else its file name in words; the site MUST append "| Andexor Network" (amended by
  `specs/003-logo-wordmark/spec.md`: ", Inc." is dropped from titles).
- **FR-005**: A page's meta description MUST come from front matter `description` when present
  and MUST be omitted otherwise.
- **FR-006**: Addresses with no page MUST show the site's "not found" page. Amended by
  `specs/006-not-found-page-style/spec.md`: it uses the Web Development style hero with the 404
  image, and the requested address is never redirected.
- **FR-007**: Markdown MUST support tables, task lists, strikethrough, and automatic links;
  headings MUST get linkable anchors; raw HTML MUST NOT be rendered.
- **FR-008**: Links starting with `http` MUST open in a new tab and MUST NOT expose the
  originating page to the destination; links to other site routes MUST open in the same tab.
- **FR-009**: A page not using the card layout MUST render a logo bar, a readable article
  column, and the shared footer.
- **FR-010**: The logo on a content page MUST link to the home page. No logo scrolls to the top:
  the footer logo and the hero's brand row are not links (amended by
  `specs/003-logo-wordmark/spec.md` and `specs/008-no-top-links/spec.md`), and no link anywhere goes
  to `#top`.
- **FR-011**: Pages MUST be authored as Markdown; they MUST NOT be converted to hand-written
  page code.
- **FR-012**: Authoring rules (routes, front matter, card layout, copy rules, publishing) MUST
  be documented in `content/README.md`.
- **FR-013**: A content page MUST NOT be linked from the home page or footer until the owner
  approves it.

**Card layout**

- **FR-014**: A page with `layout: cards` MUST show a dark hero band with the `#` heading as
  headline, an optional eyebrow, an optional illustration with text alternative, and any text
  before the first `##` as intro text.
- **FR-015**: Each `##` section MUST render as its own card, with an optional small label taken
  from a `>> Label` line directly after the heading.
- **FR-016**: Headings listed under `featured` MUST render as dark cards.
- **FR-017**: On wide viewports, cards MUST be dealt into two staggered columns; on narrow
  viewports, they MUST stack in one column in reading order at equal width.
- **FR-018**: The hero band's background MUST fade from the dark brand color into the page
  background so that no hard edge separates it from the cards.
- **FR-019**: Card pages MUST remain legible and usable from 320px to 1920px wide.

**Web Development page**

- **FR-020**: The site MUST publish a Web Development page at `/web-development`, whose
  headline is exactly "Web Development", with eyebrow "Technical services" and an isometric
  laptop-and-gears illustration.
- **FR-021**: The page MUST contain the nine cards listed in User Story 1 scenario 4, in that
  order, with "Need a web application?" and "How about an AI agent?" as the featured cards.
- **FR-022**: The page copy MUST follow the brand and copy rules in `design/README.md` (no
  italics, no emoji, Oxford comma, no dashes, "and" instead of "&", sentence-case headlines
  without a trailing period).
- **FR-023**: The home page's Web Development service card and the footer's Web Development link
  MUST lead to `/web-development`. Other service cards and footer items remain placeholders. (Footer items amended by spec 010.)

**Appearance and behavior sitewide**

- **FR-024**: The site MUST always render the dark palette regardless of the visitor's device
  setting, MUST NOT offer a theme toggle, and MUST render built-in browser controls in the dark
  style.
- **FR-025**: The site's own color tokens MAY differ from the design system's supplied tokens
  on this point, and MUST keep the always-dark behavior if the design tokens are re-imported.
- **FR-026**: Links MUST signal hover by color change only. No style, in the site or the design
  system's base styles, may add an underline on hover.
- **FR-027**: The site server MUST, on the first interrupt or terminate signal, stop accepting
  new connections, let requests in progress finish, log the shutdown, and exit with status 0.
- **FR-028**: The server MUST ignore repeated signals during shutdown and MUST force an exit
  after about five seconds if connections do not close.

### Key Entities

- **Content page**: A Markdown file with optional front matter (`title`, `description`, `draft`,
  `layout`, `eyebrow`, `image`, `image_alt`, `featured`). Its path determines its address.
- **Card**: One `##` section on a card page: a heading, an optional label, body content, and a
  featured flag.
- **Card hero**: The band above the cards, holding the eyebrow, headline, intro, and
  illustration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The site owner can publish a new plain page by adding one Markdown file and
  rebuilding, with zero code changes, in under 5 minutes.
- **SC-002**: A visitor on the home page reaches the Web Development page in one activation from
  either the service card or the footer link.
- **SC-003**: With the device set to light and then dark, the page background color on the home
  page and on content pages is identical (100% of pages checked).
- **SC-004**: 0 hover rules that add underlines exist across all site and design-system
  stylesheets.
- **SC-005**: Sending one interrupt to the running container ends the process within 5 seconds,
  with exit status 0 and no leftover container.
- **SC-006**: At 320px, 768px, and 1920px wide, the Web Development page has no horizontal
  scrolling, and at 320px all cards have equal width.
- **SC-007**: Draft pages and pages without links do not appear in the home page or footer in
  100% of builds.
- **SC-008**: Content pages meet the same accessibility standard (WCAG 2.1 AA) and keyboard
  operability as the home page.

## Assumptions

- Copy on the Web Development page was finalized on 2026-09-29 (issues #5, #7, #9); later
  copy edits are small changes that do not need a new spec.
- Only Web Development has a page so far. Other services, About Us, and Contact remain
  placeholders per the home page spec.
- The page is served as a static site from a container. Rendering happens at build time; there
  is no server-side rendering or database.
- The site owner, not visitors, supplies all Markdown. Content is trusted.
- Design-system rules in `design/README.md` and `design/DESIGN.md` govern look and copy.
- Links are never underlined, at rest or on hover (amended by spec 007; this line used to allow
  underlined body links at rest).
- Supersedes: FR-016, SC-007, the dark-scheme edge case, and the "no manual toggle; follows
  the OS" assumption in `specs/001-homepage-contact-us/spec.md`; FR-017 in that spec no longer
  applies to the Web Development links.
