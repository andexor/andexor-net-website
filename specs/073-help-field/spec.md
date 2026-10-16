# Feature Specification: How Can We Help You Field

**Feature Branch**: `71-help-field`

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "Add a new field to the Contact Us form, just under the website field. It is a textarea with
4 rows. The label says "How can we help you?". The name and id is "help". Give it all the same look and behavior as the
other text fields." Later addition: "Set the maxlength for this field to 1000 characters" (later lowered to 250: "1000
characters is too much"). "Add JavaScript to count the
characters and show it as "X/250", right-justified on the same line as the label, in Source Code Pro. The label does
not take up the full width. Wrap the label and counter in a div whose background fills from the left, X percent of the
way across, like a progress bar. The color is subtle and the label and counter stay visible at all times."

Follows spec 070 (the form's fields and order), the field renames (Name, Email, Phone, Website), and spec 071 (the
request also carries the source page).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A visitor says what they need in their own words (Priority: P1)

The Contact Us form reads, top to bottom: Name, Email, Phone, Website, then a larger box labelled "How can we help
you?" that is four lines tall. A visitor who wants to can type a sentence or a paragraph there before pressing Send.
A visitor who does not can leave it empty and send the form as before. The new box looks like the other fields: same
label style, border, background, hover, and gold focus ring.

**Why this priority**: This is the owner's whole request. The company learns what the prospect wants before the first
call, and the visitor is not forced to pick from a list.

**Independent Test**: Open the Contact Us popup. Below Website there is a four-line box labelled "How can we help you?".
Type in it, fill Name and Email, press Send, and see "Request received".

**Acceptance Scenarios**:

1. **Given** the popup is open, **When** the form is read top to bottom, **Then** the fields are Name, Email, Phone,
   Website, "How can we help you?", and the new field is directly under Website.
2. **Given** the popup is open, **When** the new field is looked at, **Then** it is a multi-line box four lines tall,
   its label reads "How can we help you?", and its name and id are "help".
3. **Given** the popup is open, **When** the visitor moves the pointer over the box, **Then** the border changes as it
   does on the other fields, and **When** the box has focus, **Then** it shows the same gold focus ring.
4. **Given** the popup is open, **When** the visitor presses Tab from Website, **Then** focus goes to the new box, then
   to the Privacy link, the Terms link, and the Send button as before.
5. **Given** the visitor types several lines in the box, **When** they press Enter inside it, **Then** a new line is
   started and the form is not sent; **When** they press Send, **Then** the form sends with the text.
6. **Given** the visitor fills only Name and Email, **When** they press Send, **Then** the form sends and "Request
   received" is shown: the new field is optional and its label has no asterisk.
7. **Given** text was typed in the new box and the popup was closed or the form sent, **When** the popup is opened
   again, **Then** the box is empty.
8. **Given** the popup is open with focus in the box, **When** the visitor presses Esc, **Then** the popup closes on the
   first press (spec 015).
9. **Given** the box is empty, **When** the popup is displayed, **Then** the label sits at the left of its line, the
   counter "0/250" sits at the right end of the same line, and the strip behind them has no fill.
10. **Given** the visitor types or pastes text, **When** the text changes, **Then** the counter shows the number of
    characters typed over 250 (for example "100/250") and the strip behind the label and counter is filled from its
    left edge to the same percentage of its width (two fifths filled at "100/250").
11. **Given** the box holds 250 characters, **When** the visitor types or pastes more, **Then** nothing more is
    accepted, the counter reads "250/250", and the strip is completely filled.
12. **Given** the strip is filled to any amount, **When** the label and counter are read, **Then** both stay clearly
    legible, and the fill is a quiet tint that does not draw the eye away from the form.

---

### Edge Cases

- The box is optional. An empty box sends an empty value, as the Phone and Website fields do.
- Text longer than 250 characters cannot be typed or pasted. A longer paste is cut at 250, and the counter and strip
  show the full limit. The visitor can drag the box taller, but not wider than the form (vertical only), so it never
  breaks the popup's layout.
- Deleting text lowers the counter and the strip at once. The strip's fill moves smoothly, and not at all for a
  visitor who has asked their system for reduced motion.
- The counter counts characters the way the limit does, so what it shows is always the number the limit is measured in.
  A line break counts as one.
