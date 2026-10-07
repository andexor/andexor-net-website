# Feature Specification: Close Icon Size

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Make the size of the X button be 36x36px."

## Clarifications

### Session 2026-10-07

- Q: Which should be 36x36px, the X icon or the whole Close button? -> A: The X icon. The glossy black button stays 38 by 38 pixels.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Larger X in the Close button (Priority: P1)

A visitor opens the Contact Us popup. The X in the glossy black Close button at the top right of the header is larger:
its icon is now 36 by 36 pixels instead of 22 by 22, so the X mark is easier to see. The icon is still white, still has
no square drawn around it, and is still centered in the button. The button itself, with its glossy black background,
shine, border, shadow, and 38 by 38 pixel size, is unchanged. The same larger X appears on the Request received screen,
which shares the same Close button.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the Contact Us popup and look at the Close button, then send the form and look again: the white X
mark is larger than before, centered, on the same glossy black button.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup form, **When** the Close button's icon is measured, **Then** it is 36 by 36 pixels.
2. **Given** the Request received screen, **When** the Close button's icon is measured, **Then** it is 36 by 36 pixels.
3. **Given** either screen, **When** the Close button is measured, **Then** it is still 38 by 38 pixels, and the icon is
   centered in it with 1 pixel of space on every side.
4. **Given** either screen, **When** the Close button is viewed, **Then** the icon is still white, its square layer is
   still clear, its background is still transparent, and the button's glossy black background, shine, border, rounded
   corners, shadow, and position in the header are unchanged.
5. **Given** the Close button, **When** a visitor hovers, presses, or focuses it with the keyboard, **Then** it shows the
   same hover, press, and gold focus looks as before, and the icon is not clipped or moved off center.
6. **Given** a screen reader, **When** it reads the Close button, **Then** it announces "Close" as before, and the icon is
   not announced separately.
7. **Given** the popup at 360, 768, and 1280 pixel widths, **When** it is viewed, **Then** nothing overlaps, the header
   keeps its height and layout, and the popup does not scroll sideways.

---

### Edge Cases

- The icon's box is 36 pixels inside a 38 pixel button, so the box fits with 1 pixel to spare on each side. The button has a
  1 pixel border, so the icon box and the border are the same distance apart as the button's inner edge allows, and the box
  must not be clipped by the button's rounded corners or its overflow setting.
- The X mark inside the square-x icon is about half the icon's width, so at 36 pixels the visible X is about 16 pixels
  across (about 10 pixels today). It stays well inside the button.
- The header must keep its height: a larger icon must not make the header taller, because the button does not grow.
- When the button is pressed it moves by a few pixels, as before, and the larger icon moves with it.
- The icon's soft drop shadow, which the old X also had, stays.
- The confirmation check (64 pixels), the card bullet icons (24 pixels), and the Send and OK buttons are not changed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The icon in the Contact Us popup's Close button MUST be 36 by 36 pixels, on both the form screen and the
  Request received screen.
- **FR-002**: The icon MUST stay centered in the button, white, with its square layer fully transparent and a transparent
  background.
- **FR-003**: The Close button MUST stay 38 by 38 pixels, and its glossy black background, shine, border, corner shape,
  shadow, position, and hover, press, and focus looks MUST NOT change.
- **FR-004**: The larger icon MUST NOT be clipped, MUST NOT change the header's height or layout, and MUST NOT cause the popup
  to scroll.
- **FR-005**: The icon MUST stay hidden from assistive technology, and the button's accessible name, click, Escape, and Tab
  behavior MUST NOT change.
- **FR-006**: The icon is sized by the existing stylesheet override rule for the Close icon (spec 057), changed from 22 to 36
  pixels. No other icon's size MUST change.
- **FR-007**: The build and every existing test MUST still pass. The existing Close icon test MUST be updated to expect 36 by
  36, and MUST NOT count anything.

### Key Entities

- **Close button**: the glossy black 38 by 38 pixel square button at the right of the popup header, holding one white
  36 pixel icon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On both screens the Close button's icon measures 36 by 36 pixels, within 0.5 pixel.
- **SC-002**: The Close button still measures 38 by 38 pixels, and the icon's center is within 1 pixel of the button's center.
- **SC-003**: The icon's box lies fully inside the button's box on every side, and the popup header's height is the same as
  before, within 1 pixel.
- **SC-004**: The confirmation check is still 64 by 64 pixels and the card bullet icons are still 24 by 24 pixels.
- **SC-005**: All existing tests pass, including the popup focus, Escape, and accessibility tests, and no new
  accessibility violations appear.

## Assumptions

- "The X button" is the glossy black Close button in the popup header, and "the size" the owner wants is the size of the X
  icon in it. The owner confirmed this: the icon becomes 36 by 36 pixels and the button stays 38 by 38 pixels.
- The icon keeps its white color, its clear square layer, and its transparent background from spec 057.
- Because the icon box (36) is only 2 pixels smaller than the button (38), the larger X nearly fills the button, with its
  visible mark roughly 16 pixels across.
- The button's size is not changed, because the owner asked only for the icon's size. If the owner also wants a larger
  button, that is a later request.
- The other icons and buttons are not changed.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
