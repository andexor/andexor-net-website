# Feature Specification: Remove Card Badges

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Let's remove those .an-badge elements from the cards on the home page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Service cards show no badge (Priority: P1)

A visitor looks at the eight service cards on the home page. Each card shows its icon, title, description, and three
bullets, and no small tag (Web, Hosting, SEO, AI, Cost, Leads, Growth, Process) in its top right corner. The icon sits
alone at the top left, and the rest of the card is as it was.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the home page and look at every service card: none has a badge. Check the page's elements:
none of them has the `an-badge` class.

**Acceptance Scenarios**:

1. **Given** the home page, **When** a visitor looks at any service card, **Then** no badge or tag text appears on it.
2. **Given** the home page, **When** its elements are inspected, **Then** no element on the page has the `an-badge`
   class.
3. **Given** a service card, **When** it is viewed, **Then** it still shows its icon, title, description, and three
   bullets, and is still one link to its page.
4. **Given** the cards at 360, 768, and 1280 pixel widths, **When** they are viewed, **Then** the layout is intact:
   no overlap, no horizontal scrolling, and the cards in a band keep equal widths.

---

### Edge Cases

- Cards in the same band had different heights only by their descriptions. Removing the badge must not change a card's
  height: the badge sat beside the icon tile, which is taller, so the top row stays as tall as the icon tile.
- The accessible name of each card link is its title, description, and bullets. The badge text was part of it, so the
  name loses the tag word and nothing else.
- Cards on the Markdown content pages and the not-found page have no badges and are not affected.
- Hover, press, and keyboard focus behavior of the cards (specs 046 and 047) is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: No service card on the home page MUST show a badge. No element with the `an-badge` class MUST appear on
  the home page.
- **FR-002**: The icon tile MUST stay at the top left of each card, at the same size, and each card MUST keep the same
  height it has now.
- **FR-003**: The card's title, description, bullets, link destination, and the order of the cards MUST NOT change.
- **FR-004**: The tag text and tone that fed the badges are no longer used by anything, so they MUST be removed from
  the service data rather than left unused.
- **FR-005**: The shared badge component and its styles stay in the design system for future use; only their use on
  the cards is removed.
- **FR-006**: The build and every existing test MUST still pass. A test MUST check that no card on the home page has a
  badge, and MUST NOT count cards.

### Key Entities

- **Service card**: a link to one service page, now with an icon, title, description, and three bullets (no tag).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the home page, zero elements carry the `an-badge` class and none of the tag words appears on a card.
- **SC-002**: Each card's height and the position of its title, description, and bullets are the same as before,
  within 1 pixel.
- **SC-003**: At 360, 768, and 1280 pixel widths there is no horizontal scrolling and no card overlaps another.
- **SC-004**: All existing tests pass, and no new accessibility violations appear.

## Assumptions

- "Those .an-badge elements" means the tag badges in the top right of the eight service cards, the only badges on the
  home page.
- Only the use on the cards is removed. The `Badge` component and the `.an-badge` styles are shared design-system
  parts and stay, so they can be used later.
- With the tag gone, the data fields behind it (tag text and tone) are deleted, because unused data is clutter.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so
  it is left uncommitted when built.
