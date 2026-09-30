# Feature Specification: Technical Services Grid Backdrop

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: As built (written after the work was done, per the constitution's retrospective-spec rule)

**Input**: User description: "The pages listed in the Technical Services section in the footer will have a fading, repeated grid background in the hero section. This is done."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Technical Services pages show a fading grid behind the hero (Priority: P1)

A visitor opens Web Development, Web Hosting, Technical SEO, or Agentic Systems, the four pages
listed under "TECHNICAL SERVICES" in the footer. Behind the hero (logo art, eyebrow, headline, and
tagline) they see a faint engineering grid of thin light lines. The grid repeats evenly across the
hero in both directions and is strongest in the upper left, fading out toward the right and bottom
so it never has a hard edge and the hero blends into the page below it.

**Why this priority**: This is the whole feature. It gives the Technical Services section its own
look, separate from the Business Services and Company pages.

**Independent Test**: Open each of the four pages. Each hero shows the grid, brightest near its
upper left and invisible toward its far right and bottom edges. The hero text and the hero
illustration are fully legible over it.

**Acceptance Scenarios**:

1. **Given** any of the four Technical Services pages, **When** it loads, **Then** its hero shows a
   repeating square grid that fades out from the upper left.
2. **Given** the same page, **When** the visitor reads the eyebrow, headline, and tagline, **Then**
   the text meets the site's contrast standard over the grid.
3. **Given** the same page at any viewport width from a phone to a wide desktop, **When** it is
   viewed, **Then** the grid fills the hero, causes no horizontal scrolling, and does not cover or
   block the text, the illustration, or the cards below.

---

### User Story 2 - The grid is the same on all four pages and only on those pages (Priority: P2)

The owner marks a Markdown page as a Technical Services page with one line in its front matter.
Every page marked that way gets the same grid, with no per-page styling. Pages in other sections
(Business Services, About Us) and the not-found page do not show this grid.

**Why this priority**: Consistency across the section, and a clear boundary with the other
sections, keeps each section's look distinct.

**Independent Test**: Compare the four pages: the grid has the same spacing, brightness, and fade.
Open a Business Services page, About Us, and a made-up address (the not-found page): none shows the
line grid.

**Acceptance Scenarios**:

1. **Given** the four Technical Services pages, **When** their heroes are compared, **Then** the
   grid spacing, line brightness, and fade are identical.
2. **Given** a new page that the owner marks as Technical Services, **When** it is built, **Then**
   it shows the same grid with no other change.
3. **Given** a page in another section, or the not-found page, **When** it loads, **Then** it does
   not show the line grid.

---

### Edge Cases

- The grid is decoration only. It is hidden from screen readers and is not focusable or clickable;
  clicks and text selection pass through to the hero content.
- The grid sits behind all hero content, including the gold glow behind the illustration.
- The site is always dark (constitution, Principle VI). There is no light version of the grid.
- A Technical Services page with no cards (hero only) still shows the grid.
- A page that sets an unknown section value shows no grid, the same as a page with no section.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The hero of each page listed under "TECHNICAL SERVICES" in the footer (Web
  Development, Web Hosting, Technical SEO, Agentic Systems) MUST show a repeating square grid of thin
  light lines behind its content.
- **FR-002**: The grid MUST fade out gradually from the upper left of the hero, so that no hard
  edge is visible at the hero's right or bottom.
- **FR-003**: The grid MUST be faint enough that the hero's text meets WCAG 2.1 AA contrast over it.
- **FR-004**: The grid MUST be purely decorative: hidden from assistive technology, not
  interactive, and never intercepting clicks or text selection.
- **FR-005**: The grid MUST be identical on every Technical Services page, and MUST be chosen by a
  single setting on the page, with no per-page styling.
- **FR-006**: Pages outside the Technical Services section, and the not-found page, MUST NOT show
  this grid.
- **FR-007**: The grid MUST NOT cause horizontal scrolling or change the hero's layout at any
  viewport width.
- **FR-008**: The grid MUST follow the always-dark rule and use only the project's design colors.

### Key Entities

- **Section**: A page's grouping (Technical Services, Business Services, or Company). It picks the
  hero backdrop. A page without one gets a plain hero.
- **Hero backdrop**: The decorative pattern behind the hero content. For Technical Services it is
  the fading grid.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 4 of 4 Technical Services pages show the grid behind their heroes.
- **SC-002**: 0 pages outside the section (Business Services, About Us, not-found) show the line
  grid.
- **SC-003**: Hero text passes the automated WCAG 2.1 AA accessibility check on the Technical
  Services pages, with no new violations.
- **SC-004**: No horizontal scrolling at viewport widths of 320, 768, and 1920 pixels.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- This spec records work that is already done. It describes the grid that Technical Services pages
  have today; it does not ask for new work.
- The grid is the one first shown on the Web Development page (spec 002), now scoped to the
  Technical Services section. It is a 48 px square tile, in light lines at about 10 percent white,
  fading from the upper left.
- The section is set in each page's front matter (`section: technical`). The backdrops for Business
  Services (city blocks) and Company (concentric rings) are separate from this spec.
- The four pages are the ones listed under "TECHNICAL SERVICES" in the footer (spec 010). The
  footer and Contact Us list are not changed here.
- The not-found page keeps a plain hero with no backdrop (spec 006).
