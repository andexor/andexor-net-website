# Feature Specification: Close Square X

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Replace the X icon on the Contact Us popup and the Request received screen with the square-x icon from FontAwesome. Keep everything else looking the way it is with the glossy black background and everything else."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Close button uses the square-x icon (Priority: P1)

A visitor opens the Contact Us popup from the home page. In the top right corner of the popup header is the glossy black
Close button with a white X. That X is now the FontAwesome square-x icon, drawn in the same white, at the same size, and
sitting in the same centered spot. The glossy black rounded button around it, with its shine, border, shadow, hover,
press, and focus looks, is unchanged. The same Close button is shown on the Request received screen after the form is
sent, and it shows the new icon there too.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the Contact Us popup and look at the Close button in the header, then send the form and look at
it again on the Request received screen: both show the square-x in white on the glossy black button.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup form, **When** a visitor looks at the Close button, **Then** it shows the FontAwesome
   square-x icon, and the old X icon is no longer used.
2. **Given** the Request received screen, **When** a visitor looks at the Close button, **Then** it shows the same
   square-x icon in the same place.
3. **Given** either screen, **When** the Close button is viewed, **Then** the icon is white, 22 by 22 pixels, and centered
   in the 38 by 38 pixel button, and nothing but the icon's mark is drawn over the button: the icon's own square is clear
   and its background is transparent, so the glossy black button shows through.
4. **Given** either screen, **When** the Close button is viewed, **Then** its glossy black background, shine, border,
   rounded corners, shadow, and position in the header look exactly as before.
5. **Given** the Close button, **When** a visitor hovers, presses, or focuses it with the keyboard, **Then** it shows the same
   hover, press, and gold focus looks as before.
6. **Given** a screen reader, **When** it reads the Close button, **Then** it announces "Close" as before, and the icon
   is not announced separately.
7. **Given** either screen, **When** a visitor clicks Close, presses Escape, or uses Tab, **Then** the popup closes and
   focus moves as before.
8. **Given** the popup at 360, 768, and 1280 pixel widths, **When** it is viewed, **Then** nothing overlaps and the popup
   does not scroll sideways.

---

### Edge Cases

- The square-x icon is a two-layer icon: a square layer and an X mark. The Close button is itself a square with rounded
  corners, so a visible square inside it would look like a box in a box. The icon's square layer is therefore made fully
  clear, and only the X mark is drawn, in white, over the glossy black button.
- The X mark inside the square-x icon is drawn smaller than the old X inside the same 22 pixel box, because the square layer
  takes up room in the icon's drawing. It is still legible in white on black. If the owner wants it larger, that is a later
  request.
- The Close button is one button used by both screens, so the change appears on both without being made twice.
- The glossy button's shine layer sits behind the icon and must not cover it or change.
- The icon stays hidden from assistive technology, and the button keeps its accessible name "Close".
- The OK button and the Send button are not changed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The icon in the Contact Us popup's Close button MUST be the FontAwesome square-x icon, in place of the old X
  icon, on both the form screen and the Request received screen.
- **FR-002**: The icon MUST be white, the same white the old X has, 22 by 22 pixels, and centered in the button.
- **FR-003**: The icon's square layer MUST be fully transparent and the icon element MUST have a transparent background, so
  only the X mark is drawn over the button.
- **FR-004**: The Close button's glossy black background, shine, border, corner shape, shadow, size (38 by 38 pixels),
  position, and its hover, press, and focus looks MUST NOT change.
- **FR-005**: The icon MUST stay hidden from assistive technology, and the button's accessible name, click, Escape, and
  Tab behavior MUST NOT change.
- **FR-006**: The icon is sized by the stylesheet override rule the project uses for FontAwesome icons, with a rule named
  for the square-x icon's own classes and scoped to the Close button, and no copy or patch of FontAwesome's stylesheet.
  This rule MUST NOT change the confirmation check, the card bullet check, or any other icon.
- **FR-007**: The build and every existing test MUST still pass. A test MUST check the Close button's icon type, size, color,
  and transparency on both screens, and MUST NOT count anything.

### Key Entities

- **Close button**: the glossy black square button at the right of the popup header, holding one white icon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On both screens the Close button's icon is the square-x and measures 22 by 22 pixels, within 0.5 pixel.
- **SC-002**: The icon's color equals the old X's white, its element has a transparent background, and its square layer has an
  opacity of zero while its X mark has an opacity of one.
- **SC-003**: The icon's center is within 1 pixel of the button's center, and the button is still 38 by 38 pixels with the
  same background gradient, border, and corner radius as before.
- **SC-004**: The card bullet icons are still 24 by 24 pixels and the confirmation check is still 64 by 64 pixels.
- **SC-005**: All existing tests pass, including the popup focus, Escape, and accessibility tests, and no new
  accessibility violations appear.

## Assumptions

- "The X icon on the Contact Us popup and the Request received screen" is the white X in the glossy black Close button in
  the popup header. It is one button shared by both screens.
- "The square-x icon from FontAwesome" is FontAwesome's square-x (faSquareX) in the duotone style, the only non-brand style the
  site's FontAwesome kit provides, the same style as the other icons on the site.
- "Keep everything else looking the way it is with the glossy black background" means the button's look is unchanged and the
  icon's own square is hidden, as the owner asked for on the other icons, so the glossy black shows behind the white X mark.
- "The same size" means the 22 pixel icon size used now, inside the 38 pixel button.
- The old X is white (`#ffffff`), and the icon takes its color from the button, so it stays white.
- The OK and Send buttons, and the other icons, are not changed.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
