# Feature Specification: OK Button Like Send

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "To improve consistency, let's style the Done button like the Send button, except without the arrow. Change the text and all references from Done to OK. The button also has a cosmetic and accessibility issue. When you click the Send button by hitting the space bar, the focus on the Done button works every time. But when you click the Send button with the mouse, the Done button does not get the focus. Make sure the autofocus works 100% of the time on the OK button after styling it like the Send button."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The confirmation button is an OK button that looks like Send (Priority: P1)

A visitor sends the contact form and sees the "Request received" confirmation. The button under the
message now says "OK" instead of "Done", and it is styled like the Send button: the same gold fill, size,
text, corner rounding, thin black ring with the gold ring around it, hover, focus, and press effects. It
has no arrow. It is only as wide as its text, with no set width, and it is centered in the popup, as Send
is. Pressing it closes the popup, as before.

**Why this priority**: This is the change the owner asked for. The popup's two main buttons should read
as the same kind of button.

**Independent Test**: Send the form, then compare OK with Send (see spec 035) at rest, on hover, on
keyboard focus, and while pressed. Every part matches except that OK has no arrow and its text is
"OK". Nothing on the page or in the popup says "Done" any more.

**Acceptance Scenarios**:

1. **Given** the confirmation is showing, **When** the visitor looks at the button, **Then** it reads
   "OK", has no arrow, and has the same fill, text size, corner rounding, rings, and side padding as
   Send.
2. **Given** the same screen, **When** the visitor looks at the button's width, **Then** it fits its
   text, is not stretched, and is centered in the popup.
3. **Given** the visitor hovers over, tabs to, or presses OK, **When** the state changes, **Then** it
   changes the same way Send does (brighter gold on hover and focus, 2 pixels right and down while
   pressed).
4. **Given** the visitor presses OK, **When** the click completes, **Then** the popup closes and focus
   returns to where it was before the popup opened, as before.
5. **Given** the confirmation is showing, **When** a screen reader reads the button, **Then** its name
   is "OK".

---

### User Story 2 - OK has the keyboard focus every time the confirmation appears (Priority: P1)

When the form is sent from the keyboard (Enter, or Space on the Send button), the OK button gets the
keyboard focus right away. When the form is sent with a mouse click, it does not always get the focus.
The visitor can send the form either way, and after either one the OK button has the focus, with no
exceptions, so a keyboard or screen reader user can press Enter or Space to close the popup at once.

**Why this priority**: The owner reports it as both a cosmetic and an accessibility problem. A visitor
who sends with the mouse and then switches to the keyboard gets no focus ring and has to Tab to find
the button.

**Independent Test**: Send the form by clicking Send with the mouse, then check which element has the
focus. Repeat sending with the Space bar and with Enter in a field. Repeat each way many times and in
every browser the project tests. OK has the focus every time.

**Acceptance Scenarios**:

1. **Given** the form is filled in, **When** the visitor clicks Send with the mouse, **Then** the OK
   button has the keyboard focus as soon as the confirmation shows, with its focus ring visible.
2. **Given** the same form, **When** the visitor sends with the Space bar on Send, or with Enter in a
   field, **Then** the OK button has the focus, the same as in scenario 1.
3. **Given** the confirmation is showing with focus on OK, **When** the visitor presses Tab or
   Shift+Tab, **Then** focus moves only between OK and Close, as before.
4. **Given** the visitor opens, sends, and closes the popup again and again, **When** they send each
   time, **Then** OK has the focus every time, not just the first.

---

### Edge Cases

- A touch tap on Send counts as a mouse click for this purpose: OK has the focus after it too.
- Sending twice quickly, or clicking Send while it is already disabled, does not change where focus
  ends up.
- The Close button (X) is a separate button and does not change.
- Send, Contact Us, and every other button do not change.
- The word "Done" may remain in earlier specs that record the history of unrelated work, but not where
  it names this button (see FR-006).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The confirmation button MUST read "OK" and have the accessible name "OK".
- **FR-002**: The OK button MUST have the same styling as Send in every state (rest, hover, keyboard
  focus, pressed), apart from the arrow, which it MUST NOT have.
- **FR-003**: The OK button MUST NOT have a set width and MUST NOT be stretched. It MUST be sized by its
  text and centered in the popup, as Send is.
- **FR-004**: The OK button MUST have the keyboard focus whenever the confirmation appears, however the
  form was sent (mouse click, touch tap, Space on Send, Enter in a field), in every browser the project
  tests, with no exceptions.
- **FR-005**: Pressing OK MUST close the popup and return focus to where it was before the popup
  opened, and focus MUST stay between OK and Close while the confirmation is showing, as before.
- **FR-006**: Every reference to the "Done" button MUST say "OK": the screen text, the code and its
  comments, the tests, the design document, and the specs and companion files that name this button.
- **FR-007**: Send, Close, Contact Us, and every other button MUST NOT change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of at least 20 sends by mouse click, and 20 each by Space and by Enter, in each
  tested browser, the OK button has the keyboard focus when the confirmation appears.
- **SC-002**: OK and Send have the same side padding, text size, corner rounding, fill color,
  and rings in every state, and OK has no arrow. (OK is about 2 pixels shorter, only because it has no arrow icon to set the line height.)
- **SC-003**: At 360, 768, and 1280 pixels wide, OK is centered in the popup, within 1 pixel, and is
  less than half the popup's width.
- **SC-004**: A search for the "Done" button's name in the code, tests, and current documents finds 0
  matches; earlier specs that name the button say "OK".
- **SC-005**: All existing automated tests pass after the change, with their wording updated.

## Assumptions

- The cause of the missed focus is not yet known. The owner sees it with the mouse and not with the
  keyboard, so it likely depends on how the browser handles focus when the clicked button is replaced by
  the confirmation. Finding the cause and fixing it is part of this work (SC-001 is the test).
- "Styled like the Send button" means everything spec 035 gives Send: the gold fill, size, rings, and
  hover, focus, and press effects. OK replaces the glossy black look it has now, which it shared with
  Close. Close keeps that look.
- OK has no halo, because Send has none.
- Where text outside the button uses the ordinary word "done" (for example, "this is done" in an as-built
  spec), it is not a reference to the button and stays.
- This is a small change to the live site. Implement directly; no plan or tasks needed.
