# Feature Specification: Card List Margin

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "There should be a margin around unordered lists the same way there is for paragraphs. Without this, if a <p> follows a <ul>, it is jammed against the <ul>. To fix this on .an-tile ul, set the margin to 0 0 var(--space-3)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A paragraph after a list has room above it (Priority: P1)

A visitor reads a card on a content page. When a paragraph follows a bullet list in the card, the paragraph
is no longer jammed against the last bullet. A list gets the same space below it that a paragraph gets
below itself, so text after a list reads as its own block.

**Why this priority**: This is the whole change. Cards whose copy mixes lists and paragraphs look cramped
today.

**Independent Test**: Open a content page with a card that has a paragraph after a list (or add one to a
Markdown file). Measure the gap between the last bullet and the paragraph: it equals the gap below a
paragraph.

**Acceptance Scenarios**:

1. **Given** a card with a paragraph after a bullet list, **When** the visitor views it, **Then** the
   space between the last bullet and the paragraph equals the space below a paragraph (the `--space-3`
   step).
2. **Given** a card whose last element is a list, **When** the visitor views it, **Then** there is no
   extra space under the list at the bottom of the card, as today.
3. **Given** a card with a paragraph before a list, **When** the visitor views it, **Then** the spacing
   above the list does not change.

---

### Edge Cases

- The wide cards (after a `---`) flow their lists in two columns; they get the same space below the list.
- Cards that end with a list keep their current bottom edge, so no card grows taller.
- Lists with a single bullet and lists in the narrow one-column layout get the same space.
- Home page service cards have their own list styling and do not change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A bullet list in a card MUST have a bottom margin equal to the bottom margin of a paragraph
  in a card (the `--space-3` step), and no margin above or at its sides.
- **FR-002**: When a list is the last element in a card, it MUST add no space at the bottom of the card.
- **FR-003**: Wide cards MUST get the same list margin as the regular ones.
- **FR-004**: Nothing else in the cards MUST change: bullet look, list gaps, paragraph spacing, and the
  home page service cards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In every card where a paragraph follows a list, the gap between them equals the gap below a
  paragraph, to the pixel, at 360, 768, and 1280 pixels wide.
- **SC-002**: The height of every existing card whose last element is a list is unchanged.
- **SC-003**: All existing automated tests pass.

## Assumptions

- The margin value is the owner's: `0 0 var(--space-3)` on the list in a card.
- This is a small change to the live site. Implement directly; no plan or tasks needed.
