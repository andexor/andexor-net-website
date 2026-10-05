# Feature Specification: Grid and Flexbox Card Columns

**Feature Branch**: `21-make-generated-content-readable`

**Created**: 2026-10-05

**Status**: Implemented

**Input**: User description: "I want to make some changes to the page layout structure on the service pages. I believe I found a better way to arrange articles the way I want by using a grid with 2 flexboxes in it, one flexbox per column in the grid. This flow replaces the 'alternating columns' flow that we have now. Keep the order of the articles in the order they are in the .md files. I need a way to manually group articles into columns in the .md files. For things like the 'Techno Bits' card, I need a way to specify that this belongs in a new row in the grid and it spans across both columns. Visually, it would work the same as it does now, but semantically, the meaning of the separator changes from the language of the alternating flow to the language of the grid."

## Clarifications

### Session 2026-10-05

- Q: Which line splits a row into a left column and a right column? → A: `||` on its own line (two vertical bars).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The author groups cards into columns by hand (Priority: P1)

The site owner edits a service page's Markdown file and decides which cards go in the left column and which go in
the right. They write the left column's cards first, then a column break, then the right column's cards. Each column
stacks its cards top to bottom in the order written. Nothing is dealt out automatically, and no card moves from where
the author put it.

**Why this priority**: This is the core change. The alternating flow decided the columns for the author; this
puts the author in charge.

**Independent Test**: Write a page with three cards, a column break, and two cards. At desktop width, the first three
cards stack in the left column in written order and the last two stack in the right column in written order.

**Acceptance Scenarios**:

1. **Given** a card page with cards A, B, C, a column break, then D, E, **When** a visitor views it at desktop width,
   **Then** A, B, C stack top to bottom on the left in that order and D, E stack top to bottom on the right.
2. **Given** the same page on a phone, **When** a visitor views it, **Then** the cards form one column in written
   order: A, B, C, D, E.
3. **Given** a left column that is taller than the right one, **When** a visitor views it, **Then** the shorter column
   ends where its last card ends; cards are not stretched to match the other column.
4. **Given** a column with a card that is much taller than its neighbours in the other column, **When** viewed,
   **Then** the cards in the other column keep their natural height and stay at the top.

---

### User Story 2 - A card can sit in its own full-width row (Priority: P1)

The owner wants a card, such as Techno Bits on the Web Development page, to sit below the columns and span both of
them. They mark the start of a new row, and the cards after the mark each span the full width of the grid, in written
order. It looks the same as the full-width cards do today; what changes is the meaning of the mark: it starts a new
grid row, instead of ending an alternating flow.

**Why this priority**: The existing full-width card must keep working, with the new wording, or the Web Development
page regresses.

**Independent Test**: Open the Web Development page at 1280 pixels wide. The Techno Bits card is below both columns,
starts at the left edge of the left column, ends at the right edge of the right column, and its list flows in two
columns, exactly as before.

**Acceptance Scenarios**:

1. **Given** a card after a row break, **When** a visitor views the page at desktop width, **Then** the card is below
   the columns and spans both of them.
2. **Given** a row break followed by several cards with no column break, **When** viewed, **Then** each card spans
   both columns in its own row, in written order.
3. **Given** a row break followed by cards split by a column break, **When** viewed at desktop width, **Then** that
   row has two columns of its own, below the earlier row.
4. **Given** a bulleted list inside a full-width card, **When** the window is resized, **Then** the list flows in two
   columns when there is room and in one when there is not, as today.

---

### User Story 3 - The author knows how to write it (Priority: P2)

The owner opens the authoring notes and finds the exact way to group cards, start a new row, and what each mark
means. Existing pages are updated so they keep working under the new rules.

**Why this priority**: Without the notes and the migration, the owner cannot use the feature and existing pages would
change unexpectedly.

**Independent Test**: Read the authoring notes; with only that text, write a page with two columns and one
full-width card, and see it render as described.

**Acceptance Scenarios**:

1. **Given** the authoring notes, **When** the owner follows them, **Then** the page renders as they intended with no
   other instructions.
2. **Given** every existing card page, **When** the site is rebuilt, **Then** each page still shows two columns (and
   a full-width row where it had one), with no card lost or duplicated.

---

### Edge Cases

- A column break with nothing after it leaves the right column empty; the left column does not stretch across.
- A column break with nothing before it leaves the left column empty.
- A second column break in the same row is an error, because only two columns exist. The build stops and names the
  file and the card nearest the problem.
- Two row breaks in a row, or a row break at the start or end of the cards, create no empty row.
- A page with no marks at all: its cards form one row with no column break, so each card spans both columns (see
  Assumptions). The existing pages are updated so none ends up like this by accident.
