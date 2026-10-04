# Feature Specification: Footer Tagline as One Line of Text

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "In the footer, update the an-footer__tagline paragraph. Remove the line break, combine the 2 text nodes into 1, and add a space between the words which were separated by the break."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The footer tagline is one piece of text (Priority: P1)

A visitor, a search engine, or a screen reader reads the footer tagline. It is a single sentence,
"Enterprise services for small business", in one piece, with an ordinary space between "services" and
"for", instead of two text fragments split by a forced line break. Where the line breaks is decided by
the available width, like any other paragraph.

**Why this priority**: This is the change the owner asked for. A hard break splits the sentence
into two pieces that assistive technology and crawlers may read as separate lines, and it forces a
break even when the text would fit.

**Independent Test**: Open the footer on any page. The tagline paragraph holds one text piece reading
exactly "Enterprise services for small business" and contains no line break element.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** the tagline paragraph is inspected, **Then** it
   contains exactly one text piece, "Enterprise services for small business", and no line break.
2. **Given** the tagline's text, **When** it is read as plain text, **Then** there is a single space
   between "services" and "for", and no other change to the wording.
3. **Given** the footer at 375, 768, 1280, and 1920 pixels wide, **When** it loads, **Then** the
   tagline wraps between words without horizontal scrolling, and its font, size, and color are
   unchanged.

---

### Edge Cases

- The words, font, size, color, and spacing of the tagline are unchanged.
- The paragraph's own 30-character width limit is removed (owner request). It came from the first
  version of the page and does no work: the footer's layout already sizes the first column (a
  proportional share of the page on wide screens, the full width on narrow ones), and the sentence is
  short. On a wide screen the tagline now fits on one line. In a narrow column it wraps between words
  where the column ends.
- The design-system sample footer and bundle, which also use a line break in the tagline, are updated
  to match so they do not bring it back.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer tagline paragraph MUST contain a single text piece reading exactly
  "Enterprise services for small business".
- **FR-002**: The tagline paragraph MUST NOT contain a line break element.
- **FR-003**: The tagline's font, size, color, and spacing MUST NOT change.
- **FR-005**: The tagline paragraph MUST have no maximum width of its own; its width comes from the
  footer layout around it.
- **FR-004**: The design-system README, sample footer, and bundle MUST be updated to match, so the
  line break and the width limit are not reintroduced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The footer tagline paragraph has 1 text piece and 0 line break elements on every page.
- **SC-002**: The paragraph's plain text is exactly "Enterprise services for small business".
- **SC-003**: The tagline paragraph has no maximum width, and is 1 line tall at 1280 and 1920 pixels
  wide.
- **SC-004**: No horizontal scrolling at 320, 375, 768, and 1920 pixels wide.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- This follows spec 027, which set the tagline's wording and kept its two-line layout. This spec
  supersedes that two-line layout; spec 027 is left as written.
- "Combine the 2 text nodes into 1" means the paragraph's text is one string in the page's markup,
  not two strings with an element between them.
- This is a small markup change to a live page. Implement directly; no plan or tasks needed.
