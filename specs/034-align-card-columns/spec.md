# Feature Specification: Card Columns Start Level

**Superseded in part by** [specs/039-grid-flex-card-columns](../039-grid-flex-card-columns/spec.md): the alternating column flow is replaced by author-grouped columns (`||`) and rows (`---`).

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "On the Web Development page, remove the .an-cards__col+.an-cards__col CSS rule. We don't need it."

**Follow-up**: Owner added: "You can remove references to staggering. We don't need it anymore."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Both card columns start at the same height (Priority: P1)

A visitor opens the Web Development page, or any card page, on a wide window. The two columns of cards
now begin at the same height, directly under the hero. Before, the right column started a little lower
so the cards in the two columns never lined up. The cards still alternate between the columns in the same
order, and each card keeps its own height.

**Why this priority**: This is the change the owner asked for. The owner does not need the extra offset on
the right column.

**Independent Test**: Open the Web Development page at 1280 pixels wide. The top of the first card in the
right column is level with the top of the first card in the left column. At phone width, nothing changes.

**Acceptance Scenarios**:

1. **Given** a card page on a wide window, **When** it loads, **Then** the first card of each column
   starts at the same height.
2. **Given** the same page, **When** the cards are compared with before, **Then** the order, the
   alternation between the columns, the card heights, and the space between cards are the same.
3. **Given** a card page on a narrow window where the cards stack in one column, **When** it loads,
   **Then** it looks exactly as it did before.
4. **Given** a page with a wide closing card (spec 033), **When** it loads, **Then** the wide card still
   sits below both columns and spans their full width.

---

### Edge Cases

- This changes card pages with the card layout (all of the content pages and the not-found page). It was
  asked for on the Web Development page, but the offset is a shared rule, so every card page changes the
  same way.
- The home page has no card columns and does not change.
- The hero, the card styling, and the spacing at the end of the page are unchanged.
- Cards in the two columns have different heights, so the bottoms of the columns will still differ.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The right card column MUST NOT have an extra offset at its top. Both columns MUST start at
  the same height.
- **FR-002**: The order of the cards, which column each card is in, the card heights, and the space
  between cards MUST NOT change.
- **FR-003**: The layout on narrow windows and the wide closing card (spec 033) MUST NOT change.
- **FR-004**: No file in the project (code comments, tests, specs, design documents) MAY describe the
  columns as staggered or the right column as starting lower, since that no longer happens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the Web Development page at 1280 and 1920 pixels wide, the tops of the first cards of the
  two columns differ by 0 pixels.
- **SC-002**: On the same page at 360 pixels wide, the card positions are the same as before the change.
- **SC-003**: No horizontal scrolling at 320, 375, 768, and 1920 pixels wide.
- **SC-004**: A case-insensitive search for "stagger" finds 0 matches outside dependencies, build
  output, and this spec, which describes the removal.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- The owner is removing the offset on the right column, which was the only thing the rule did, and
  accepts that the columns now start level. The rule's comment said it existed so the two columns never
  line up.
- The owner said the stagger is not needed any more, so every mention of it is removed: the comments in
  the stylesheet and the content code, the test name, and the wording in specs 002 and 033 and their
  companion files. Those specs now just say "two columns".
- This is a small style change to live pages. Implement directly; no plan or tasks needed.
