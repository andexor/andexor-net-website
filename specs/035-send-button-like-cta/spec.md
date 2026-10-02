# Feature Specification: Send Button Like Contact Us

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "Let's make all of the styling and behavior of the Send button be just like the Contact Us button, only without the halo. This includes removing the 100% width rule."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send looks and feels like Contact Us, without the halo (Priority: P1)

A visitor opens the contact popup. The Send button now looks like the Contact Us button on the home
page: the same gold fill, the same size and text, the same arrow, the same thin black ring with a gold
ring around it at rest. It does not have the hazy gold halo that surrounds Contact Us. It is no longer
stretched across the full width of the popup; it is only as wide as its label and arrow, like Contact Us,
and it is centered on the form, the way Contact Us and OK are centered.

**Why this priority**: This is the change the owner asked for. The two main buttons on the site should
read as the same button.

**Independent Test**: Open the contact popup and the home page side by side. Compare Send with Contact Us
at rest, on hover, on keyboard focus, and while pressed. Every part matches except that Send has no halo.

**Acceptance Scenarios**:

1. **Given** the contact popup is open, **When** the visitor looks at Send, **Then** it has the same
   fill, text, arrow, size, corner rounding, and ring (thin black, then gold) as Contact Us, and no halo.
2. **Given** the same popup at any window width, **When** the visitor looks at Send, **Then** it is only
   as wide as its content and does not stretch to the width of the form.
3. **Given** the visitor hovers over Send, **When** the pointer is over it, **Then** it changes the same
   way Contact Us does on hover.
4. **Given** the visitor tabs to Send, **When** it has keyboard focus, **Then** it shows the same focus
   look as Contact Us, without the halo.
5. **Given** the visitor presses Send, **When** the press is held, **Then** it moves 2 pixels right and
   2 pixels down, the same as Contact Us.
6. **Given** the form is being submitted, **When** the Send button is disabled, **Then** it still shows
   as disabled and does not move when pressed.

---

### Edge Cases

- At phone width the popup is narrow. Send keeps its natural width and still fits inside the popup.
- The form's other behavior is unchanged: validation, the disabled state while sending, the order of Tab
  stops, and the confirmation that follows.
- The OK button on the confirmation screen is styled like Send by spec 036.
- Contact Us itself, including its halo, does not change.
- Any differences between Send and Contact Us that exist only because of the popup (for example, Send
  being full width) are removed. A new difference must not be introduced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Send MUST have the same visual styling as Contact Us at rest: fill, text, arrow, size,
  corner rounding, and the thin black ring with the gold ring around it.
- **FR-002**: Send MUST NOT have the hazy gold halo that Contact Us has, at rest, on hover, or on focus.
- **FR-003**: Send MUST NOT be stretched to the full width of the form. It MUST be only as wide as its
  content, the same as Contact Us is.
- **FR-004**: Send MUST respond to hover, keyboard focus, and press the same way Contact Us does, apart
  from the halo.
- **FR-005**: Send MUST keep its current behavior: it submits the form, is disabled while the message is
  being sent, and keeps its place in the Tab order.
- **FR-006**: Contact Us and every other button MUST NOT change (the OK button is restyled by spec 036).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Send and Contact Us have the same height, side padding, text size, corner rounding, and fill color, and
  the same black and gold rings, in every state (rest, hover, focus, pressed).
- **SC-002**: Send has no halo in any state; Contact Us still has its halo.
- **SC-003**: At 360, 768, and 1280 pixels wide, Send's width is the width of its label and arrow plus
  the same side padding as Contact Us (so it is narrower than Contact Us only because "Send" is a
  shorter word). Its width is not set by any rule; it is sized automatically by its content.
- **SC-004**: No horizontal scrolling in the popup at 320, 375, 768, and 1920 pixels wide.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- "The Contact Us button" means the call-to-action button in the band near the bottom of the home page.
  It is the only Contact Us button on the page.
- "The halo" means the hazy gold glow around the rings. The thin black ring and the gold ring around it
  are not the halo, so Send keeps them. The focus look already omits the halo and stays as it is.
- With the 100% width rule gone, Send is centered on the form, like the Contact Us and OK buttons.
- This is a small style change to the live site. Implement directly; no plan or tasks needed.
