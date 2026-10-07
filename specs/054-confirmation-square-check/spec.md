# Feature Specification: Confirmation Square Check

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Replace the check on the Request received screen with the square-check icon from FontAwesome. Keep the same size and the foreground and background green colors and the round background."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Confirmation shows the square check (Priority: P1)

A visitor opens the Contact Us popup on the home page, fills in the form, and sends it. The popup then shows the
"Request received" screen. At the top of that screen, inside the round light green badge, the check mark is now the
FontAwesome square-check icon, drawn at the same size and in the same green as the check mark it replaces, with the icon's own square fully clear so
only the check mark shows against the round badge, as it does now. The round
badge, its light green fill, and everything else on the screen stay as they are.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Send the Contact Us form with valid details and look at the confirmation screen: the icon in the
round green badge is the square-check, the same size and green as before.

**Acceptance Scenarios**:

1. **Given** the Request received screen, **When** a visitor looks at the badge, **Then** it shows the FontAwesome
   square-check icon, and the plain check icon is no longer used there.
2. **Given** the badge, **When** the icon is measured, **Then** it is 28 by 28 pixels, the size of the icon it replaces.
3. **Given** the badge, **When** it is viewed, **Then** the icon is the same dark green as before, nothing but the check
   mark is drawn over the circle (no square, no box, no other fill), and the badge is the
   same round shape, 56 pixels across, with the same light green background and the same position above the heading.
4. **Given** the badge, **When** it is viewed, **Then** the icon is centered in the circle, both horizontally and
   vertically.
5. **Given** a screen reader, **When** it reads the confirmation, **Then** the icon is still not announced, and the
   heading, text, and OK button are read as before.
6. **Given** the confirmation at 360, 768, and 1280 pixel widths, **When** it is viewed, **Then** nothing overlaps and the
   popup does not scroll sideways.
7. **Given** the confirmation, **When** a visitor presses Tab, **Then** focus still moves only between OK and Close, and
   Escape or OK still closes it and reopening shows the empty form.

---

### Edge Cases

- The square-check is a two-layer icon. Its square layer, which FontAwesome draws at 40% strength, is made fully clear, so the
  circle's light green shows around the check mark exactly as it does now. The check mark uses the dark green at full
  strength. No other color appears, and nothing is white.
- The icon's square is 28 pixels, and the circle is 56 pixels, so the icon has 14 pixels of space on every side inside the
  circle and never touches its edge.
- The check mark inside the square-check is drawn smaller than the old plain check, because the square takes up room in
  the same box. That follows from keeping the size the same.
- The icon must stay the same size and centered when the popup narrows, and never be squeezed.
- The form screen, the card icons, and the card bullets are not changed.
- Hover, press, and focus behavior of the popup and its buttons is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The icon in the round badge on the Request received screen MUST be the FontAwesome square-check icon, in
  place of the plain check icon.
- **FR-002**: The icon MUST be 28 by 28 pixels, the size of the icon it replaces.
- **FR-003**: The icon MUST be the same foreground green as before (`--success-600`), and the badge MUST keep its round
  shape, its 56 pixel size, and its light green background (`--success-100`), each taken from the same color settings
  rather than copied values.
- **FR-004**: The icon MUST be centered in the badge, and its element MUST have a transparent background. The icon's square
  layer MUST be fully transparent (zero opacity), leaving only the check mark visible over the round badge.
- **FR-005**: The icon MUST stay hidden from assistive technology, and the confirmation's text, heading, focus order,
  and close behavior MUST NOT change.
- **FR-006**: The icon is sized by the stylesheet override rule the project uses for FontAwesome icons, with a rule named
  for the square-check icon's own classes, and no copy or patch of FontAwesome's stylesheet. The card bullet rule for the
  same icon (spec 053, 24 pixels) MUST NOT change the size of this icon, and this rule MUST NOT change the card bullets.
- **FR-007**: The build and every existing test MUST still pass. A test MUST check the confirmation icon's size, color,
  and badge, and MUST NOT count anything.

### Key Entities

- **Confirmation badge**: the round, light green badge at the top of the Request received screen, holding one icon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The icon in the badge is the square-check and measures 28 by 28 pixels, within 0.5 pixel.
- **SC-002**: The icon's color equals `--success-600` and the badge's background equals `--success-100`, and the badge is a
  56 by 56 pixel circle, the same values as before.
- **SC-003**: The icon's center is within 1 pixel of the badge's center. The icon element has a transparent background,
  and its square layer has an opacity of zero while its check mark has an opacity of one.
- **SC-004**: The card bullet icons are still 24 by 24 pixels, so the two sizes do not interfere.
- **SC-005**: All existing tests pass, including the contact popup focus and accessibility tests, and no new
  accessibility violations appear.

## Assumptions

- "The check on the Request received screen" is the plain check icon in the round badge above the "Request received"
  heading in the Contact Us popup (spec 001).
- "The square-check icon from FontAwesome" is FontAwesome's square-check in the duotone style, the only non-brand style the
  site's FontAwesome kit provides, the same as the card bullets.
- "The same size" is the 28 pixel icon size used now. The size of the 56 pixel badge is also unchanged.
- "The foreground and background green colors" are the dark green of the icon and the light green of the circle now. The
  owner confirmed that the icon's square layer is hidden and the icon's own background is transparent, as on the card
  bullets (spec 052), so the round light green badge shows as it does now and only the check mark is drawn.
- The card bullets (specs 051 to 053) are not changed, and the popup's form screen is not changed.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so
  it is left uncommitted when built.
