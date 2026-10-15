# Feature Specification: Contact Phone Field

**Feature Branch**: `55-add-customer-phone-number-to-the-contact-us-form`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Add a Phone number field to the Contact Us form, just after the Work email field. Set the <input> type to tel."

**Follow-up** (same day): "Make the Company website field optional too." The owner confirmed the phone field is
optional and asked for the company website field to become optional as well.

**Second follow-up** (same day): "Put a red * next to all required fields, just after the field's label. No * for
optional fields."

**Third follow-up** (same day, during planning, after hearing that no red is readable on the blue panel): "It doesn't
have to be red. It can be the same color as the label." So the asterisk is in the label's color.

**Issue**: #55, "Add customer phone number to the Contact Us form". As a Product Manager, I want the customer's phone
number on the Contact Us form so that we can call the prospect or customer if needed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A visitor can leave a phone number (Priority: P1)

The Contact Us form currently asks for full name, work email, company website, and primary need. After this change a
"Phone number" field sits between "Work email" and "Company website". A visitor who wants a call back types their
number there, sends the form, and sees the same "Request received" confirmation as today. The phone number is optional.
Nothing else about the popup changes.

**Why this priority**: This is the owner's whole request. A phone number lets the company call a prospect instead of
waiting on email.

**Independent Test**: Open the Contact Us popup from the home page. The fields read, top to bottom: Full name, Work
email, Phone number, Company website, Primary need. Type a number into Phone number, fill the other fields, press Send,
and see "Request received".

**Acceptance Scenarios**:

1. **Given** the Contact Us popup is open, **When** the form is read top to bottom, **Then** a field labeled "Phone
   number" appears directly after "Work email" and directly before "Company website".
2. **Given** the popup is open, **When** the visitor clicks or tabs to the "Phone number" label or field, **Then** the
   label focuses the field, and the field looks like the other text fields (same size, color, placeholder style, and
   focus ring).
3. **Given** the popup is open on a phone, **When** the visitor focuses the "Phone number" field, **Then** the device
   shows a telephone keypad rather than a full text keyboard, wherever the platform supports that hint.
4. **Given** the popup is open, **When** the visitor fills every required field and sends the form with or without a
   phone number, **Then** the form sends and the "Request received" confirmation is shown.
5. **Given** the popup was closed or the form was sent, **When** the popup is opened again, **Then** the "Phone number"
   field is empty, like the other fields (spec 001 FR-013).
6. **Given** the popup is open, **When** the visitor moves through it with the Tab key, **Then** focus goes from "Work
   email" to "Phone number" to "Company website", and the field shows the site's focus ring.

---

### User Story 2 - Company website is no longer required (Priority: P2)

Today the form refuses to send until "Company website" is filled in. Some prospects have no website yet, or are
contacting the company precisely because they need one, so after this change the field stays on the form but is
optional. Only "Full name" and "Work email" remain required text fields; "Primary need" keeps its current behavior.

**Why this priority**: It removes a reason to abandon the form, but it is a follow-up to the phone field and stands on
its own.

**Independent Test**: Open the Contact Us popup, fill in only "Full name" and "Work email", choose a primary need, and
press Send. The form sends and "Request received" is shown.

**Acceptance Scenarios**:

1. **Given** the popup is open, **When** the visitor leaves "Company website" blank, fills the required fields, and
   presses Send, **Then** the form sends and the confirmation is shown, with no prompt to fill the website.
2. **Given** the popup is open, **When** the visitor leaves "Full name" or "Work email" blank and presses Send, **Then**
   the browser still stops the send and points at the empty required field (spec 001 FR-010).
3. **Given** the popup is open, **When** the "Company website" field is inspected or read by assistive technology,
   **Then** it is not announced as required, and its label, placeholder, size, and position do not change.

---

### User Story 3 - Required fields are marked with an asterisk (Priority: P3)

Now that two fields are optional, a visitor needs to see at a glance which ones they must fill in. Each required
field's label ends with an asterisk in the label's own color, right after the label text: "Full name *", "Work email
*", and "Primary need *". The optional fields, "Phone number" and "Company website", have no asterisk. The asterisk is a visual mark only;
screen readers keep announcing the field by its label and its required state, as they do today.

**Why this priority**: Without the marks, a visitor cannot tell the two optional fields from the three required ones
until the browser refuses the send. It comes after the first two stories because it depends on them.

