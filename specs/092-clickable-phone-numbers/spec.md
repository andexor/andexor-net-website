# Feature Specification: Clickable Phone Numbers

**Feature Branch**: `114-clickable-phone-numbers`

**Created**: 2026-11-07

**Status**: Draft

**Issue**: #114

**Input**: User description: "Let's make phone numbers clickable. Wherever there is a plain text "+14043511440", turn it into a link like this: <a href="tel:+14043511440">+14043511440</a>"

## Clarifications

### Session 2026-11-07

- Q: Should the phone number inside the JSON-LD (JavaScript Object Notation for Linked Data) structured data (the `telephone` fields in the schema files) stay exactly as it is, or change to another format? → A: Leave it unchanged (+14043511440). It is not visible text, so the link change does not apply to it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Call the company from a legal page (Priority: P1)

A visitor reading a policy page on a phone sees the company's phone number in the text. They tap it and their phone opens a call to Andexor.

**Why this priority**: The number appears in the Privacy Policy, Security Policy, and Terms of Service, and these are where visitors go when they have a question about their data or the terms. A tappable number removes the need to copy it.

**Independent Test**: Open each page that shows the number and check that the number is a link whose address is the tel: form of the number.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Privacy Policy page, **When** they look at the request instructions that say to call +14043511440, **Then** the number is a link to tel:+14043511440 and its text reads +14043511440.
2. **Given** a visitor is on the Privacy Policy page, **When** they reach the contact section that lists "Phone: +14043511440", **Then** the number is a link to tel:+14043511440.
3. **Given** a visitor is on the Security Policy or Terms of Service page, **When** they reach the contact section that lists "Phone: +14043511440", **Then** the number is a link to tel:+14043511440.

---

### User Story 2 - Links look like the rest of the site's links (Priority: P2)

A visitor sees the phone number link in the same color as other links on the site, with no underline at rest or on hover, and the same keyboard focus ring as other links.

**Why this priority**: The site's link rules apply to every link, and a phone link must not look different from the others.

**Independent Test**: Check the computed style of each phone link at rest and on hover, and check that it receives the keyboard focus ring.

**Acceptance Scenarios**:

1. **Given** a phone link is shown in running text, **When** the page renders, **Then** it uses the same link color as other links in that text.
2. **Given** a visitor moves the pointer over a phone link, **When** the hover state applies, **Then** the link changes color and is not underlined.
3. **Given** a visitor moves to a phone link with the keyboard, **When** the link gets focus, **Then** the focus ring is visible.

---

### Edge Cases

- The same number appears more than once on one page: each visible occurrence is a link.
- The number appears in structured data (the telephone field in the site's JSON-LD schema files): this is not visible text, so it stays as a plain value and is not made a link.
- A phone number in another format, such as "(404) 351-1440" or "404-351-1440": out of scope, because the request names only the +14043511440 form.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every visible occurrence of the text +14043511440 on the site MUST be a link whose address is tel:+14043511440.
- **FR-002**: The link text MUST stay +14043511440, unchanged.
- **FR-003**: Phone links MUST follow the site's link rules: the shared link color, no underline at rest or on hover, and the shared keyboard focus ring.
- **FR-004**: The structured data telephone fields in the site's schema files MUST NOT be changed, because they are not visible text.
- **FR-005**: Content pages MUST write the link in Markdown form, because raw HTML in the content files is dropped at build time.

### Key Entities

- **Phone number**: The company's public number, +14043511440. Its visible form is shown as text, and its link form is tel:+14043511440.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of visible occurrences of +14043511440 on the built site are links to tel:+14043511440.
- **SC-002**: A visitor on a phone can start a call to the company from any page that shows the number in one tap.
- **SC-003**: No phone link is underlined at rest or on hover.

## Assumptions

- The phone number is shown only as plain text in the Markdown content files at the start: content/privacy-policy.md, content/security-policy.md, and content/terms-of-service.md. A search of the source found no other visible occurrence.
- Tests check the behavior of the links (the tel: address, no underline, focus ring) and do not check the number's wording.
- The number appears in the JSON-LD files under src/lib/schema/ (ed.json and organization.json). It is machine-readable data and not visible text, so it is left as it is.
- The user's example uses raw HTML. The content pipeline drops raw HTML, so the same link is written in Markdown as [+14043511440](tel:+14043511440).
- No new page or layout change is needed; the change is limited to the link markup in existing content.
