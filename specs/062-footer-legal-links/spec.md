# Feature Specification: Privacy and Terms Links

**Feature Branch**: `29-add-or-edit-alt-text-for-images`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "I added the privacy and terms pages. Please hook up the links from the footer to point to these pages." Then: "Go ahead and update the links on the Contact Us popup too."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Footer opens the Privacy and Terms pages (Priority: P1)

The footer's Company column lists "Privacy" and "Terms", but both are placeholders that go nowhere (spec 001, FR-017).
The owner has now written the two pages (`content/privacy.md`, `content/terms.md`). After this change, a visitor who
clicks "Privacy" in the footer lands on the Privacy Policy page, and "Terms" lands on the Terms Of Service page.

**Why this priority**: This is the owner's whole request.

**Independent Test**: On any page, click "Privacy" in the footer, then "Terms", and confirm each opens its page.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** the visitor clicks "Privacy", **Then** the Privacy Policy page opens at
   `/privacy`.
2. **Given** any page with the footer, **When** the visitor clicks "Terms", **Then** the Terms Of Service page opens at
   `/terms`.
3. **Given** the footer, **When** it is viewed, **Then** the two links look, are placed, and are labeled exactly as
   before ("Privacy", "Terms"), and open in the same tab like the other Company links.
4. **Given** the Privacy or Terms page, **When** the visitor uses the footer there, **Then** the same links work from
   those pages too.

---

### User Story 2 - Contact Us popup opens the Privacy and Terms pages (Priority: P1)

The Contact Us popup's note under the form ends with "Privacy | Terms", also placeholders. After this change they open
the same two pages as the footer links.

**Why this priority**: The owner asked for it in the same breath; the popup is where a visitor weighing whether to share
personal details most wants the policy.

**Independent Test**: Open the Contact Us popup, click "Privacy", then reopen it and click "Terms", and confirm each
opens its page.

**Acceptance Scenarios**:

1. **Given** the open popup, **When** the visitor clicks "Privacy", **Then** the Privacy Policy page opens at `/privacy`.
2. **Given** the open popup, **When** the visitor clicks "Terms", **Then** the Terms Of Service page opens at `/terms`.
3. **Given** the popup, **When** it is viewed or tabbed through, **Then** the links look, read, and keep their place in the
   focus order exactly as before (after the form fields, before Send), and the popup's focus handling is unchanged.

---

### Edge Cases

- The links must not be `#privacy` or `#terms` placeholders any more, in the footer or the popup.
- A link in the popup leaves the page it was opened on. The popup is plain navigation like the footer links, so it opens
  in the same tab. When the visitor comes back with Back, the browser usually restores the half-filled form (the owner
  saw this), but that depends on the browser and is not guaranteed or tested. No new-tab behavior is added.
- Both pages exist already, so the links must not lead to a 404 page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer's "Privacy" link MUST lead to `/privacy`.
- **FR-002**: The footer's "Terms" link MUST lead to `/terms`.
- **FR-003**: The Contact Us popup's "Privacy" and "Terms" links MUST lead to `/privacy` and `/terms`.
- **FR-004**: The link text, order, look, and same-tab behavior MUST NOT change, and the links MUST follow the site's
  link rules (no underline, color change on hover).
- **FR-005**: The existing footer link test (`tests/e2e/footer-links.spec.ts`) MUST expect `/privacy` and `/terms`
  instead of the placeholders, and a test MUST check the popup links the same way. The popup keyboard and accessibility
  tests that find these links by name MUST still pass. Tests MUST NOT count anything.
- **FR-006**: Spec 001's FR-017 note MUST be amended so it no longer says Privacy and Terms are placeholders.
- **FR-007**: The build and every existing test MUST still pass.

### Key Entities

- **Legal link**: a "Privacy" or "Terms" link, in the footer's Company column or the Contact Us popup note, that leads
  to a Markdown content page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From every page, one click on "Privacy" or "Terms" in the footer, or in the open popup, reaches the matching page.
- **SC-002**: No footer or popup link points at `#privacy` or `#terms`.
- **SC-003**: All existing tests pass, with the footer link expectations updated.

## Assumptions

- The pages are served at `/privacy` and `/terms`, from the content files the owner added, as the other content pages
  are.
- The popup is on every page, so its links are checked from one page.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
