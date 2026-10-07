# Feature Specification: Service Card Hover

**Feature Branch**: `25-tweak-borders-box-shadows-and-transitions-on-cards`

**Created**: 2026-10-06

**Status**: Implemented

**Input**: User description: "On the home page, in the .an-card--hover:hover class, change the transform to
translateX(2px) translateY(2px) so it acts like other buttons. Remove the border-color. Change the box-shadow to
0 0 0 2px var(--gold-500)."

**Amended**: The owner then said to keep the transform on :active and remove the one on :hover. The card now moves only
while pressed, like the buttons; on hover it gets the gold ring and does not move.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A service card on the home page reacts like a button (Priority: P1)

A visitor moves the pointer over one of the service cards on the home page. A thin gold ring appears around it and the
card stays where it is. The card's border does not change color. When the visitor presses the card, it moves 2px right
and 2px down, the same movement the site's buttons make when pressed. The ring and the press movement tell the visitor
the card is a link they can use.

**Why this priority**: This is the owner's direct request, and it is the only change.

**Independent Test**: On the home page, read a service card's computed `transform`, `box-shadow`, and `border-color` at
rest, with the pointer over it, and while it is pressed. On hover the transform is unchanged and the shadow is a 2px
gold-500 ring. While pressed the transform moves 2px right and 2px down. The border color is unchanged throughout.

**Acceptance Scenarios**:

1. **Given** a service card on the home page, **When** the pointer is over it, **Then** it does not move: its position
   is the same as at rest.
2. **Given** a service card, **When** the pointer is over it, **Then** its shadow is a 2px ring in `var(--gold-500)`
   with no blur and no offset, replacing the resting shadow.
3. **Given** a service card, **When** the pointer is over it, **Then** its border color is the same as at rest.
4. **Given** a service card, **When** it is pressed, **Then** it is moved 2px right and 2px down from where it is at
   rest, keeps the gold ring while the pointer is over it, and still leads to its page when clicked.
5. **Given** a service card, **When** the pointer leaves it, **Then** it returns to its resting shadow.

---

### Edge Cases

- Cards on the Markdown content pages and the not-found page are not affected. They do not react to hover (spec 046).
- A touch screen has no hover, so a tap shows only the pressed state, which moves the card 2px right and 2px down.
- The old hover lift (2px up) is removed. Only the press moves the card.
- Nothing is underlined in any state, and the focus ring for keyboard users is unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `.an-card--hover:hover` MUST NOT set a `transform`: the lift is removed, so the card does not move on
  hover. The press rule (`:active`) keeps `transform: translateX(2px) translateY(2px)`.
- **FR-002**: `.an-card--hover:hover` MUST set `box-shadow: 0 0 0 2px var(--gold-500)`.
- **FR-003**: `.an-card--hover:hover` MUST NOT set `border-color`: the declaration is removed, so the border keeps its
  resting color.
- **FR-004**: The gold is the design token named, not a literal color value.
- **FR-005**: Nothing else changes: the cards' resting look, the transition, the pressed state, the links' names and
  destinations, and no underline in any state.
- **FR-006**: The build and every existing test MUST still pass. A test MUST check the computed transform, shadow, and
  border color on hover and while pressed on a home page service card, and MUST NOT count cards.

### Key Entities

- **Service card**: a bordered card on the home page that is a link to a service page. It has these visible states:
  rest, hover (gold ring), press (moved 2px right and down), and keyboard focus.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With the pointer over a service card, its computed transform equals the resting one, its shadow is a 2px
  gold-500 ring, and its border color equals the resting border color.
- **SC-002**: While a service card is pressed, its computed transform is a 2px right, 2px down move.
- **SC-003**: All existing tests pass, and no underline appears in any state.

## Assumptions

- "The .an-card--hover:hover class" means the hover rule of that class in the site stylesheet. Only the home page's
  service cards use the class, so the change shows only there.
- "Remove the border-color" means deleting that declaration from the hover rule, not setting the border to none or
  transparent.
- The existing transition on the class stays, so the ring eases in as before. The faster 0.05s transform on press is
  also kept.
- The existing rule that moves a service card on pointer-down stays as it is: it is where the 2px move now lives.
- This is a small change on the current branch, with no new branch. As the owner reviews UI changes before committing,
  it is left uncommitted when built.
