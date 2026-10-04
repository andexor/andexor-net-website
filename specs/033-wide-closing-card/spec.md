# Feature Specification: Wide Closing Card With a Two-Column List

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "On the Web Services page, remove the Techno Bits card from the normal alternating column flow. Put this card at the end of the page's content, after the alternating column flow. Let it spread horizontally across both columns. Let the bullet list be split into a 2-column flow so that half of the items are on the left side and the rest are on the right side. Let the list flow automatically when the window is resized."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The Techno Bits card closes the page, full width (Priority: P1)

A visitor reads the Web Development page. The cards run down the page in two columns as
before. After the last card of those two columns, the Techno Bits card sits on its own row and spans the
full width of both columns, like a closing panel. It is no longer one of the alternating cards, so the
two columns are no longer left uneven by a long card at the end of one of them.

**Why this priority**: This is the placement the owner asked for. The card holds a long list that is
awkward in a narrow column.

**Independent Test**: Open the Web Development page at 1280 pixels wide. The Techno Bits card is below
both columns, starts at the left edge of the left column, ends at the right edge of the right column, and
no other card sits beside it.

**Acceptance Scenarios**:

1. **Given** the Web Development page on a wide window, **When** it loads, **Then** the Techno Bits card
   appears after all the alternating cards, below both columns.
2. **Given** the same page, **When** the card's edges are compared with the two columns, **Then** the
   card spans from the left edge of the left column to the right edge of the right column.
3. **Given** the alternating cards, **When** they load, **Then** they alternate between the columns in
   the same order as before, as if the Techno Bits card were not in the Markdown file.
4. **Given** a narrow window (phone width) where the cards stack in one column, **When** it loads,
   **Then** the Techno Bits card is still the last card, at the same width as the others.

---

### User Story 2 - The long list flows in two columns (Priority: P1)

Inside the Techno Bits card, the bulleted list is split into two columns, so about half of the items are
on the left and the rest are on the right. Items read top to bottom down the left column and then
continue at the top of the right column. As the window is resized, the list re-flows by itself: two
columns while there is room, one column when the card gets too narrow.

**Why this priority**: A twelve-item list in one wide column is a long thin strip. Two columns use the
width and shorten the card.

**Independent Test**: Open the page at 1280 pixels wide. The list shows two columns with the items
split about evenly. Narrow the window step by step. The list becomes one column at a narrow width with
no horizontal scrolling and no cut-off text. Widen it again and it returns to two columns.

**Acceptance Scenarios**:

1. **Given** the wide card on a wide window, **When** it loads, **Then** the list shows in two columns,
   with half of the items (the first half, in reading order) on the left and the rest on the right. When
   the number of items is odd, the left column has the extra item.
2. **Given** the list in two columns, **When** the window is made narrower, **Then** the list
   re-flows into one column at a width where two columns would be cramped, with no JavaScript needed
   and no page reload.
3. **Given** the list in one column on a narrow window, **When** the window is made wider again, **Then**
   it returns to two columns.
4. **Given** a list item whose text wraps, **When** it is viewed in a column, **Then** its second line
   lines up with its first line's text and the item is not split across the two columns.
5. **Given** the list, **When** it is read by a screen reader, **Then** it is still one list with the
   items in the same order.

---

### User Story 3 - The owner can make any card wide from the Markdown file (Priority: P2)

The owner decides in the Markdown file, not in the code, which card is the wide closing card. They put a
horizontal rule (a line with `---`) in the body before the card. The card after the rule, and any further
cards below it, are taken out of the alternating flow and shown below it at full width, in the order
written. Removing the rule puts the card back into the alternating flow.

**Why this priority**: The owner edits content without asking for help and may want the same layout on
another page later. No page-specific code and no card names in settings should be needed.

**Independent Test**: Move the `---` line in a copy of a content page and rebuild. The cards after the
line are wide and below the columns, and the cards before it alternate as usual. Remove the line and all
cards alternate.

**Acceptance Scenarios**:

1. **Given** a card page whose body has a `---` line between two `##` sections, **When** it is built,
   **Then** every card before the line alternates between the columns and every card after the line is
   shown full width below them, in written order.