**Independent Test**: Open the Contact Us popup. "Full name", "Work email", and "Primary need" each show an asterisk
right after the label. "Phone number" and "Company website" show none.

**Acceptance Scenarios**:

1. **Given** the popup is open, **When** the labels are read top to bottom, **Then** "Full name", "Work email", and
   "Primary need" each end with an asterisk, and "Phone number" and "Company website" do not.
2. **Given** a required field's label, **When** it is viewed, **Then** the asterisk sits right after the label text on
   the same line, in the same size and color as the label text.
3. **Given** a required field, **When** it is read by assistive technology, **Then** the field's accessible name is
   still the label text alone (for example "Full name", not "Full name star"), and the field is announced as required
   because it is required, not because of the asterisk.
4. **Given** the popup is open, **When** the visitor clicks the asterisk, **Then** the field focuses, the same as
   clicking the label.
5. **Given** a field whose required state changes in the future, **When** the form is rendered, **Then** the asterisk
   follows the required state: a field never shows an asterisk unless it is required, and never lacks one if it is.

---

### Edge Cases

- The phone field accepts any text the visitor types. Phone numbers vary by country and people write them with spaces,
  dashes, dots, parentheses, or a leading plus sign, so the form does not check the format. The browser's own behavior
  for a telephone field is enough.
- The phone and company website fields are optional, so leaving either or both empty never blocks sending. A visitor
  who leaves them blank gets the same confirmation as one who fills them in.
- A form sent with only "Full name", "Work email", and a primary need is a complete request. The required fields are
  the ones with an asterisk; optional fields carry no mark of their own.
- The asterisk must not become part of the field's name for assistive technology, or existing tests and screen readers
  that look for "Full name" would find "Full name *" instead. The required state is already announced from the field
  itself.
- Color: the owner first asked for red, but the design system's brick red (`--danger-500`) has almost no contrast
  against the panel's blue background, and no shade that still reads as red reaches the contrast the automated
  accessibility check wants for text. The owner then said the asterisk can be the same color as the label. The label
  color already passes that check on the panel, so the mark inherits it and no new color is needed.
- The design system's own form guidance and the marketing-site UI kit show labels without asterisks. They are updated
  to show the mark on required fields, as with the other design-document corrections in this spec.
- The popup stays within the viewport on a small phone: one more field makes the form taller, and the panel must still
  scroll or fit without clipping, as it does today.
- Browser autofill may offer the visitor's saved phone number for this field. That is welcome, and the field should
  carry the standard hint that tells the browser it holds a telephone number.
- The design documents (`design/README.md`, the marketing-site UI kit) list the form's fields and mark "Company
  website" as required. They are reference copies of the original design, so they are updated to show the new field in
  its place and the website field as optional, as the site's rules ask for older documents that disagree with the
  current behavior. Spec 001, which lists the form's fields in its scenarios,
  requirements, and Contact Request entity, is updated the same way.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us form MUST include a field labeled "Phone number", placed directly after "Work email" and
  directly before "Company website".
- **FR-002**: The field MUST be a telephone-type text field (the owner asked for the `tel` input type), so that mobile
  devices show a telephone keypad where they support the hint. This is a data-entry convenience only and MUST NOT add
  format validation.
- **FR-003**: The phone field MUST be optional. An empty phone number MUST NOT prevent the form from sending.
- **FR-003a**: The "Company website" field MUST become optional. An empty company website MUST NOT prevent the form
  from sending. Its label, placeholder, position, and styling MUST NOT change. This amends spec 001 FR-008, under
  which only full name and work email now remain required text fields; the primary need field is unchanged.
- **FR-004**: The field MUST use the same label, input, placeholder, and focus styling as the other text fields in the
  form, and MUST show an example placeholder in the style of the existing ones (a fictional number such as
  "+1 212 555 0100").
- **FR-005**: The field MUST tell the browser it holds a telephone number so saved numbers can be offered for autofill.
- **FR-006**: The field MUST be reachable and operable by keyboard alone, in order between "Work email" and "Company
  website", and MUST show the site's visible focus ring (spec 001 FR-015).
- **FR-007**: Reopening the popup after a close or a send MUST show the phone field empty, like the rest of the form
  (spec 001 FR-013).
- **FR-008**: The design documents that list the form's fields (`design/README.md`, `design/ui_kits/marketing-site/`)
  and spec 001's descriptions of the form (its `spec.md`, `contracts/ui-contracts.md`, and `quickstart.md`) MUST be
  updated to include the new field in its place and to show "Company website" as optional. Spec 001 FR-008 MUST be
  marked as amended by this spec, in the style spec 001 already uses for superseded requirements.
