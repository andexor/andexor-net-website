# Feature Specification: Esc Closes the Contact Us Popup

**Feature Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Allow the user to dismiss the Contact Us popup by pressing the Esc button on the keyboard."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Esc closes the popup (Priority: P1)

A visitor has opened the Contact Us popup, changes their mind, and presses Esc. The popup closes and
they are back on the page exactly where they were, as if they had used the close button.

**Why this priority**: Dismissing a dialog with Esc is what keyboard users, and many mouse users,
expect. Today the only ways out are the close button, "Done", and clicking outside the panel.

**Independent Test**: Open the popup from any "Contact Us" button and press Esc. The popup closes.

**Acceptance Scenarios**:

1. **Given** the popup is open showing the empty form, **When** the visitor presses Esc, **Then** the
   popup closes.
2. **Given** the popup is open and the visitor has typed into some fields, **When** they press Esc,
   **Then** the popup closes and the typed text is discarded, exactly as with the close button.
3. **Given** the popup is showing the "Request received" confirmation, **When** the visitor presses
   Esc, **Then** the popup closes, as with "Done".
4. **Given** the popup was closed with Esc, **When** the visitor opens it again from any "Contact Us"
   button, **Then** it shows the empty form, as it does after any other way of closing.
5. **Given** the popup is open, **When** the visitor presses Esc, **Then** the page behind it does not
   scroll, navigate, or change.

---

### User Story 2 - Esc works wherever focus is (Priority: P1)

The visitor does not have to click into the popup first. If they opened it with the keyboard, or by
mouse, and focus is on the page, on a field, or on a button inside it, Esc closes it.

**Why this priority**: A shortcut that works only after a click into the panel would fail for the very
keyboard users it is meant for.

**Independent Test**: Open the popup by keyboard (Tab to the hero button, press Enter), then press Esc
without touching anything else. It closes. Repeat after clicking into a text field.

**Acceptance Scenarios**:

1. **Given** the popup was opened from the keyboard and focus has not moved, **When** the visitor
   presses Esc, **Then** the popup closes.
2. **Given** focus is in a text field inside the popup, **When** the visitor presses Esc, **Then** the
   popup closes.
3. **Given** focus is on the close button or the "Send" button, **When** the visitor presses Esc,
   **Then** the popup closes.

---

### User Story 3 - Esc does nothing when the popup is closed, and does not interfere with the dropdown (Priority: P2)

When the popup is not open, Esc has no effect on the site. When the visitor has the "Primary need"
list open, Esc closes that list first, the way it does in any browser, and does not also close the
popup. A second Esc closes the popup.

**Why this priority**: These are the two places the new shortcut could do something unwanted. They
protect the rest of the page and the form, but the main behavior works without them.

**Independent Test**: With the popup closed, press Esc anywhere on the site and see nothing happen.
With the popup open, open the "Primary need" list and press Esc: only the list closes.

**Acceptance Scenarios**:

1. **Given** the popup is closed, **When** the visitor presses Esc, **Then** nothing on the page
   changes.
2. **Given** the popup is open with the "Primary need" list expanded, **When** the visitor presses
   Esc, **Then** the list closes and the popup stays open.
3. **Given** the same popup after the list has closed, **When** the visitor presses Esc again,
   **Then** the popup closes.

---

### Edge Cases

- The popup can be opened from the hero button, the call-to-action band button, and (once spec 014 is
  built) the footer, on any page. Esc works the same for every one of them.
- Pressing Esc repeatedly, or holding it, closes the popup once and does nothing after that.
- Esc after a valid "Send", while the "Request received" message shows, closes the popup and leaves no
  message behind.
- Esc does not submit the form and does not send anything.
- The close button, "Done", and clicking outside the panel keep working as before.
- Other keys are unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: While the Contact Us popup is open, pressing Esc MUST close it, whether it shows the form
  or the confirmation.
- **FR-002**: Esc MUST close the popup wherever keyboard focus is: on the page behind it, in a field,
  or on a button in the popup.
- **FR-003**: Closing with Esc MUST have the same result as the close button: the typed text is
  discarded, nothing is submitted, and reopening the popup shows the empty form.
- **FR-004**: While the popup is closed, Esc MUST have no effect on the site.
- **FR-005**: When the "Primary need" list is expanded, Esc MUST close only the list. A further Esc
  MUST then close the popup.
- **FR-006**: Pressing Esc MUST NOT scroll, navigate, or otherwise change the page behind the popup.
- **FR-007**: The close button, "Done", and clicking outside the panel MUST keep working as before, and
  the popup's look and fields MUST be unchanged.
- **FR-008**: Automated tests MUST cover Esc closing the popup from the form and from the confirmation,
  Esc with focus in a field, Esc doing nothing when closed, and reopening to an empty form.

### Key Entities

- **Contact Us popup**: The dialog defined in spec 001. This feature adds one more way to close it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of automated checks, one press of Esc closes an open popup, from the form, the
  confirmation, and with focus in a field.
- **SC-002**: A visitor who opened the popup by keyboard can close it by keyboard in one key press,
  without using a mouse.
- **SC-003**: With the popup closed, pressing Esc changes nothing on the home page or a content page.
- **SC-004**: After closing with Esc, reopening shows the empty form in 100% of checks.
- **SC-005**: The existing ways to open and close the popup keep passing their tests.

## Assumptions

- Esc closes the popup immediately, even with text typed in, with no "discard changes?" question,
  because the close button and clicking outside already do the same.
- The popup's focus behavior on opening is unchanged. Returning focus to the button that opened the
  popup is specified in spec 014 (FR-004) and is not repeated here; if spec 014 is built, Esc closes
  the popup and focus returns like any other close.
- "Esc" means the Escape key on a keyboard. Touch devices have no equivalent and are unaffected.
- This adds one way to close the popup; it does not add focus trapping or other dialog keyboard
  behavior, which are outside this request.
- This amends spec 001's popup behavior and spec 014's note that Esc does not close the popup. Both
  must be updated to match.