2. **Given** a card page with no `---` line in its body, **When** it is built, **Then** it looks as it
   does today.
3. **Given** a wide card with a bulleted list, **When** it is built, **Then** the list flows in two
   columns. A wide card without a list simply spans the width.

---

### Edge Cases

- The Techno Bits card's text, order of items, and wording are not changed, including its heading and
  the sentence above the list.
- The card's own styling (colors, border, radius, bullet, spacing inside) is the same as the other
  cards. The owner confirmed (2026-10-01) that no further formatting of the Techno Bits card is planned.
- A card page with no wide card, the home page, and the not-found page do not change.
- If a `---` line is written but nothing follows it, nothing changes.
- A long item never splits across the two columns.
- The two columns, the hero, and the page spacing at the end of the page are unchanged.
  The wide card has the same space above it as there is between other cards.
- Front matter delimiters also use `---` but are not part of the body, so they are not affected.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On a card page, every card written after a horizontal rule (`---`) in the body MUST be
  taken out of the alternating two-column flow and shown after it, in written order.
- **FR-002**: A card shown this way MUST span the full width of both columns on wide windows, and the
  same width as the other cards when the cards are stacked on narrow windows.
- **FR-003**: The cards before the rule MUST alternate between the two columns exactly as they would if
  the cards after the rule were not in the file.
- **FR-004**: A bulleted list inside such a card MUST be shown in two balanced columns, items filling
  the left column top to bottom and continuing in the right, with the extra item (if the count is odd)
  in the left column.
- **FR-005**: The list MUST re-flow into one column by itself when the card is too narrow for two, and
  back to two columns when it is wide again, using only the page's layout, with no script and no reload.
- **FR-006**: A list item MUST NOT be split across the two columns, and the list MUST stay a single
  list, in the same order, for assistive technology.
- **FR-007**: A page with no rule in its body MUST render as it does today.
- **FR-008**: The Web Development page's Techno Bits card MUST be placed after a rule in
  `content/web-development.md`, so it is the wide closing card there.
- **FR-009**: `content/README.md` MUST describe the rule: what it does, that cards after it are wide,
  and that its lists flow in two columns.
- **FR-010**: Card text, headings, colors, borders, and the home page MUST NOT change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the Web Development page at 1280 and 1920 pixels wide, the Techno Bits card's left edge
  equals the left column's left edge, its right edge equals the right column's right edge, and its top is
  below the bottom of both columns.
- **SC-002**: On the same page at 1280 pixels wide, the list is split into two columns whose item counts
  differ by at most one, with the left column having the extra item if there is one.
- **SC-003**: Resizing from 1920 down to 320 pixels wide, the list changes to a single column at some
  width and back to two when widened, with no horizontal scrolling at 320, 375, 768, and 1920 pixels
  wide.
- **SC-004**: With the rule removed from the file, the Techno Bits card appears in the alternating flow
  again, as before.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- "The Web Services page" means the Web Development page (`/web-development`, `content/web-development.md`),
  which is the page with the Techno Bits card. There is no page called Web Services.
- A `---` line in the body is the owner's way to say "the cards below this line are closing cards". It
  is the standard Markdown horizontal rule, needs no page settings, and works on any card page. If the
  owner prefers a different marker later, that is a separate request. The owner has said they do not want
  per-card settings by name, as in the removed "featured" setting.
- Cards after the rule are all wide. With only the Techno Bits card there today, that is one wide
  card, but more can follow.
- "Half of the items on the left" means in reading order: the first half on the left, the second half on
  the right, which is how a list flowing in two columns works.
- The width at which two columns become one is chosen when implementing so that an item still has room
  for its text. It is judged by eye and not fixed by this spec.
- Tests do not check how many cards or list items exist. They check that the wide card is below both
  columns, spans their width, and that its list is in two columns, whatever the counts are.
- The card keeps the normal card styling. The owner confirmed that nothing more is planned for its
  formatting.
- This is a small layout change. Implement directly; no plan or tasks needed.
