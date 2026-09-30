# Feature Specification: Business Services Blocks Backdrop

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: As built (written after the work was done, per the constitution's retrospective-spec rule)

**Input**: User description: "The pages listed in the Business Services section in the footer will have a fading, repeated image of blocks of varying sizes in the hero section. This is done."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Business Services pages show fading city blocks behind the hero (Priority: P1)

A visitor opens Cost Reduction, Lead Generation, Growth Marketing, or Process Re-engineering, the
four pages listed under "BUSINESS SERVICES" in the footer. Behind the hero (illustration, eyebrow,
headline, and tagline) they see a quiet field of rounded rectangles of varying sizes, separated by
narrow gaps, like city blocks seen from above or the stone blocks of an old building. The field
starts at the left edge of the hero and repeats to the right. It is strongest at the upper left and
fades out toward the right and the bottom, so there is no hard edge and the hero blends into the
page below it.

**Why this priority**: This is the whole feature. It gives the Business Services section its own
look, distinct from the Technical Services grid (spec 017) and the Company pages.

**Independent Test**: Open each of the four pages. Each hero shows the blocks, brightest at its
upper left and invisible toward its far right and bottom. Block widths and heights visibly differ
from one another. The hero text and illustration are fully legible over it.

**Acceptance Scenarios**:

1. **Given** any of the four Business Services pages, **When** it loads, **Then** its hero shows
   blocks of varying sizes, repeated across the width of the hero and fading out toward the right and
   bottom.
2. **Given** the same page, **When** the visitor reads the eyebrow, headline, and tagline, **Then**
   the text meets the site's contrast standard over the blocks.
3. **Given** the same page at any viewport width from a phone to a very wide desktop, **When** it is
   viewed, **Then** the blocks fill the hero to its right edge with no visible seam where the image
   repeats, cause no horizontal scrolling, and do not cover or block the text, the illustration, or
   the cards below.

---

### User Story 2 - The blocks are the same on all four pages and only on those pages (Priority: P2)

The owner marks a Markdown page as a Business Services page with one line in its front matter.
Every page marked that way gets the same blocks, with no per-page styling. Pages in other sections
(Technical Services, About Us) and the not-found page do not show this image.

**Why this priority**: Consistency within the section and a clear boundary with the other sections
keep each section's look distinct.

**Independent Test**: Compare the four pages: the blocks, their brightness, and the fade are
identical. Open a Technical Services page, About Us, and a made-up address (the not-found page):
none shows the blocks.

**Acceptance Scenarios**:

1. **Given** the four Business Services pages, **When** their heroes are compared, **Then** the
   blocks, brightness, and fade are identical.
2. **Given** a new page that the owner marks as Business Services, **When** it is built, **Then** it
   shows the same blocks with no other change.
3. **Given** a page in another section, or the not-found page, **When** it loads, **Then** it does
   not show the blocks.

---

### Edge Cases

- The blocks are decoration only. They are hidden from screen readers and are not focusable or
  clickable; clicks and text selection pass through to the hero content.
- The blocks sit behind all hero content, including the gold glow behind the illustration.
- The repeated image must join seamlessly: the gap between blocks at the end of one repeat and the
  start of the next is the same width as any other gap.
- The image scales with the height of the hero, so on a taller hero the blocks are larger and fewer
  repeats are needed to reach the right edge.
- The site is always dark (constitution, Principle VI). There is no light version of the blocks.
- A Business Services page with no cards (hero only) still shows the blocks.
- A highlighted route drawn over the blocks was tried and left out, because its position cannot
  avoid the hero illustration at every width. It is not part of this feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The hero of each page listed under "BUSINESS SERVICES" in the footer (Cost
  Reduction, Lead Generation, Growth Marketing, Process Re-engineering) MUST show a field of
  rounded rectangular blocks of varying widths and heights, separated by narrow gaps, behind its
  content.
- **FR-002**: The field MUST start at the left edge of the hero and repeat horizontally to fill its
  full width, with no visible seam where the image repeats.
- **FR-003**: The field MUST fade out gradually toward the right and the bottom of the hero, so no
  hard edge is visible there.
- **FR-004**: The blocks MUST be faint enough (about 3 percent white) that the hero's text meets
  WCAG 2.1 AA contrast over them.
- **FR-005**: The blocks MUST be purely decorative: hidden from assistive technology, not
  interactive, and never intercepting clicks or text selection.
- **FR-006**: The blocks MUST be identical on every Business Services page, and MUST be chosen by a
  single setting on the page, with no per-page styling.
- **FR-007**: Pages outside the Business Services section, and the not-found page, MUST NOT show
  the blocks.
- **FR-008**: The blocks MUST NOT cause horizontal scrolling or change the hero's layout at any
  viewport width.
- **FR-009**: The blocks MUST follow the always-dark rule and use only white at low opacity.

### Key Entities

- **Section**: A page's grouping (Technical Services, Business Services, or Company). It picks the
  hero backdrop. A page without one gets a plain hero.
- **Hero backdrop**: The decorative pattern behind the hero content. For Business Services it is the
  fading field of blocks.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 4 of 4 Business Services pages show the blocks behind their heroes.
- **SC-002**: 0 pages outside the section (Technical Services, About Us, not-found) show the
  blocks.
- **SC-003**: Hero text passes the automated WCAG 2.1 AA accessibility check on the Business
  Services pages, with no new violations.
- **SC-004**: No horizontal scrolling at viewport widths of 320, 768, and 1920 pixels.
- **SC-005**: At 1920 pixels wide, the blocks show no visible seam or gap wider than the normal
  street gap across the full hero width.
- **SC-006**: All existing automated tests pass after the change.

## Assumptions

- This spec records work that is already done. It describes the backdrop that Business Services
  pages have today; it does not ask for new work.
- The image is a single tile of 10 columns and 6 rows of blocks, 700 by 340 units, scaled to the
  hero's height. The owner chose it for its varied block sizes, "like a spreadsheet or the big stone
  blocks on an old city building". It is a file the owner can edit directly (`public/city-grid.svg`).
- The section is set in each page's front matter (`section: business`). The backdrops for
  Technical Services (line grid, spec 017) and Company (concentric rings) are separate from this
  spec.
- The four pages are the ones listed under "BUSINESS SERVICES" in the footer (spec 010). The footer
  and Contact Us list are not changed here.
- The not-found page keeps a plain hero with no backdrop (spec 006).
- The highlighted A-to-B route is a possible later addition and would need its own spec.
