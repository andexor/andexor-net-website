# Feature Specification: Card Bullet Square Check

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Replace the check icon in the cards with the square-check icon."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Bullets use the square check (Priority: P1)

A visitor looks at the eight service cards on the home page. Each of the three bullets in a card starts with a check
icon. That icon is now the FontAwesome square-check, a check mark inside a square, in the same style as the other
FontAwesome icons on the cards, at the same size as the check it replaces, in the lighter gold `--gold-300`, with a fully transparent background: the square's own fill is clear, so only the
check mark inside it is drawn. Nothing else about
the bullets changes.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the home page and look at the bullets in every card: each starts with the square-check, which
is the same size as the previous check, in `--gold-300`, with the card showing through behind and around the check mark.

**Acceptance Scenarios**:

1. **Given** a service card, **When** a visitor looks at its bullets, **Then** every bullet starts with the
   FontAwesome square-check icon, and the plain check icon is no longer used on the card.
2. **Given** a bullet, **When** its icon is measured, **Then** it is the same size as the previous check icon (15 by 15
   pixels).
3. **Given** a bullet, **When** its icon is viewed, **Then** it is drawn in the `--gold-300` gold, and the previous `--gold-600` is no longer used for it.
4. **Given** a bullet, **When** it is viewed, **Then** the icon and the bullet text are the same distance apart and
   line up vertically as before, and the bullet text, wrapping, and the card's height are unchanged.
5. **Given** a screen reader, **When** it reads a card, **Then** the icon is not announced, as before.
6. **Given** the cards at 360, 768, and 1280 pixel widths, **When** they are viewed, **Then** nothing overlaps and there
   is no horizontal scrolling.

---

### Edge Cases

- The square-check is a two-layer icon. Its check mark is drawn at full `--gold-300`. Its square layer, which FontAwesome
  draws at 40% strength, is made fully clear, so nothing is drawn behind or around the check mark. With the square clear,
  the icon looks like a check mark with a square-shaped cut-out around it that cannot be seen against the card.
- The square-check's check mark is smaller than the plain check inside the same 15 pixel box, because the square takes
  up the room. It is still legible at 15 pixels. If the owner wants it larger, that is a later request.
- A long bullet that wraps onto two lines keeps the icon aligned with the first line as it is today.
- The success check in the Contact Us popup is a separate element, not in the cards, and is not changed.
- The card's accessible name is unchanged, because the icon is decorative.
- Hover, press, and keyboard focus behavior of the cards is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every bullet in every service card on the home page MUST start with the FontAwesome square-check icon in
  place of the plain check icon. No plain check icon from FontAwesome MUST remain on the cards.
- **FR-002**: The icon MUST be 15 by 15 pixels, the size of the icon it replaces, and MUST stay that size however long
  the bullet text is.
- **FR-003**: The icon MUST be the `--gold-300` color, taken from that color setting rather than a copied
  value.
- **FR-004**: The icon element and the bullet around it MUST have a transparent background, so the card shows through
  around and inside the icon's shapes. The icon's square layer MUST be fully transparent (zero opacity), leaving only
  the check mark visible.
- **FR-005**: The icon MUST stay decorative: hidden from assistive technology, with no change to the card's accessible
  name.
- **FR-006**: The spacing between icon and text, the text, and the card heights MUST NOT change.
- **FR-007**: The icon is sized by the stylesheet override pattern the project uses for FontAwesome icons: the rule that
  sized the plain check is changed to name the square-check instead, so no unused rule is left behind.
- **FR-008**: The build and every existing test MUST still pass. The existing bullet icon test MUST be updated to expect
  the square-check, and MUST NOT count cards or bullets.

### Key Entities

- **Service card bullet**: one line in a card's list, made of a small square-check icon and a short text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every bullet's icon is the square-check and measures 15 by 15 pixels, within 0.5 pixel.
- **SC-002**: Every bullet's icon is `--gold-300`, and the icon element and its bullet have a transparent background.
- **SC-003**: Each bullet's text starts at the same horizontal position as before, within 1 pixel, and each card's
  height is the same as before, within 1 pixel.
- **SC-004**: All existing tests pass, and no new accessibility violations appear.

## Assumptions

- "The check icon in the cards" means the FontAwesome check that starts each bullet in the eight service cards
  (spec 051).
- "The square-check icon" is FontAwesome's square-check, in the same duotone style as the other icons on the cards, the
  only non-brand style the site's FontAwesome kit provides.
- The size (15 pixels) stays as it is. The color changes from `--gold-600` to `--gold-300` at the owner's request.
- "Make sure the background is transparent" means the square-check's square fill is fully clear, as the owner confirmed,
  and the icon element and its bullet have no background color. Only the check mark shows. FontAwesome draws the square at
  40% strength, so this is done by setting that layer's opacity to zero.
- The Contact Us popup's success check is out of scope.
- The work from spec 051 is on the same branch, so this change builds on it and replaces its icon.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so
  it is left uncommitted when built.
