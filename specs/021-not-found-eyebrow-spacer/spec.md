# Feature Specification: Not-Found Eyebrow Spacer

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Please add a margin or an empty eyebrow spacer on the not-found page so the H1 and tagline are vertically aligned with the service pages since the not-found page does not have eyebrows."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The not-found headline sits where the service page headlines sit (Priority: P1)

A visitor follows a bad link and lands on "Page not found". The headline and the line under it are
at the same height from the top of the page as the headline and tagline on a service page, so moving
between the two does not make the text jump up or down. The not-found page still shows no eyebrow
label.

**Why this priority**: This is the whole request. The eyebrow above the headline on other pages
pushes the headline down, and without one the not-found headline sits visibly higher.

**Independent Test**: Open a service page (for example Cost Reduction) and a made-up address, at
1920, 1280, 768, and 375 pixels wide. At each width, the headline's top edge and the tagline's top
edge are at the same distance from the top of the page on both.

**Acceptance Scenarios**:

1. **Given** the not-found page and a service page at the same viewport width, **When** both
   load, **Then** the headline tops are at the same height and the tagline tops are at the same
   height.
2. **Given** the not-found page, **When** it loads, **Then** no eyebrow text is visible and screen
   readers do not announce anything extra before the headline.
3. **Given** the not-found page at a width where the hero stacks the illustration above the text,
   **When** it loads, **Then** the headline and tagline are still at the same height as on a service
   page at that width.

---

### Edge Cases

- The spacer is invisible and empty. It is not read by screen readers and cannot be focused or
  selected.
- The spacer takes the same height as a real eyebrow at every width, because the eyebrow's height
  does not depend on its words.
- Any other page that has a card hero but no eyebrow gets the same spacer, so its headline lines up
  too.
- The headline width (spec 020), colors, and the link in the tagline are unchanged.
- The hero's bottom edge may still be shorter than on pages with cards, as before (spec 006).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On a page whose hero has no eyebrow, the hero MUST reserve the same vertical space
  that an eyebrow takes, above the headline.
- **FR-002**: The reserved space MUST be invisible, contain no readable text, and be hidden from
  assistive technology.
- **FR-003**: On the not-found page, the headline's top and the tagline's top MUST be at the same
  distance from the top of the page as on a service page, at each of 1920, 1280, 768, and 375
  pixels wide.
- **FR-004**: The not-found page MUST still show no eyebrow, no cards, and no backdrop pattern.
- **FR-005**: Pages that do have an eyebrow MUST be unchanged.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The measured difference between the not-found headline's top and a service page
  headline's top is 0 pixels at 1920, 1280, 768, and 375 pixels wide. Before the change it was 15
  pixels at the two wider sizes and 30 pixels at the two narrower ones.
- **SC-002**: The same difference for the tagline's top is 0 pixels at those four widths.
- **SC-003**: No page with an eyebrow moves by even 1 pixel.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- The text column is vertically centered beside the illustration, so removing the eyebrow shortens
  the column and moves the headline up by half of the eyebrow's height. A spacer of the same height
  restores the original position.
- "A margin or an empty eyebrow spacer" is the owner's wording. An empty spacer the same height as
  the eyebrow is used because it stays correct if the eyebrow's size changes; a fixed margin would
  need to be kept in step by hand.
- This holds only while the not-found tagline is one line, like a service page tagline. A longer
  tagline would shift things by half a line, which is expected.
