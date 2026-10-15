# Feature Specification: Required Fields First

**Feature Branch**: `55-add-customer-phone-number-to-the-contact-us-form`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Move the Primary need field to just below the Work email field so that all required fields come first, then the optional fields."

Follows spec 068, which added the optional Phone number field, made Company website optional, and marked required
fields with an asterisk. That left the form as Full name, Work email, Phone number, Company website, Primary need: two
optional fields between the required ones.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Required fields come first (Priority: P1)

The Contact Us form reads, top to bottom: Full name, Work email, Primary need, Phone number, Company website. The three
required fields, each with its asterisk, are together at the top; the two optional fields follow. A visitor in a hurry
fills the top three, picks a service, and sends. Nothing else about the fields changes: labels, placeholders, types,
which are required, the asterisks, the note, and the Send button are as spec 068 left them.

**Why this priority**: This is the owner's whole request. Grouping the required fields first lets a visitor see at once
what the form needs from them and stop reading after it.

**Independent Test**: Open the Contact Us popup from the home page. The fields read, top to bottom: Full name, Work
email, Primary need, Phone number, Company website. Tab from Work email lands on Primary need, then Phone number, then
Company website.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup is open, **When** the form is read top to bottom, **Then** the fields are Full name,
   Work email, Primary need, Phone number, Company website, with Primary need directly after Work email.
2. **Given** the popup is open, **When** the visitor presses Tab from Work email, **Then** focus goes to Primary need,
   then to Phone number, then to Company website, then on to the Privacy link as before.
3. **Given** the popup is open, **When** the labels are read, **Then** the first three end with an asterisk and the last
   two do not, so the required fields form one group at the top.
4. **Given** the popup is open, **When** the visitor fills Full name and Work email, picks a service, and presses Send
   without touching the two fields below, **Then** the form sends and "Request received" is shown.
5. **Given** the popup is open, **When** the Primary need list is expanded and the visitor presses Esc, **Then** the
   list closes and the popup stays open, as before (spec 015); the move does not change that.
6. **Given** the popup was closed or the form was sent, **When** it is opened again, **Then** every field is empty and
   in the same order.

---

### Edge Cases

- The sent request carries the same values whatever the visual order; the order of fields in the request is not part of
  what a visitor sees and need not change.
- Focus on open still goes to Full name, which is still first.
- On a phone, Primary need now sits above the keypad-typed Phone number field; the panel still fits or scrolls as it
  does today.
- The design documents, the UI kit and its compiled copy, and the spec 001 and spec 068 descriptions of the form list
  the fields in the old order. They are updated to the new order, as the site's rules ask for documents that disagree
  with the current behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us form MUST present its fields in this order: Full name, Work email, Primary need, Phone
  number, Company website.
- **FR-002**: Keyboard Tab order MUST follow that order, then continue to the Privacy and Terms links and the Send
  button as today.
- **FR-003**: Nothing else about any field MUST change: labels, placeholders, input types, which fields are required,
  the asterisks on required labels (spec 068), the note, and the Send button stay as they are.
- **FR-004**: The popup MUST still open with focus on Full name, still clear every field on reopen, and still keep the
  Esc-in-an-open-list behavior of spec 015.
- **FR-005**: Tests MUST check the field order by name (Primary need directly after Work email, then Phone number, then
  Company website) and the Tab order, and every existing test that walks the old order MUST be updated. Tests MUST NOT
  count anything.
- **FR-006**: The design documents and UI kit that list the fields (`design/README.md`,
  `design/ui_kits/marketing-site/`, `design/_ds_bundle.js`) and the spec 001 and spec 068 texts that give the order
  MUST be updated to the new order.
- **FR-007**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Contact Request**: unchanged from spec 068. Only the order of fields on screen changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor who opens the popup sees the three asterisked fields as the first three fields, with no
  optional field among them, on every screen size the site supports.
- **SC-002**: A visitor who fills only the first three fields sends the form on the first try, with no validation
  prompt.
- **SC-003**: Every interactive element in the popup is reachable by keyboard in the new order, and the automated
  accessibility check reports no new violation.

## Assumptions

- "Just below the Work email field" means Primary need becomes the third field, and the two optional fields keep their
  relative order after it: Phone number, then Company website.
- The order of fields in the submitted request stays as spec 068 defined it; only what the visitor sees moves.
- No label, placeholder, or required state changes; the owner asked only for a move.
