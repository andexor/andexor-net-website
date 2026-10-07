# Feature Specification: Card Bullet Check Icon

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Replace the check icon on the home page with the check icon from FontAwesome. Keep the same size and color as it is now."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Bullets use the FontAwesome check (Priority: P1)

A visitor looks at the eight service cards on the home page. Each of the three bullets in a card starts with a small
check mark. The check mark is now the FontAwesome check icon, drawn in the same style as the service icons at the top of
the cards, at the same size and in the same gold color as the old check mark. Nothing else about the bullets changes.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the home page and look at the bullets in every card: each starts with the FontAwesome check,
which is the same size and color as before.

**Acceptance Scenarios**:

1. **Given** a service card, **When** a visitor looks at its bullets, **Then** every bullet starts with the FontAwesome
   check icon, and no other check icon is used on the card.
2. **Given** a bullet, **When** its check icon is measured, **Then** it is the same size as the old check icon (15 by
   15 pixels).
3. **Given** a bullet, **When** its check icon is viewed, **Then** it is the same gold color as the old check icon.
4. **Given** a bullet, **When** it is viewed, **Then** the check icon and the bullet text are the same distance apart
   and line up vertically as before, and the bullet text, wrapping, and the card's height are unchanged.
5. **Given** a screen reader, **When** it reads a card, **Then** the check icon is not announced, as before.
6. **Given** the cards at 360, 768, and 1280 pixel widths, **When** they are viewed, **Then** nothing overlaps and there
   is no horizontal scrolling.

---

### Edge Cases

- The FontAwesome check is a two-layer icon in the same style as the service icons. Its main shape is the gold color and
  its second layer is a lighter tint of that same color, which is part of the icon's look. Neither layer may be white
  or another color.
- A long bullet that wraps onto two lines keeps the check icon aligned with the first line as it is today.
- The success check in the Contact Us popup is a different element, shown only after sending a message. It is not on
  the home page itself and is not changed.
- The card's accessible name is unchanged, because the icon is decorative.
- Hover, press, and keyboard focus behavior of the cards is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every bullet in every service card on the home page MUST start with the FontAwesome check icon in place
  of the old check icon.
- **FR-002**: The new icon MUST be 15 by 15 pixels, the size the old one has now, and MUST stay that size however
  long the bullet text is.
- **FR-003**: The new icon MUST be the same gold color as the old one, taken from the same color setting rather than
  a copied value.
- **FR-004**: The icon MUST stay decorative: hidden from assistive technology, with no change to the card's accessible
  name.
- **FR-005**: The spacing between icon and text, the text, and the card heights MUST NOT change.
- **FR-006**: The icon is sized by the stylesheet override pattern the project uses for FontAwesome icons, not by a
  copy or patch of FontAwesome's own stylesheet.
- **FR-007**: The build and every existing test MUST still pass. A test MUST check the bullets' icon size and color, and
  MUST NOT count cards or bullets.

### Key Entities

- **Service card bullet**: one line in a card's list, made of a small check icon and a short text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every bullet's check icon measures 15 by 15 pixels, within 0.5 pixel.
- **SC-002**: Every bullet's check icon is the same gold as before, and the check's main layer has the same color value
  as the old icon.
- **SC-003**: Each bullet's text starts at the same horizontal position as before, within 1 pixel, and each card's
  height is the same as before, within 1 pixel.
- **SC-004**: All existing tests pass, and no new accessibility violations appear.

## Assumptions

- "The check icon on the home page" means the check mark that starts each of the bullets in the eight service cards.
  It is the only check icon visible on the home page when it loads.
- "The check icon from FontAwesome" is the check in the same style the service icons use, the only non-brand style the
  site's FontAwesome kit provides.
- "Same color" means the gold the bullet icons use now. The icon's lighter second layer is the same color at lower
  strength, so it counts as the same color.
- The Contact Us popup's success check is out of scope. It can be changed in a later request.
- The Lucide check import is removed from the cards once nothing there uses it.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so
  it is left uncommitted when built.
