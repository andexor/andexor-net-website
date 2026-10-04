# Feature Specification: Home Hero Fades Into the Page

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "On the home page, make the hero section background fade into the mid section, like it does on the service pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The home hero blends into the services section (Priority: P1)

A visitor opens the home page. The dark blue hero band no longer ends in a hard horizontal edge. Its
color eases down into the page background as it meets the services section below, the same way the
hero on a service page such as Web Development eases into its cards. The two pages feel like one
site.

**Why this priority**: This is the change the owner asked for, and it removes the one visible
inconsistency between the home page and the service pages.

**Independent Test**: Open the home page and a service page at the same width and scroll to where
the hero meets the next section. Both show a smooth blue-to-page-color blend with no hard edge.

**Acceptance Scenarios**:

1. **Given** the home page, **When** the visitor scrolls to the bottom of the hero, **Then** the
   hero's background fades gradually into the page background instead of stopping at a straight edge.
2. **Given** the home page and a service page, **When** their hero fades are compared, **Then** the
   dark color holds over the upper part of the hero and blends to the page color by the bottom, the
   same way on both.
3. **Given** the home page at 1920, 1280, 768, and 375 pixels wide, **When** it loads, **Then** the
   fade is present at every width and nothing scrolls horizontally.
4. **Given** the faded hero, **When** the visitor reads the logo, headline, subhead, and Contact Us
   button, **Then** all of them are fully on the dark part and keep their contrast.

---

### Edge Cases

- The headline, subhead, Contact Us button, logo, glow, and grid overlay keep their look and their
  distance from the top of the page.
- The services section itself (heading, cards, spacing between cards) is unchanged.
- The hero keeps its original height: no bottom padding is added, so the services heading stays where
  it was. The fade therefore runs over the bottom of the hero, behind the lower part of the content
  (at most the Contact Us button), never behind the headline or subhead.
- The always-dark palette is unchanged: the fade ends in the dark page color, as on service pages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page hero's background MUST fade from the dark brand color into the page
  background color at its bottom edge, so there is no hard edge between the hero and the services
  section.
- **FR-002**: The fade MUST match the service pages: the dark color holds across the upper part of
  the hero, then blends to the page color at the bottom.
- **FR-003**: The hero's text, buttons, logo, glow, and grid overlay MUST NOT change appearance, and
  MUST sit over the dark part of the background.
- **FR-004**: The services section and every other section of the home page MUST NOT change.
- **FR-005**: The design-system documents that describe the home hero's background, if any, MUST be
  updated to match.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At the bottom edge of the home hero, the background color is the page background color,
  so no hard edge is visible at 1920, 1280, 768, and 375 pixels wide.
- **SC-002**: The headline, subhead, and button text keep at least the contrast ratio they had before
  (WCAG 2.1 AA).
- **SC-003**: No horizontal scrolling at 320, 375, 768, and 1920 pixels wide.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- "Mid section" means the services section directly below the hero.
- "Like it does on the service pages" means the same gradient: dark brand color held to about a third
  of the hero's height, then blending to the page background at the bottom.
- The owner first tried extra bottom padding for the fade and found it unnecessary (it pushed the
  services section down), so the hero's height is unchanged and the fade is a fixed-length blend over
  its bottom edge.
- This is a small visual tweak to a live page. Implement directly; no plan or tasks needed.
