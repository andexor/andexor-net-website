# Feature Specification: Card Bullet Icon Size

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Set the height and width of the square-check icons to 24x24px. Change the font-size for .an-services__bullet to 14px to match an-services__card-body."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Larger bullet icons and text (Priority: P1)

A visitor looks at the eight service cards on the home page. The check icon at the start of each bullet is now larger,
24 by 24 pixels instead of 15 by 15, and the bullet text is now 14 pixels, the same size as the description text
above the list, instead of 13 pixels. Each icon is centered against its line of text, and a bullet that wraps onto two
lines keeps the icon centered against both lines.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the home page and look at the bullets in every card: each icon is 24 by 24, and the bullet
text is the same size as the card's description.

**Acceptance Scenarios**:

1. **Given** a bullet in a service card, **When** its icon is measured, **Then** it is 24 by 24 pixels.
2. **Given** a bullet, **When** its text is measured, **Then** its font size is 14 pixels, equal to the font size of the
   card's description.
3. **Given** a bullet, **When** it is viewed, **Then** the icon is vertically centered against the text, whether the text
   takes one line or wraps onto two.
4. **Given** a bullet, **When** it is viewed, **Then** the gap between icon and text is still 8 pixels, and the icon's
   color, clear square, and transparent background are as before.
5. **Given** the cards at 360, 768, and 1280 pixel widths, **When** they are viewed, **Then** nothing overlaps, bullet
   text stays inside the card, and there is no horizontal scrolling.
6. **Given** a screen reader, **When** it reads a card, **Then** the icon is still not announced, and the card's
   accessible name is unchanged.

---

### Edge Cases

- A 24 pixel icon is taller than one line of 14 pixel text (about 20 pixels), so each bullet row is now at least 24
  pixels tall and each card grows by a few pixels per bullet. Cards in the same band may differ in height by the
  same amounts as before, because their descriptions and wrapping differ, not because of the icons.
- With the icon 9 pixels larger, a long bullet has less width for text and may wrap where it did not before. The text must
  wrap inside the card and never be cut off. The icon must not shrink.
- The icon box is 24 by 24, but the check mark inside it is drawn smaller than the box, because FontAwesome leaves room
  around its shapes. That is how the icon looks at any size.
- The 14 pixel size applies to bullet text only. The icon's size is set directly, so it does not change with the text
  size.
- The Contact Us popup's success check is a separate element and is not changed.
- Hover, press, and keyboard focus behavior of the cards is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The square-check icon at the start of every bullet in every home page service card MUST be 24 by 24
  pixels, and MUST stay that size however long the bullet text is.
- **FR-002**: The bullet text MUST be 14 pixels, the same size as the card description, and MUST follow the card
  description's size if that changes, by using the same size setting rather than a separate number where the project
  allows it.
- **FR-003**: The icon MUST stay vertically centered against the bullet's text, including when the text wraps.
- **FR-004**: The icon's color (`--gold-300`), its clear square layer, its transparent background, the 8 pixel gap to
  the text, and its hidden-from-assistive-technology state MUST NOT change.
- **FR-005**: Text MUST wrap inside the card and never be cut off or overflow at 360, 768, and 1280 pixel widths.
- **FR-006**: The icon is sized by the existing stylesheet override rule for the square-check icon, changed from 15 to 24
  pixels, not by a copy or patch of FontAwesome's own stylesheet.
- **FR-007**: The build and every existing test MUST still pass. The existing bullet icon test MUST be updated to expect
  24 by 24 and a 14 pixel text size, and MUST NOT count cards or bullets.

### Key Entities

- **Service card bullet**: one line in a card's list, made of a 24 pixel square-check icon and a 14 pixel text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every bullet's icon measures 24 by 24 pixels, within 0.5 pixel.
- **SC-002**: Every bullet's text has a computed font size of 14 pixels, equal to the card description's computed font
  size.
- **SC-003**: Every icon's vertical center is within 1 pixel of the vertical center of its bullet.
- **SC-004**: At 360, 768, and 1280 pixel widths there is no horizontal scrolling, no text is cut off, and no card
  overlaps another.
- **SC-005**: All existing tests pass, and no new accessibility violations appear.

## Assumptions

- "The square-check icons" means the icon at the start of each bullet in the eight service cards (spec 052).
- "The font-size for .an-services__bullet" is the bullet's text size, now 13 pixels, and "an-services__card-body" is the
  card description, which is 14 pixels.
- The card height changes. A 24 pixel icon is taller than one line of text, so each bullet row is taller and cards grow.
  The owner asked for the larger size, so this is expected.
- The spacing between bullets stays as it is (7 pixels). If the larger rows look too loose, that is a later request.
- The color, clear square, and transparent background from spec 052 are kept.
- The Contact Us popup's success check is out of scope.
- The work from specs 051 and 052 is on the same branch and uncommitted, so this change builds on it.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so
  it is left uncommitted when built.
