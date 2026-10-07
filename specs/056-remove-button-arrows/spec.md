# Feature Specification: Remove Button Arrows

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Remove the ArrowRight icon from both the Contact Us button and the Send button."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Buttons show text only (Priority: P1)

A visitor looks at the "Contact Us" button in the call-to-action band on the home page, then opens the Contact Us popup
and looks at its "Send" button. Neither button shows a right-pointing arrow after its label any more. Each button shows
only its label, centered in the button, with the same colors, height, and shape as before.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the home page: the Contact Us button in the call-to-action band has no arrow. Click it: the
popup's Send button has no arrow.

**Acceptance Scenarios**:

1. **Given** the home page, **When** a visitor looks at the Contact Us button in the call-to-action band, **Then** it
   shows the label "Contact Us" and no icon.
2. **Given** the Contact Us popup form, **When** a visitor looks at the Send button, **Then** it shows the label "Send"
   and no icon.
3. **Given** either button, **When** it is viewed, **Then** its label is centered, and its font, height, corner shape,
   colors, and hover, press, focus, and disabled looks are the same as before.
4. **Given** the Send button and the OK button on the confirmation screen, **When** they are compared, **Then** they
   look alike (same font, height, padding, colors, and corner shape), as they did before.
5. **Given** the Send button while the form is being sent, **When** it is viewed, **Then** it is still disabled, and the
   label is unchanged.
6. **Given** a screen reader, **When** it reads either button, **Then** it announces the same name as before ("Contact Us"
   and "Send"), and the keyboard behavior is unchanged: Tab reaches both, and Enter or Space activates them.
7. **Given** the page at 360, 768, and 1280 pixel widths, **When** it is viewed, **Then** nothing overlaps or is cut off,
   and the popup does not scroll sideways.

---

### Edge Cases

- Without the arrow and the gap before it, each button is narrower by the arrow's width and the space beside it. The
  button keeps its side padding, so the label still has room, and the Send button stays in its place in the form.
- The label is the only content, so it sits in the exact center of the button rather than being offset by an icon.
- The Contact Us button in the call-to-action band stays in its place in the band and keeps its glow behind it.
- The shared button component still supports left and right icons for other uses. Only these two uses are removed.
- The popup's Close button (an X icon) is a separate control and is not changed.
- Pressing Send with required fields empty, and the sending state, behave as they did.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us button in the home page call-to-action band MUST NOT show an icon, only its label.
- **FR-002**: The Send button in the Contact Us popup MUST NOT show an icon, only its label.
- **FR-003**: Both labels MUST be centered in their buttons, and each button MUST keep its font, height, side padding,
  corner shape, colors, and interaction looks.
- **FR-004**: The Send button and the OK button MUST still look alike.
- **FR-005**: Each button's accessible name, keyboard behavior, click behavior, and disabled state MUST NOT change.
- **FR-006**: The shared button component MUST keep its support for left and right icons, so nothing else is affected, and
  the unused arrow import MUST be removed from the two files that no longer use it.
- **FR-007**: The build and every existing test MUST still pass. The existing test that expects the Send button to have one
  icon MUST be updated to expect none, and a test MUST check that neither button holds an icon, without counting buttons.

### Key Entities

- **Call-to-action button**: the "Contact Us" button in the band on the home page, which opens the popup.
- **Send button**: the submit button of the Contact Us form.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Neither the Contact Us button nor the Send button contains an icon element.
- **SC-002**: Each button's label is centered in the button within 1 pixel.
- **SC-003**: Each button's computed font size, height, border radius, and colors equal the values they had before, and the
  Send button still matches the OK button on those values.
- **SC-004**: At 360, 768, and 1280 pixel widths there is no horizontal scrolling and nothing is cut off.
- **SC-005**: All existing tests pass, including the popup focus and accessibility tests, and no new accessibility
  violations appear.

## Assumptions

- "The Contact Us button" is the button in the call-to-action band on the home page, and "the Send button" is the
  Contact Us popup's submit button. They are the only two uses of the arrow icon.
- The buttons get narrower by the width of the arrow and the gap before it. The owner asked only to remove the icon, so
  no minimum width is added.
- The button component and its styles are not otherwise changed, because other buttons may use icons later.
- Spec 035 made Send look like Contact Us, arrow included. That match still holds with the arrow gone from both, and where
  spec 035 mentions the arrow, this spec supersedes it.
- The popup's Close (X) icon and the footer's social icons are not changed.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
