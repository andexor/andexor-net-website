# Feature Specification: Contact Source Page

**Feature Branch**: `59-record-originating-page-in-contact-form`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Add a hidden field to the Contact Us form, set to the path of the page that opened the
popup. The popup reads the path itself when it opens; triggers do not pass it. It is "/" for the home page, and other
paths fill in automatically when the Contact Us call to action is added to other pages."

Follows spec 014 (one Contact Us popup rendered once in the root layout, opened through `useContact()`) and spec 070
(the form's four visible fields and the `ContactRequest` shape).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The company learns which page a prospect was on (Priority: P1)

A visitor opens the Contact Us popup from any page and sends the form. The request carries one more value, the path of
the page behind the popup: "/" for the home page, "/web-development" for the Web Development page. The visitor sees
nothing new: no field, no label, no change to the popup.

**Why this priority**: This is the owner's whole request. The path tells the sales team which page prompted the
inquiry.

**Independent Test**: Open the popup from the home page, fill Full name and Work email, press Send, and see that the
request handed to the submit handler has `sourcePath` equal to "/".

**Acceptance Scenarios**:

1. **Given** the home page, **When** the popup is opened and the form is sent, **Then** the request's `sourcePath` is
   "/".
2. **Given** a content page such as `/web-development`, **When** a Contact Us trigger there opens the popup, **Then**
   the request's `sourcePath` is that page's path, with no change to the trigger's code.
3. **Given** the popup was opened on one page, closed, and the visitor then navigated to another page, **When** the
   popup is opened again, **Then** `sourcePath` is the new page's path, not the earlier one.
4. **Given** the popup is open, **When** the form is read by a visitor or a screen reader, **Then** no new visible
   field, label, or Tab stop is present.

---

### Edge Cases

- The popup lives in the root layout and stays mounted across navigations, so the path is read each time the popup
  opens, never once when the page loads.
- The path is supplied by the visitor's browser and can be altered. It is a hint for the sales team, not trusted data,
  and whatever receives the request must validate it.
- Outside the app router (a unit test with no router), there is no path. The popup then uses "/" so the field is never
  empty.
- The request is still not persisted or transmitted anywhere (spec 001 FR-018).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us form MUST contain a hidden input named `sourcePath` holding the pathname of the page at
  the moment the popup opened ("/" for the home page).
- **FR-002**: `ContactProvider` MUST read the pathname (Next's `usePathname()`) when `openContact` runs and pass it to
  `ContactPopup`. `openContact` MUST NOT take the path as a parameter, so a new trigger on any page needs no extra code.
- **FR-003**: The value MUST be read each time the popup opens, not once at page load.
- **FR-004**: The request handed to `onSubmit` MUST carry `sourcePath`. The other four values are unchanged.
- **FR-005**: The popup's visible content, labels, Tab order, focus handling, and reset-on-reopen behavior MUST NOT
  change. The hidden input is not focusable and has no label.
- **FR-006**: Tests MUST check that the request carries "/" from the home page, that a different pathname is carried
  when the popup opens on another page, that the value follows the page on a later open, and that the hidden input adds
  no visible field. Tests MUST NOT count anything.
- **FR-007**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Contact Request**: gains `sourcePath` (string, always set, not entered by the visitor). Its attributes become full
  name, work email, phone number, company website, and source path.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every request sent from the popup carries the path of the page it was opened on.
- **SC-002**: Adding a Contact Us trigger to a new page needs no code beyond calling `openContact()`.
- **SC-003**: A visitor sees no difference in the popup.

## Assumptions

- The pathname, not the page title, is the key: it matches the Markdown content routes and does not change when copy is
  reworded.
- A trigger that needs to override the value (for example "contact us about one service") is out of scope; an optional
  argument can be added when one exists.
- The query string and fragment are not recorded; only the pathname is.
