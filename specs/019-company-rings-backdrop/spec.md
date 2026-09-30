# Feature Specification: Company Rings Backdrop

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: As built (written after the work was done, per the constitution's retrospective-spec rule)

**Input**: User description: "The pages listed in the Company section in the footer will have a radial gradient background in the hero section. Right now, this only applies to the About Us page, since the Contact Us form is a popup. This is done."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The About Us page shows fading rings behind the hero (Priority: P1)

A visitor opens About Us, the one page listed under "COMPANY" in the footer that is a page. Behind
the hero (illustration, eyebrow, headline, and tagline) they see thin, evenly spaced concentric
circles, like ripples or a radar sweep, centered on the hero illustration on the left. The circles
are strongest near their center and fade out with distance, so they dissolve before reaching the
right side and the edges of the hero, and the hero blends into the page below it.

**Why this priority**: This is the whole feature. It gives the Company section its own look,
distinct from the Technical Services grid (spec 017) and the Business Services blocks (spec 018).
The rings echo the gold glow behind the illustration.

**Independent Test**: Open About Us. The hero shows concentric rings centered near the illustration,
clearest close to it and invisible toward the far right and the edges. The hero text and the
illustration are fully legible over them.

**Acceptance Scenarios**:

1. **Given** the About Us page, **When** it loads, **Then** its hero shows evenly spaced concentric
   rings centered behind the illustration, fading out with distance.
2. **Given** the same page, **When** the visitor reads the eyebrow, headline, and tagline, **Then**
   the text meets the site's contrast standard over the rings.
3. **Given** the same page at any viewport width from a phone to a wide desktop, **When** it is
   viewed, **Then** the rings stay behind the content, cause no horizontal scrolling, and do not
   cover or block the text, the illustration, or the cards below.

---

### User Story 2 - Any future Company page gets the same rings, and other pages do not (Priority: P2)

The owner marks a Markdown page as a Company page with one line in its front matter, and it gets
the same rings with no per-page styling. Contact Us is also listed under "COMPANY" in the footer,
but it is a popup with no hero, so it is not affected. Pages in other sections (Technical Services,
Business Services) and the not-found page do not show the rings.

**Why this priority**: Consistency within the section and a clear boundary with the other sections
keep each section's look distinct, and the Company section is expected to grow.

**Independent Test**: Open the Contact Us popup from the footer: it looks as it did before. Open a
Technical Services page, a Business Services page, and a made-up address (the not-found page): none
shows rings. Mark a test page as Company and build: it shows the same rings as About Us.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup, **When** it opens, **Then** it is unchanged.
2. **Given** a new page that the owner marks as Company, **When** it is built, **Then** it shows
   the same rings as About Us with no other change.
3. **Given** a page in another section, or the not-found page, **When** it loads, **Then** it does
   not show the rings.

---

### Edge Cases

- The rings are decoration only. They are hidden from screen readers and are not focusable or
  clickable; clicks and text selection pass through to the hero content.
- The rings sit behind all hero content, including the gold glow behind the illustration.
- The rings are centered on the left side of the hero, where the illustration sits, and fade
  before reaching the right side, so they never run under the tagline's far end or the page edge as
  a hard line.
- The site is always dark (constitution, Principle VI). There is no light version of the rings.
- A Company page with no cards (hero only) still shows the rings.
- A page that sets an unknown section value shows no rings, the same as a page with no section.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The hero of every page in the Company section that is an actual page (today, About
  Us) MUST show evenly spaced thin concentric circles behind its content.
- **FR-002**: The circles MUST be centered on the left side of the hero, near the illustration.
- **FR-003**: The circles MUST fade out gradually with distance from their center, so that no hard
  edge is visible at the hero's right or bottom.
- **FR-004**: The circles MUST be faint enough (about 11 percent white at their strongest) that
  the hero's text meets WCAG 2.1 AA contrast over them.
- **FR-005**: The rings MUST be purely decorative: hidden from assistive technology, not
  interactive, and never intercepting clicks or text selection.
- **FR-006**: The rings MUST be identical on every Company page, and MUST be chosen by a single
  setting on the page, with no per-page styling.
- **FR-007**: The Contact Us popup MUST NOT be changed by this feature.
- **FR-008**: Pages outside the Company section, and the not-found page, MUST NOT show the rings.
- **FR-009**: The rings MUST NOT cause horizontal scrolling or change the hero's layout at any
  viewport width.
- **FR-010**: The rings MUST follow the always-dark rule and use only white at low opacity.

### Key Entities

- **Section**: A page's grouping (Technical Services, Business Services, or Company). It picks the
  hero backdrop. A page without one gets a plain hero.
- **Hero backdrop**: The decorative pattern behind the hero content. For Company it is the fading
  concentric rings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 1 of 1 Company pages (About Us) shows the rings behind its hero.
- **SC-002**: 0 pages outside the section (Technical Services, Business Services, not-found) show
  the rings, and the Contact Us popup is pixel-for-pixel unchanged.
- **SC-003**: Hero text passes the automated WCAG 2.1 AA accessibility check on the About Us page,
  with no new violations.
- **SC-004**: No horizontal scrolling at viewport widths of 320, 768, and 1920 pixels.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- This spec records work that is already done. It describes the backdrop that the About Us page has
  today; it does not ask for new work.
- "Radial gradient background" in the owner's description means a background made from a radial
  gradient. What the page shows is thin ring lines repeating outward from a center point, with a
  second radial fade hiding them with distance. The owner chose this look over a dot matrix, a
  hatch, and a few other patterns.
- The rings are centered at 15 percent across and 40 percent down the hero, spaced 47 px apart.
  The owner edits the section in the page's front matter (`section: company`).
- The footer lists two Company items, About Us and Contact Us (spec 010). Only About Us is a page
  with a hero. If another Company page is added later, it will share this backdrop.
- The backdrops for Technical Services (line grid, spec 017) and Business Services (city blocks,
  spec 018) are separate from this spec.
- The not-found page keeps a plain hero with no backdrop (spec 006).