- **FR-009**: Tests MUST check that the phone field is present with its label, that it is a telephone-type field, that
  it sits between "Work email" and "Company website", that it is not required, and that the form still sends with it
  blank and with it filled. Tests MUST check that "Company website" is not required and that the form sends with it
  blank, and the existing check that it is required MUST be reversed. Tests MUST still check that full name and work
  email are required. Tests MUST NOT count anything.
- **FR-010**: The build and every existing test MUST still pass, with no new accessibility violations.
- **FR-011**: Every required field in the Contact Us form ("Full name", "Work email", and "Primary need") MUST show an
  asterisk ("*") immediately after its label text, on the same line and at the label's size. Optional fields
  ("Phone number" and "Company website") MUST NOT show one.
- **FR-012**: Whether a field shows the asterisk MUST follow from whether it is required, so the two can never
  disagree. This applies to every form field on the site that uses the shared label and input styling, not only the
  five in the popup today.
- **FR-013**: The asterisk MUST be the same color as the label text it follows, so it is as readable as the label.
  The automated accessibility check that already runs on the popup MUST report no new violation.
- **FR-014**: The asterisk MUST NOT change a field's accessible name: assistive technology MUST still announce the
  field by its label text alone, with the required state coming from the field itself. Clicking the asterisk MUST
  focus the field, like clicking the label.
- **FR-015**: Tests MUST check that each required field's label ends with the asterisk and each optional field's does
  not, that the asterisk is in the label's color, and that each field's accessible name is unchanged. Tests MUST NOT
  count anything.
- **FR-016**: The design documents that describe the form's labels (`design/README.md`, the form guidance under
  `design/components/forms/`, and `design/ui_kits/marketing-site/`) MUST be updated to show the asterisk on required
  fields.

### Key Entities

- **Contact Request**: a prospective customer's inquiry submitted through the Contact Us popup. Its attributes become
  full name, work email, phone number (optional), company website (optional), and primary need. As in spec 001, the
  request is not persisted or transmitted anywhere yet.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor who opens the Contact Us popup sees the "Phone number" field in its place between "Work email"
  and "Company website" on every screen size the site supports, from 320px to 1920px wide.
- **SC-002**: A visitor on a phone gets a telephone keypad when they tap the field, on devices that support the hint.
- **SC-003**: A visitor can send the form with the phone and company website fields blank or filled, in any
  combination, with no change to how long sending takes or to the confirmation they see.
- **SC-005**: A visitor who fills only full name, work email, and primary need sends the form on the first try, with no
  validation prompt.
- **SC-006**: A visitor can tell which fields are required before trying to send: the three required labels each show
  an asterisk, the two optional labels show none, and the automated accessibility check reports no new violation.
- **SC-004**: Every interactive element in the popup, including the new field, is reachable and operable by keyboard
  alone, and the automated accessibility checks report no new violations.

## Assumptions

- The phone field is optional. The issue says the number lets the company call "if needed", and the owner confirmed
  this in the follow-up by asking for the company website field to be optional "too".
- Making "Company website" optional does not change the text, placeholder, or order of any field. Optional fields get
  no "(optional)" mark; the owner asked that only required fields be marked, with the asterisk.
- One space separates the label text from the asterisk ("Full name *"), which is the usual convention and reads as a
  mark rather than part of the word. If the owner prefers no space ("Full name*"), only that gap changes.
- The asterisk inherits the label's color (`--blue-100` in the popup). The owner dropped the request for red once it was
  clear that red cannot be made readable on the blue panel.
- The asterisk is a visual mark hidden from assistive technology. Screen readers already announce required fields as
  required, so no "required" text is added to labels.
- "Primary need" keeps its current required behavior; the follow-up named only the company website field.
- The label is "Phone number", matching the owner's wording and the sentence-case style of the other labels ("Full
  name", "Work email", "Company website").
- No phone number format is enforced and no country code is required. The field stores what the visitor types.
- The placeholder is a fictional example number in the style of the existing placeholders. Numbers in the 555-01xx
  range are reserved for fiction, so "+1 212 555 0100" cannot belong to anyone.
- The confirmation text, the note under the form, the Send button, and the popup's header do not change.
- Submitting still only demonstrates the client-side experience; wiring the form, including the phone number, to a
  real destination is a separate concern (spec 001 Assumptions).
