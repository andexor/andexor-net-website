# Feature Specification: Contact Notice Text

**Feature Branch**: `29-add-or-edit-alt-text-for-images`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Remove "No obligation. " from the notice text on the Contact Us popup."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The popup notice no longer says "No obligation." (Priority: P1)

The note under the Contact Us form reads "No obligation. We never share your personal information. Privacy | Terms".
After this change the first sentence is gone and the note reads "We never share your personal information. Privacy |
Terms". Nothing else about the popup changes.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the Contact Us popup from the home page and read the note under the form: it starts with "We
never share your personal information." and the words "No obligation" appear nowhere in it.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup is open, **When** the note under the form is read, **Then** its text is "We never share
   your personal information." followed by the Privacy and Terms links, with no "No obligation." before it.
2. **Given** the popup, **When** it is viewed, **Then** the note starts with "We", with no leading space or gap where the
   removed sentence was, and keeps its size, color, centering, and spacing.
3. **Given** the note, **When** the Privacy and Terms links are used, **Then** they still look and work as before
   (spec 062).
4. **Given** any page or the popup, **When** the visible text is searched, **Then** "No obligation" appears nowhere.

---

### Edge Cases

- The removal includes the period and the space after "No obligation.", so the note does not begin with a space.
- The notice appears only in the Contact Us popup's form view. The confirmation view after sending does not contain it.
- The design system documents (`design/README.md`, the marketing-site UI kit) still show the old wording. They are
  reference copies of the original design, so they are corrected to match the site, as the site's rules ask for older
  documents that disagree with the current behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The note under the Contact Us form MUST read "We never share your personal information." followed by the
  Privacy and Terms links, with "No obligation. " removed from its start.
- **FR-002**: The note MUST NOT begin with whitespace, and its look, position, and links MUST NOT change.
- **FR-003**: The words "No obligation" MUST NOT appear in the site's visible text.
- **FR-004**: A test MUST check the note's text and that it does not contain "No obligation". Tests MUST NOT count
  anything.
- **FR-005**: The design documents that quote the old note (`design/README.md`, `design/ui_kits/marketing-site/`) MUST be
  updated to the new wording. Any existing spec or test that quotes the old wording MUST be updated too.
- **FR-006**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Contact notice**: the short note under the Contact Us form that reassures the visitor about their information and
  links to Privacy and Terms.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The popup note's text is exactly "We never share your personal information. Privacy | Terms" when read as
  plain text.
- **SC-002**: "No obligation" appears nowhere in the built site.
- **SC-003**: The popup looks identical apart from the removed words, and the Privacy and Terms links still open their
  pages.
- **SC-004**: All existing tests pass and no new accessibility violations appear.

## Assumptions

- Only the first sentence is removed; the rest of the note is kept word for word.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
