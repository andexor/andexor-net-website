# Feature Specification: Footer "Contact Us" Opens the Contact Form

**Feature Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "In the footer, replace "Contact" with "Contact Us" and change the link behavior so it triggers the same action that the "Contact Us" buttons do on the home page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The footer's "Contact Us" opens the contact form (Priority: P1)

A visitor who has scrolled to the bottom of the home page and wants to get in touch activates
"Contact Us" in the Company column of the footer. The same Contact Us popup opens that the buttons
in the hero and the call-to-action band open, with the same fields, the same behavior, and the same
way to close it.

**Why this priority**: Today the footer's "Contact" does nothing, so the visitor who has read the whole
page and is ready to reach out has no way to do it from where they are.

**Independent Test**: On the home page, activate "Contact Us" in the footer. The Contact Us popup
opens. Compare with the hero's "Contact Us" button: the popup is identical.

**Acceptance Scenarios**:

1. **Given** the home page, **When** a visitor activates "Contact Us" in the footer, **Then** the
   Contact Us popup opens.
2. **Given** the popup opened from the footer, **When** the visitor fills in the required fields
   and submits, **Then** they see the same confirmation as when it is opened from the hero.
3. **Given** the popup opened from the footer, **When** the visitor closes it (the close button, "OK"
   after sending, or a click outside), **Then** it closes and they are back where they were on the page.
4. **Given** a keyboard user, **When** they tab to the footer's "Contact Us" and press Enter or
   Space, **Then** the popup opens, and closing it returns focus to that footer item.

---

### User Story 2 - The footer entry reads "Contact Us" (Priority: P1)

The Company column of the footer lists "About Us" and "Contact Us". The entry reads "Contact Us",
matching the buttons on the home page and the popup's title, and it looks like the other footer
entries: same type, same color, color change on hover, no underline.

**Why this priority**: The label is part of the same request, and the footer should call the action
what the rest of the site calls it.

**Independent Test**: View the footer on any page. The second Company entry reads exactly "Contact
Us", and it is styled like "About Us".

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** it is viewed, **Then** the Company column shows
   "About Us" and "Contact Us", and no entry reads just "Contact".
2. **Given** a visitor hovering the entry, **When** the pointer is over it, **Then** its color
   changes like the other footer entries and it is not underlined.

---

### User Story 3 - "Contact Us" in the footer on the other pages (Priority: P2)

The footer is also shown on the content pages (such as Web Development) and the "Page not found"
page, where the Contact Us popup does not exist today. A visitor there who activates the footer's
"Contact Us" gets the same contact popup, opened on the page they are already reading, with no
navigation. The popup is therefore available on every page that shows the footer.

**Why this priority**: The footer is the same on every page, so a "Contact Us" that works on only one
of them would look broken on the others. The home page case delivers the value on its own.

**Independent Test**: From the Web Development page and the "Page not found" page, activate the
footer's "Contact Us". The same Contact Us popup opens on that page, and the address does not
change.

**Acceptance Scenarios**:

1. **Given** a content page, **When** a visitor activates the footer's "Contact Us", **Then** the
   Contact Us popup opens on that page and the address does not change.
2. **Given** the "Page not found" page, **When** a visitor activates the footer's "Contact Us",
   **Then** the Contact Us popup opens on that page.
3. **Given** the popup opened on a content page, **When** the visitor closes it, **Then** they are
   back where they were on that page, and focus returns to the footer's "Contact Us".

---

### Edge Cases

- The popup is already open: the footer is behind it and cannot be activated; there is nothing to
  handle.
- A visitor activates the footer's "Contact Us" twice in a row after closing the popup: it opens
  each time.
- "Contact Us" opens the popup and does not navigate: the address does not change, and the page
  does not scroll or jump.
- Privacy, Terms, the social links, and the other footer entries are unchanged.
- The footer keeps its look: no underline at rest, on hover, or on focus, and hover is a color
  change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer's second Company entry MUST read "Contact Us", not "Contact", on every page
  that shows the footer.
- **FR-002**: On the home page, activating the entry (mouse, touch, Enter, or Space) MUST open the same
  Contact Us popup that the hero and call-to-action band buttons open, with the same fields,
  validation, confirmation, and ways to close it.
- **FR-003**: Activating the entry MUST NOT navigate away, change the address, or scroll the page.
- **FR-004**: Closing the popup that was opened from the footer MUST return keyboard focus to the
  footer's "Contact Us" entry.
- **FR-005**: On every other page that shows the footer (content pages and the "Page not found"
  page), activating the entry MUST open the same Contact Us popup on that page, with the same
  behavior as on the home page (FR-002 to FR-004).
- **FR-006**: The entry MUST be announced to assistive technology as something that opens a dialog,
  not as a link to another page, and MUST be reachable and operable by keyboard.
- **FR-007**: The entry MUST look like the other footer entries: same type and color, a color change
  on hover, a visible focus ring, and no underline at rest, on hover, or on focus.
- **FR-008**: The other footer entries (services, About Us, Privacy, Terms, social links) MUST be
  unchanged.
- **FR-009**: Automated tests MUST cover the label, opening the popup from the footer, and closing
  it with focus returning to the footer entry. Tests that expect the old "Contact" placeholder MUST
  be updated.

### Key Entities

- **Contact Us action**: The single "open the contact form" action, triggered by the hero button, the
  call-to-action band button, and now the footer entry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the home page, 3 of 3 "Contact Us" triggers (hero, call-to-action band, footer) open
  the same popup.
- **SC-006**: On the content pages and the "Page not found" page, the footer's "Contact Us" opens the
  same popup in 3 of 3 pages checked (home, Web Development, "Page not found").
- **SC-002**: A visitor can open the contact form from the footer with one click or one key press.
- **SC-003**: On every page, 0 footer entries read just "Contact".
- **SC-004**: Closing the popup from the footer returns focus to the footer entry in 100% of the
  automated checks.
- **SC-005**: The footer looks the same as before, apart from the new label; 0 underlined links.

## Assumptions

- The footer entry becomes a button that looks like the other footer entries, since it opens a
  dialog and does not go to a page (see FR-006). The site's rule against link underlines applies
  to it as well.
- The popup is available on every page that shows the footer, so it is no longer specific to the home
  page. Its fields, confirmation, and closing behavior stay as defined in spec 001. Content pages
  stay Markdown; the popup is part of the shared page shell, not the page's content.
- Closing on Escape is specified in spec 015, not here; this feature uses the same popup with the same
  ways to close. Returning focus to the control that opened it is added (FR-004), and
  it applies to every trigger, including the hero and call-to-action band buttons, since they share
  the mechanism.
- "Same action" means the same popup component, so the popup's fields, confirmation, and closing
  behavior are not redefined here.
- This amends spec 010 and spec 001, which say "Contact" is a placeholder link (`#contact`) and
  "Contact, Privacy, and Terms remain placeholders". They must be updated to match.
- "Privacy" and "Terms" stay placeholders; they are outside this request.
