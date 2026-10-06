# Feature Specification: Remove Card Hover

**Feature Branch**: `25-tweak-borders-box-shadows-and-transitions-on-cards`

**Created**: 2026-10-06

**Status**: Implemented

**Input**: User description: "On all service pages and the about-us page, remove the .an-tile:hover class so nothing
changes on hover. These are not links or buttons, so they should not behave like they are."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cards stay still when the pointer is over them (Priority: P1)

A visitor reads a service page or the About Us page and moves the pointer across the cards. Nothing changes: the card
does not lift, its shadow does not deepen, and its border does not brighten. Only things that can be clicked react to
the pointer, so the visitor is not led to think a card is a link or button.

**Why this priority**: This is the owner's direct request, and it is the only change.

**Independent Test**: Open any service page or About Us, read a card's computed `transform`, `box-shadow`, and
`border-color` at rest and with the pointer over it. They are the same.

**Acceptance Scenarios**:

1. **Given** a card on a service page or the About Us page, **When** the pointer moves over it, **Then** its position,
   shadow, and border color stay the same as at rest.
2. **Given** a link inside a card, **When** the pointer is over the link, **Then** the link still changes color as
   before (specs 007 and 045 are not affected).
3. **Given** a card at rest, **When** it is shown, **Then** its look is unchanged from today.

---

### Edge Cases

- The same card style is used on every Markdown content page and on the not-found page, so the change covers all of
  them. Nothing on these pages is meant to react to a hover on the card itself.
- A touch screen has no hover, so it sees no difference.
- The card's transition on position, shadow, and border color has nothing left to animate and is removed with the
  hover rule.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A card MUST NOT change its position, shadow, or border color when the pointer is over it.
- **FR-002**: The hover rule for cards MUST be removed from the site stylesheet, not overridden.
- **FR-003**: The transition that only served the hover rule MUST be removed with it.
- **FR-004**: Links inside cards keep their color change on hover and their focus ring. Nothing about the cards' resting
  look changes.
- **FR-005**: The build and every existing test MUST still pass. A test MUST check that a card's computed styles are
  the same with the pointer over it as at rest. It MUST NOT count cards.

### Key Entities

- **Card**: a bordered block of content on a Markdown content page (and the not-found page). It is not interactive.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every service page and on About Us, a card's computed position, shadow, and border color are identical
  at rest and with the pointer over it.
- **SC-002**: Links in cards still change color on hover.
- **SC-003**: All existing tests pass.

## Assumptions

- "Service pages" are all the Markdown content pages other than About Us. The card style is shared, so About Us, the
  service pages, and the not-found page all change together.
- No replacement hover effect is wanted: "nothing changes" is taken literally.
- This is a small change on the current branch, with no new branch. As the owner reviews UI changes before committing,
  it is left uncommitted when built.
