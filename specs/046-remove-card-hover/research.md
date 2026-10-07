# Research: Remove Card Hover

## Delete the rule, do not override it

- **Decision**: Delete `.an-tile:hover` from `src/styles/cards.css`.
- **Rationale**: The owner asked to remove it. An override such as `transform: none` would leave dead CSS (FR-002).
- **Alternatives considered**: A scoped override for service pages and About Us only. Rejected: the card style is shared
  and no page wants a hover on a card.

## Delete the transition too

- **Decision**: Remove the `transition` on `.an-tile` (transform, box-shadow, border-color).
- **Rationale**: Those three properties change only in the hover rule. Nothing else sets them on a card, so the
  transition would do nothing (FR-003).
- **Alternatives considered**: Keep it. Rejected: dead CSS.

## Not-found page

- **Decision**: It changes with the rest, because it uses the same class.
- **Rationale**: Its card is not a link or button either. Existing not-found tests check resting styles and need no
  change; this is confirmed when the suite runs.

## Test

- **Decision**: One Playwright test loads a service page and About Us, reads a card's computed `transform`,
  `box-shadow`, and `border-color`, hovers the card, reads them again, and expects them to match.
- **Rationale**: The transition is gone, so the values are final immediately; no wait is needed. The test makes no
  count assertion.
