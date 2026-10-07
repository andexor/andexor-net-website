# Feature Specification: Card Title Beside Icon

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "In the cards on the home page, move the H3 into the an-services__card-top, to the right of the icon, with some padding between them. Center the text vertically. Some cards have short headings and will fit on one line. Others have more text and will wrap onto 2 lines. Keep the text left-justified."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Title sits beside the icon (Priority: P1)

A visitor looks at the eight service cards on the home page. In each card the title now appears on the same row as the
icon, to its right, with a gap between them, instead of below it. The title is centered vertically against the icon and
its text is left-aligned. A short title such as "Web Hosting" fits on one line. A longer one such as "Process
Re-engineering" may wrap onto two lines, and stays centered against the icon and left-aligned.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the home page. In every service card the title is to the right of the icon, level with the
icon's vertical center, and the description and bullets follow below the icon row.

**Acceptance Scenarios**:

1. **Given** a service card, **When** it is viewed, **Then** the title is on the same row as the icon, to its right,
   with a visible gap between them.
2. **Given** a title that fits on one line, **When** it is viewed, **Then** its vertical center lines up with the
   icon's vertical center.
3. **Given** a title that wraps onto two lines, **When** it is viewed, **Then** the two lines together are centered
   vertically against the icon, and each line starts at the same left edge.
4. **Given** a service card, **When** it is viewed, **Then** the description and the three bullets sit below the icon
   row, in the same order and with the same text as before.
5. **Given** the cards at 360, 768, and 1280 pixel widths, **When** they are viewed, **Then** nothing overlaps, there
   is no horizontal scrolling, and the title never runs under or past the card edge.

---

### Edge Cases

- A title that wraps onto two lines is taller than the 48 pixel icon. The row grows to fit it and the icon stays
  centered against the text. Titles are never cut off or truncated.
- Cards in the same band may have different row heights when one title wraps and another does not. Card widths stay
  equal.
- On narrow screens a title that is long for the space may wrap onto more than two lines. It must still stay inside
  the card.
- The title is still a level 3 heading, so the page's heading outline does not change.
- The whole card is still one link to its service page, and its accessible name is unchanged.
- Cards on the Markdown content pages and the not-found page are not affected.
- Hover, press, and keyboard focus behavior of the cards is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: In each service card on the home page, the title MUST appear in the top row of the card, to the right of
  the icon.
- **FR-002**: The gap between the icon and the title MUST be visible and the same on every card.
- **FR-003**: The title MUST be vertically centered against the icon, whether it takes one line or wraps onto two.
- **FR-004**: The title text MUST be left-aligned and MUST wrap rather than truncate.
- **FR-005**: The title MUST remain a level 3 heading with the same text, and MUST stay inside the card at every
  screen width.
- **FR-006**: The description, bullets, link destination, and the order of the cards MUST NOT change. The description
  follows the top row with the row's existing 16 pixel spacing below it.
- **FR-007**: The build and every existing test MUST still pass. A test MUST check that the title is in the top row
  to the right of the icon and centered against it, and MUST NOT count cards.

### Key Entities

- **Service card**: a link to one service page with an icon and title in the top row, then a description and three
  bullets.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every service card, the title's left edge is to the right of the icon's right edge, with a gap of at
  least 12 pixels.
- **SC-002**: On every service card, the vertical center of the title is within 1 pixel of the vertical center of the
  icon when the title takes one line.
- **SC-003**: Every title is fully visible: none is cut off, and none extends past the card's edge at 360, 768, and
  1280 pixel widths.
- **SC-004**: All existing tests pass, and no new accessibility violations appear.

## Assumptions

- "The H3" is the title in each of the eight service cards on the home page, and "the icon" is the 48 pixel icon from
  spec 049's predecessor work.
- "Some padding" means a gap of about 16 pixels, matching the card's other spacing. The exact value is a design detail.
- The top row has no badge (removed in spec 049), so the title can use all the row width to the right of the icon.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so
  it is left uncommitted when built.
