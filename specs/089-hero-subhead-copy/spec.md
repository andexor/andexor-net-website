# Feature Specification: Home Page Hero Subhead Copy

**Feature Branch**: `089-hero-subhead-copy` (not created; the branch is the user's choice)

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "On the home page, in the an-hero__subhead class, remove the max-width. Change the text to \"We help small businesses in the Atlanta area grow with services normally found in larger organizations.\""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the new hero subhead (Priority: P1)

A visitor opens the home page and reads the line under the headline. The line now says who Andexor helps and where, in one sentence: small businesses in the Atlanta area, and the services they get from larger organizations. The line spans the full width of the hero text column instead of wrapping at a narrower measure.

**Why this priority**: The copy is the message the owner wants the home page to carry. It is the only user-visible change in this feature.

**Independent Test**: Open the home page at desktop and mobile widths. Confirm the hero subhead reads exactly "We help small businesses in the Atlanta area grow with services normally found in larger organizations." and that its line length follows the hero column, not a fixed 40em limit.

**Acceptance Scenarios**:

1. **Given** a visitor opens the home page, **When** they read the hero, **Then** the text under the headline is exactly "We help small businesses in the Atlanta area grow with services normally found in larger organizations."
2. **Given** the home page is open on a wide screen, **When** the hero subhead wraps, **Then** it wraps at the width of the hero column, not at 40em.
3. **Given** the home page is open on a narrow phone screen, **When** the hero subhead wraps, **Then** it still fits within the screen with no horizontal scrolling.

---

### User Story 2 - Other pages are unchanged (Priority: P2)

The owner changes only the home page hero. Other uses of the same styling class, and the rest of the home page, keep their current text and layout.

**Why this priority**: The change is meant to be narrow. Any other visible change would be unplanned.

**Independent Test**: Search the site for the class `an-hero__subhead` and confirm that the only element carrying the new text is the home page hero subhead.

**Acceptance Scenarios**:

1. **Given** the change is deployed, **When** a visitor views any page other than the home page, **Then** that page's text and layout are the same as before.

---

### Edge Cases

- The new sentence is longer than the old one. It must wrap onto more lines without overlapping the elements above or below the hero.
- The removed max-width means the line can run the full hero column on large screens. The hero column's own width still limits it.
- A visitor with text enlarged in the browser sees the same text, wrapping onto more lines.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page hero subhead MUST read exactly "We help small businesses in the Atlanta area grow with services normally found in larger organizations."
- **FR-002**: The `an-hero__subhead` style MUST NOT set a max-width. Its line length MUST be set by the width of the element that contains it.
- **FR-003**: The change MUST NOT alter the hero subhead's color, size, line height, or margin.
- **FR-004**: The change MUST NOT add a link, underline, or hover effect to the subhead.
- **FR-005**: The design-system README, sample component, and bundle MUST quote the new sentence and show no max-width for the subhead, as spec 022 (FR-006) required for its own change.

### Key Entities

None. The feature changes one line of copy and one style rule.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The home page hero subhead text matches the required sentence character for character.
- **SC-002**: The `an-hero__subhead` rule in the site stylesheet has no max-width declaration.
- **SC-003**: No page other than the home page shows the new sentence, and no other page's hero or layout changes.
- **SC-004**: At a phone-width viewport, the hero subhead produces no horizontal scrolling.

## Assumptions

- The hero subhead is the one element with the class `an-hero__subhead`, on the home page only. The current copy is "We create and manage solutions to help your business grow.", set by spec 024.
- This supersedes spec 022 (`specs/022-home-subhead-copy-width/`) for the subhead's width (its 40em max-width is removed) and spec 024 (`specs/024-home-subhead-wording/`) for its sentence. Specs 022 and 024 are left as written, with a note pointing here.
- The change is a copy and style edit to the existing home page hero. It adds no new component, route, or behavior.
- Per the project's spec policy, a small live-site copy tweak normally skips a spec. This spec exists because the owner invoked the specify step for it.
- Tests for copy wording are not written. The constitution and project test rules forbid them, so verification is by viewing the page.