- On a small phone the popup is taller by one field. The popup's existing rules for fitting the screen and scrolling
  apply unchanged.
- Pasted text with line breaks keeps its line breaks.
- The box has no example text inside it. The label alone says what it is for.
- The request is still not persisted or transmitted anywhere (spec 001 FR-018).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us form MUST contain a multi-line text field directly under Website and above the note, with
  the label "How can we help you?", the name "help", and the id "help".
- **FR-002**: The field MUST show four lines of text without scrolling.
- **FR-003**: The field MUST look and behave like the other text fields: the same label style and color, background,
  border, corner radius, text size and color, hover border, and gold focus ring, with the focus ring and border
  described in the design system and in spec 001. It MAY be resized by the visitor in height only.
- **FR-012**: The field MUST accept at most 250 characters, enforced by the browser's own length limit on the box
  (`maxlength`), with no script needed to stop extra input.
- **FR-013**: A counter MUST show the current length and the limit as "X/250", updating as the text changes, set in
  Source Code Pro (the site's monospace font) at the site's base text size (16 pixels), right-justified on the same line as the label.
- **FR-014**: The label MUST be only as wide as its text, not the full width of the field, so the counter can share its
  line. The label and counter MUST be wrapped in one strip (a div) that spans the field's width.
- **FR-015**: The strip's background MUST be filled from its left edge to X percent of its width, where X is the length
  over 250, as a progress bar. The fill MUST be a subtle tint of the site's palette, and the label and counter MUST
  stay legible against it at every fill amount (the automated accessibility check reports no contrast violation).
- **FR-016**: The counter MUST be read to a screen reader when the box gets focus (the box is described by it) and MUST
  NOT be announced on every keystroke.
- **FR-004**: The field MUST be optional: no required marking, no asterisk, and the form MUST send without it.
- **FR-005**: Keyboard Tab order MUST be Name, Email, Phone, Website, "How can we help you?", then the Privacy and Terms
  links and the Send button, with the existing popup focus trap including the new field. Enter inside the field MUST
  start a new line and MUST NOT send the form.
- **FR-006**: The sent request MUST carry the field's text as `help`, an empty string when blank. The other five values
  are unchanged.
- **FR-007**: The field MUST be empty each time the popup is displayed (spec 001 FR-013), and the popup MUST still open
  with focus on Name.
- **FR-008**: The label MUST be tied to the field, so the field's accessible name is "How can we help you?".
- **FR-009**: Tests MUST check the field's presence, label, name, id, four lines, optional status, position under
  Website, Tab order, that Enter does not send, that the request carries `help`, and that it is empty on reopen. Tests
  MUST NOT count anything other than the four lines and the 250 characters the owner asked for.
- **FR-010**: The design documents and UI kit (`design/README.md`, `design/ui_kits/marketing-site/`,
  `design/_ds_bundle.js`) MUST list the new field, and spec 001's Contact Request description MUST include `help`.
- **FR-011**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Contact Request**: gains `help` (string, optional, free text). Its attributes become name, email, phone, website,
  help, and source path.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can describe their need in several sentences in the form, and the company receives it with the
  request.
- **SC-002**: A visitor who ignores the new box sends the form on the first try, as before.
- **SC-003**: The new box is indistinguishable from the other fields in style and in hover and focus behavior, apart
  from its height.
- **SC-005**: A visitor always knows how much of the 250 characters they have used, from the number and from the fill.
- **SC-004**: Every control in the popup is reachable by keyboard in the new order, and the automated accessibility
  check reports no new violation.

## Assumptions

- Optional is assumed, as it is the least in the way of sending the form. The owner can make it required later.
- The limit is 250 characters, the owner's number (first set at 1000, then lowered). It is counted in the browser's own units (UTF-16 code units), so a
  few characters, such as some emoji, count as two. The submitted text counts a line break as two characters in the
  browser's own measure; the counter and the limit use one.
- The fill is a tint of the form's blue, a shade lighter than the popup behind it. Near the limit (90 percent or more)
  it turns a warm gold tint, as a quiet warning. The owner can change the colors or drop the warning.
- No placeholder text and no autofill hint are set; free text has no matching autofill type.
- Resizing is allowed vertically only, because a box that can be dragged wider would spill out of the popup.
- The label's question mark is part of the label, as written by the owner.
