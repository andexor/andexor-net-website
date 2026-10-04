# Feature Specification: Subtler Gold Glows

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Make the Old Gold radial gradient background more subtle so the images they surround will stand out more. Change the color stops to 10% and 50%."

**Follow-up**: Owner extended it to "all locations on all pages and the popup". The first stop was then changed from 10% to 12% (still too subtle), and the second stop from 50% to 48%.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The hero illustration stands out from its glow (Priority: P1)

A visitor opens a content page such as Web Development. Behind the hero illustration they see a soft
Old Gold glow. The glow is fainter and fades out closer to the illustration than before, so the
illustration is the first thing the eye lands on, and the glow reads as a gentle halo rather than a
colored patch.

**Why this priority**: This is the change the owner asked for. The glow competes with the
illustrations today.

**Independent Test**: Open any content page with an illustration and compare the glow with the
previous build. The glow's strongest point is clearly fainter, and it reaches full transparency
well inside the area it covered before.

**Acceptance Scenarios**:

1. **Given** a content page with a hero illustration, **When** it loads, **Then** the glow's
   strongest color is 12% Old Gold (down from 22%).
2. **Given** the same page, **When** it loads, **Then** the glow is fully transparent at 48% of its
   radius (down from 65%), so it ends closer to the illustration.
3. **Given** the same page at 1920, 1280, 768, and 375 pixels wide, **When** it loads, **Then** the
   glow's size and position are unchanged and nothing scrolls horizontally.

---

### Edge Cases

- All four Old Gold glows change the same way: behind the hero illustration on content pages,
  behind the home page logo, behind the Contact Us button, and behind the Contact Us popup logo.
- The Old Gold color, the glow's size, its position, and the illustration itself are unchanged.
- Text over the glow stays at least as readable as before, since the glow only gets fainter.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every Old Gold glow (content page illustration, home page logo, Contact Us button,
  Contact Us popup header) MUST use two color stops: Old
  Gold at 12% strength at the center, fading to fully transparent at 48% of the radius.
- **FR-002**: The glow's color (Old Gold), size, and position MUST NOT change.
- **FR-003**: The other Old Gold glows MUST NOT keep the old values anywhere in the site.
- **FR-004**: The design-system documents that describe the illustration glow, if any, MUST be
  updated to match.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The glow's peak strength is 12%, and it is fully transparent at 48% of its radius, on
  every content page with an illustration.
- **SC-002**: A search for the old values (22% strength, 65% fade) finds 0 matches outside dependencies and specs.
- **SC-003**: No horizontal scrolling at 320, 375, 768, and 1920 pixels wide.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- "Color stops 12% and 48%" means the two stops of the glow's gradient: the Old Gold strength
  (currently 22%) becomes 12%, and the fade-to-transparent position (currently 65%) becomes 48%.
- The owner asked for the change in all locations on all pages and the popup, so every Old Gold
  glow gets the same values.
- This is a small visual tweak to live pages. Implement directly; no plan or tasks needed.
