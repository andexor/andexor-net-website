# Feature Specification: Confirmation Check Size

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Make the size of the ckeck on the Request received screen to be 64x64px."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Larger check on the confirmation screen (Priority: P1)

A visitor sends the Contact Us form and sees the "Request received" screen. The check icon at the top, inside the round
light green badge, is now 64 by 64 pixels instead of 28 by 28, so the check mark is larger and easier to see. It is
still centered in the badge, still the same dark green, and still shown on its own over the round badge. The badge and the
rest of the screen stay as they are.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Send the Contact Us form with valid details and look at the confirmation screen: the icon measures
64 by 64 and its check mark sits centered inside the round badge, larger than before.

**Acceptance Scenarios**:

1. **Given** the Request received screen, **When** the icon is measured, **Then** it is 64 by 64 pixels.
2. **Given** the screen, **When** it is viewed, **Then** the visible check mark is centered in the round badge, both
   horizontally and vertically, and lies fully inside the circle with space around it.
3. **Given** the screen, **When** it is viewed, **Then** the icon is the same dark green, with its square layer still
   clear and its background still transparent, and the badge is the same 56 pixel round shape with the same light green
   background.
4. **Given** the screen, **When** it is viewed, **Then** the heading, text, and OK button are in the same place as before:
   the larger icon box does not push them.
5. **Given** the confirmation at 360, 768, and 1280 pixel widths, **When** it is viewed, **Then** nothing overlaps, the
   icon is not cut off, and the popup does not scroll sideways.
6. **Given** a screen reader, **When** it reads the confirmation, **Then** the icon is still not announced, and focus still
   moves only between OK and Close.
7. **Given** the home page, **When** the card bullets are viewed, **Then** their icons are still 24 by 24 pixels.

---

### Edge Cases

- A 64 pixel icon box is larger than the 56 pixel badge. The icon is centered, so its box extends 4 pixels past the circle on
  every side. Nothing is drawn there: the square layer is clear and the background is transparent, and FontAwesome leaves
  empty space around the check mark inside its box. So no visible part crosses the circle's edge.
- The check mark inside the box is about half the box's width, roughly 31 pixels across at 64 pixels, so it fits inside the
  56 pixel circle with margin. If the box were made larger than about 100 pixels it would start to touch the edge.
- The extra box size must not change the layout: the badge keeps its 56 pixel height, so the heading and text keep their
  positions, and the extra box size must not add scrollbars inside the popup.
- The icon must not be squeezed or clipped by the badge, which must not hide overflow.
- The badge's size, shape, and colors, the card bullet icons, and the form screen are not changed.
- Hover, press, and focus behavior of the popup and its buttons is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The icon on the Request received screen MUST be 64 by 64 pixels.
- **FR-002**: The icon MUST stay centered in the badge, and the visible check mark MUST lie fully inside the circle with space
  around it.
- **FR-003**: The badge MUST keep its 56 by 56 pixel round shape and its light green background (`--success-100`), the icon
  MUST keep its dark green color (`--success-600`), its clear square layer, and its transparent background.
- **FR-004**: The larger icon box MUST NOT move the heading, text, or OK button, and MUST NOT cause the popup to scroll or the
  icon to be clipped.
- **FR-005**: The icon MUST stay hidden from assistive technology, and the confirmation's focus order and close behavior MUST
  NOT change.
- **FR-006**: The icon is sized by the existing stylesheet override rule for the confirmation icon, changed from 28 to 64
  pixels, and the card bullet rule (24 pixels) MUST NOT change.
- **FR-007**: The build and every existing test MUST still pass. The existing confirmation icon test MUST be updated to expect
  64 by 64 and MUST NOT count anything.

### Key Entities

- **Confirmation badge**: the round, light green badge at the top of the Request received screen, holding one 64 pixel
  icon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The icon measures 64 by 64 pixels, within 0.5 pixel.
- **SC-002**: The icon's center is within 1 pixel of the badge's center, and the check mark's visible shape lies inside the 56
  pixel circle.
- **SC-003**: The heading's top edge is at the same position as before, within 1 pixel, and the popup has no sideways or
  inner scrollbar at 360, 768, and 1280 pixel widths.
- **SC-004**: The card bullet icons are still 24 by 24 pixels.
- **SC-005**: All existing tests pass, including the contact popup focus and accessibility tests, and no new accessibility
  violations appear.

## Assumptions

- "The check on the Request received screen" is the square-check icon in the round badge (spec 054), and "the size" is its
  28 by 28 pixel box, which becomes 64 by 64.
- The 56 pixel badge does not change. The owner asked only for the check's size, and earlier asked to keep the round
  background as it is. Because the check mark fills only about half of its box, the larger icon still sits inside the
  circle. If the owner wants the circle larger to match, that is a later request.
- The check mark will look larger, about 31 pixels across instead of about 14.
- The card bullets (specs 051 to 053) and the form screen are not changed.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so
  it is left uncommitted when built.