- A card with a very long list in a single column stays inside its column and does not push the other column.
- A card with only a heading, or no label, lays out like any other.
- Pages without the card layout (plain Markdown pages) are not affected.
- The hero, its lede, and the cards' look (colors, borders, hover) do not change.
- The Markdown marks never appear as text on the page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cards MUST appear in the page in the order they are written in the Markdown file, on every screen size.
  No card is moved, dealt out, or reordered.
- **FR-002**: The author MUST be able to group cards into a left column and a right column by writing a **column
  break** between them: a line containing only two vertical bars (`||`). Cards before the break form the left
  column, in written order; cards after it form the right column, in written order.
- **FR-003**: The author MUST be able to start a new grid row by writing a **row break**: a horizontal rule line
  (`---`) in the body, as it is written today. It starts a new row; it no longer means "ends the alternating flow".
- **FR-004**: A row with no column break MUST give each of its cards a full-width row of its own, spanning both
  columns, in written order, looking the same as the full-width cards on the Web Development page do today.
- **FR-005**: A row with a column break MUST show two equal columns, each stacking its cards top to bottom with its
  natural card heights and aligned to the top.
- **FR-006**: Rows MUST stack in the order written, each below the one before it. A full-width card or a new pair of
  columns never sits beside an earlier row's cards.
- **FR-007**: Each column MUST keep the same visual spacing as today: the same gap between the two columns and the
  same gap between cards in a column. A card that is taller or shorter than its neighbour MUST NOT change the other
  column's cards.
- **FR-008**: On narrow screens, all cards MUST form a single column in written order, with the same spacing as today.
- **FR-009**: Bulleted lists in a full-width card MUST keep flowing in two columns when there is room and one when
  there is not.
- **FR-010**: A second column break in one row MUST stop the build with a message naming the file and the nearby card.
- **FR-011**: The marks MUST NOT appear in the page, and a column break MUST NOT create an empty card or extra
  spacing.
- **FR-012**: The authoring notes (`content/README.md`) MUST describe the column break, the row break, and a full
  example, and MUST no longer describe the alternating flow.
- **FR-013**: Every existing card page MUST be updated so that it renders as two columns, and a full-width row where
  it has one, with every card present exactly once and in the order written. Cards in the first row are split into
  two groups at the middle, the left column getting the extra card when the number is odd.
- **FR-014**: The code and comments that describe the alternating flow MUST be reworded in the language of the grid
  (rows and columns), including the comments in the style sheet and the content code. Earlier specs that describe it
  (033, 034, 002) MUST carry a note that this feature supersedes them; their history is kept as written.
- **FR-015**: The owner's layout rules MUST be followed: the card area is a two-column grid; each column is a vertical
  stack of cards that may wrap; both the grid and each column use a grid gap equal to the card spacing used today
  (`var(--space-6)`), which gives the space between columns, between rows, and between cards in a column.

### Key Entities

- **Card**: One `##` section of a card page, with its heading, optional label, and body.
- **Row**: A run of cards between row breaks. Either two columns (when it has a column break) or a stack of
  full-width cards (when it does not).
- **Column**: The cards on one side of a column break, in written order.
- **Marks**: The column break (`||`) and the row break (`---`) in the Markdown.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a page with a column break, every card appears in the column the author put it in, and the written
  order of the cards, read left column then right column, matches the file, on every card page.
- **SC-002**: At 1280 pixels, the Web Development page's Techno Bits card spans both columns below them, with the
  same edges, spacing, and two-column list as before, to the pixel.
- **SC-003**: The space between the two columns, between cards in a column, and between rows is the same as before to
  the pixel, at 360, 768, and 1280 pixels wide.
- **SC-004**: On a phone, cards appear in written order on every card page.
- **SC-005**: A reader of the authoring notes alone can write a page with two columns and a full-width card that
  renders as intended, on the first try.
- **SC-006**: All existing automated tests pass, updated where they described the alternating flow, and every card
  page builds with every card present once.

## Assumptions

- The marks, so the author can tell what each one means by reading the file: `---` is a row break (grid language, a
  horizontal rule, as today) and `||` on its own line is a column break (confirmed by the owner).
- Only two columns exist. A third column is out of scope.
- A row with no column break spans both columns. This is also what a page with no marks at all does, and it is why the
  existing pages are updated (FR-013). The first-row split at the middle keeps the written order and is a starting
  point; the owner will regroup by hand.
- "Keep the same spacing" means the visible gaps and card widths do not change. The owner asked for a grid gap on both
  the grid and the columns; with two columns of exactly half the width each, a column gap would push the grid wider
  than the page, so the plan sizes the columns to share the width left after the gap (see the plan's research).
- This changes only card pages, not the hero, the home page, or plain Markdown pages.
- The owner writes and edits the Markdown pages; the changes to them in this feature are limited to the column breaks
  needed for FR-013.
- This is a layout and authoring change for the live site; it gets a spec, a plan, and tasks because it changes how
  pages are authored.
