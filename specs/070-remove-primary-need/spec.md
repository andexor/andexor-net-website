# Feature Specification: Remove Primary Need

**Feature Branch**: `55-add-customer-phone-number-to-the-contact-us-form`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Remove the Primary need field from the Contact Us form."

Follows specs 068 and 069, which left the Contact Us form as Full name, Work email, Primary need, Phone number, Company
website, with the first three required and marked with an asterisk. The Primary need field is the grouped list of
services (spec 001 FR-009, groups renamed in specs 012 and 013) that a visitor had to pick from before sending. Spec 015
gave it special treatment: while the list is expanded, Esc closes the list and not the popup.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A visitor sends the form without choosing a service (Priority: P1)

The Contact Us form reads, top to bottom: Full name, Work email, Phone number, Company website. There is no Primary need
field, no list of services to pick from, and no asterisk on anything but Full name and Work email. A visitor types their
name and email, optionally a phone number and website, presses Send, and sees "Request received" as today. Nothing else
about the popup changes: the header, the close button, the note with its Privacy and Terms links, the Send button, and
the confirmation are as they are.

**Why this priority**: This is the owner's whole request. Dropping the list removes a decision the visitor had to make
before sending, and the company learns the need when it follows up.

**Independent Test**: Open the Contact Us popup from the home page. The fields read, top to bottom: Full name, Work
email, Phone number, Company website. Fill the first two, press Send, and see "Request received".

**Acceptance Scenarios**:

1. **Given** the Contact Us popup is open, **When** the form is read top to bottom, **Then** the fields are Full name,
   Work email, Phone number, Company website, and no field, label, or list named "Primary need" is present.
2. **Given** the popup is open, **When** the visitor presses Tab from Work email, **Then** focus goes to Phone number,
   then to Company website, then on to the Privacy link, the Terms link, and the Send button as before.
3. **Given** the popup is open, **When** the labels are read, **Then** only Full name and Work email end with an
   asterisk; Phone number and Company website have none.
4. **Given** the popup is open, **When** the visitor fills Full name and Work email and presses Send without touching
   the two fields below, **Then** the form sends and "Request received" is shown, with no prompt to pick a service.
5. **Given** the popup is open, **When** the visitor leaves Full name or Work email blank and presses Send, **Then** the
   browser still stops the send and points at the empty required field (spec 001 FR-010).
6. **Given** the popup was closed or the form was sent, **When** it is opened again, **Then** every field is empty and
   in the same order, with focus on Full name.
7. **Given** the popup is open with focus anywhere inside it, **When** the visitor presses Esc, **Then** the popup
   closes on the first press (spec 015). There is no longer any list whose expansion would take the first Esc.

---

### Edge Cases

- The sent request no longer carries a primary need. The service the prospect wants is learned in the follow-up
  conversation, which the confirmation text already promises ("A strategist will review your site and contact you
  soon").
- Spec 015's rule that Esc closes an expanded Primary need list, not the popup, has nothing left to apply to. The
  behavior, its tests, and its description in the design documents go with the field. Esc otherwise behaves exactly as
  spec 015 says.
- The list of services behind the field (the Technical Services and Business Services groups of specs 012 and 013) was
  used only by this field. It is removed with the field; the service cards on the home page have their own copy and are
  not affected.
- The form is shorter, so on a small phone the panel fits with less or no scrolling. Nothing about the panel's size
  rules changes.
- The design documents, the UI kit and its compiled copy, and the spec 001, 068, and 069 descriptions of the form list
  the Primary need field and say three fields are required. They are updated to the four-field form with two required
  fields, as the site's rules ask for documents that disagree with the current behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us form MUST NOT contain a Primary need field, label, or list of services. This supersedes
  spec 001 FR-009 and the parts of specs 012, 013, 068, and 069 that describe the field.
- **FR-002**: The form MUST present its fields in this order: Full name, Work email, Phone number, Company website.
  Keyboard Tab order MUST follow that order, then continue to the Privacy and Terms links and the Send button as today.
- **FR-003**: Only Full name and Work email MUST be required, and only their labels MUST show the asterisk (spec 068
  FR-011 and FR-012). Phone number and Company website stay optional and unmarked.
- **FR-004**: A form sent with Full name and Work email filled MUST send and show "Request received", whether or not
  Phone number and Company website are filled.
- **FR-005**: Nothing else about the remaining fields MUST change: labels, placeholders, input types, the asterisks on
  the two required labels, the note, the Send button, the confirmation, and the popup's header stay as they are.
- **FR-006**: Esc MUST close the popup on the first press wherever focus is inside it (spec 015 User Stories 1 and 2).
  The special case for an expanded Primary need list (spec 015 User Story 3 and its requirements) is withdrawn with the
  field, and no trace of it MUST remain in the popup's behavior.
- **FR-007**: The popup MUST still open with focus on Full name and still clear every field on reopen (spec 001
  FR-013).
- **FR-008**: The sent request MUST carry full name, work email, phone number, and company website, and no primary
  need. As in spec 001, the request is not persisted or transmitted anywhere yet.
- **FR-009**: Tests MUST check that no field, label, or list named "Primary need" is in the popup, that the field order
  is Full name, Work email, Phone number, Company website, that only Full name and Work email are required and
  asterisked, and that the form sends with only those two filled. Every existing test that selects a primary need, walks
  the old order, or checks the Esc-in-an-open-list behavior MUST be updated or removed. Tests MUST NOT count anything.
- **FR-010**: The design documents and UI kit that list the fields (`design/README.md`,
  `design/ui_kits/marketing-site/`, `design/_ds_bundle.js`) and the spec 001, 068, and 069 texts that describe the
  field MUST be updated to the four-field form, in the style spec 001 already uses for superseded requirements.
- **FR-011**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Contact Request**: a prospective customer's inquiry submitted through the Contact Us popup. Its attributes become
  full name, work email, phone number (optional), and company website (optional). Primary need is dropped.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor who opens the popup sees four fields and no list of services, with the two asterisked fields
  first, on every screen size the site supports.
- **SC-002**: A visitor who fills only Full name and Work email sends the form on the first try, with no validation
  prompt.
- **SC-003**: A visitor who presses Esc anywhere inside the open popup closes it on the first press, every time.
- **SC-004**: Every interactive element in the popup is reachable by keyboard in the new order, and the automated
  accessibility check reports no new violation.

## Assumptions

- The owner wants the field gone, not hidden or made optional. A hidden required field would block sending, and an
  optional list still asks the visitor for a decision the owner has chosen not to ask for.
- The service list behind the field has no other use on the site and goes with it. If a later feature needs the list
  again, it is recreated from specs 012 and 013.
- The two optional fields keep their relative order (Phone number, then Company website), as spec 069 set it.
- The confirmation text and the note under the form do not change; neither mentions a service.
- No "Something else" or free-text replacement is added. The owner asked only for a removal.
