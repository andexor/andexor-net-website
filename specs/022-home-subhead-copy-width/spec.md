# Feature Specification: Home Page Subhead Copy and Width

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "On the home page, in the an-hero__subhead class, set the max-width to 40em. Change the text to "We design, build, and manage solutions to help your business grow.""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The home page subhead reads in the company's own voice (Priority: P1)

A visitor opens the home page. Under the headline "Enterprise-grade services at small business
prices" the supporting line reads "We design, build, and manage solutions to help your business
grow." It speaks as "we" to "you", as the brand voice rule asks, instead of naming the company in
the third person.

**Why this priority**: This is the copy change the owner asked for, and it is what visitors read
first after the headline.

**Independent Test**: Open the home page. The line under the headline is exactly "We design,
build, and manage solutions to help your business grow." and the old wording does not appear
anywhere on the page.

**Acceptance Scenarios**:

1. **Given** the home page, **When** it loads, **Then** the supporting line under the headline
   reads "We design, build, and manage solutions to help your business grow."
2. **Given** the home page, **When** its text is searched for "Andexor Network designs", **Then**
   there is no match in the hero.

---

### User Story 2 - The subhead uses a wider line so it does not wrap early (Priority: P2)

The supporting line may run as wide as 40 times its font size before wrapping, up from 22. On a
desktop or tablet the new sentence sits on one line instead of breaking after a few words. On a
phone the line still wraps between words and stays inside the screen.

**Why this priority**: The new sentence is short enough to fit on one line, and the old limit would
have broken it in two for no reason. The hero's other elements are unchanged.

**Independent Test**: Open the home page at 1920, 1280, and 768 pixels wide: the supporting line is
one line. At 375 pixels wide it wraps between words and does not cause horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** the home page at a desktop width, **When** it loads, **Then** the supporting line is
   one line tall.
2. **Given** the home page at a phone width, **When** it loads, **Then** the line wraps between
   words and nothing overflows the screen.

---

### Edge Cases

- Only the subhead's width limit and text change. The headline, the Contact Us button, the logo,
  the colors, the font size, and the spacing are unchanged.
- The footer tagline ("Enterprise-grade services at small business prices") and the headline are
  not part of this change.
- The design-system documents and sample code that quote the old sentence and the old width are
  updated to match, so they do not reintroduce the old wording later.
- Other pages' heroes (card pages) have their own taglines and widths and are not touched.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page hero's supporting line MUST read exactly "We design, build, and manage
  solutions to help your business grow."
- **FR-002**: The supporting line MUST have a maximum width of 40 times its font size.
- **FR-003**: At viewport widths of 768 pixels and wider, the supporting line MUST fit on one line.
- **FR-004**: At any viewport width, the line MUST wrap between words when it does not fit and MUST
  NOT cause horizontal scrolling.
- **FR-005**: No other home page text or style MUST change.
- **FR-006**: Every other place in the project that quotes the old sentence or the old 22-times
  width for this line (the design-system README, sample component, and bundle, and the first
  feature's task list) MUST be updated to the new ones.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A case-sensitive search for "Andexor Network designs, builds, and manages" finds 0
  matches in the project outside dependencies and build output.
- **SC-002**: The supporting line is 1 line tall at 1920, 1280, and 768 pixels wide.
- **SC-003**: No horizontal scrolling on the home page at 320, 375, 768, and 1920 pixels wide.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- The brand voice rule in `design/README.md` is "we" to "you", so the new sentence follows it, with
  the Oxford comma and no dashes.
- "40em" means 40 times the subhead's own 19 pixel font size, about 760 pixels.
- The design-system files are copies of reference material that the owner keeps in step with the
  site, as in spec 013, so they are updated too. If they are re-copied from the design tool, they
  may need the same edit again.
- Specs 001 to 022 that mention the old sentence only as history are changed only where they
  describe what the page shows; this spec is not a rewrite of history.
- The sentence in this spec was later changed to "We create and manage solutions to help your business grow." by spec 024 (`specs/024-home-subhead-wording/`). The 40em width here stands.
