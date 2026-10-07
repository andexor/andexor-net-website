# Research: Card Title Beside Icon

## Markup

- **Decision**: Move the existing `<h3 className="an-services__card-title">` inside `<div className="an-services__card-top">`,
  after the icon tile `<span>`. Keep it an `h3`.
- **Rationale**: Keeps the heading outline and the card's accessible name as they are, and needs no new element.
- **Alternatives**: wrap icon and title in a new element (extra markup for no gain); use CSS grid on the whole card
  (reflows description and bullets too, more change than asked).

## Layout

- **Decision**: On `.an-services__card-top`: `gap: 16px`, `align-items: center` (already set), and change
  `justify-content` from `space-between` to `flex-start` (there is no right-hand item now). Keep `margin-bottom: 16px`.
  On `.an-services__icon-tile`: `flex: none`, so a long title cannot squeeze the 48px icon. On
  `.an-services__card-title`: `margin: 0`, `text-align: left`, `min-width: 0` so it wraps inside the card instead of
  overflowing.
- **Rationale**: Flex centering puts one-line and two-line titles on the icon's vertical center with no per-card
  rules. A two-line title at 20px is about 52px tall, so the row grows slightly and the icon stays centered.
- **Spacing**: the title used to have 6px below it before the description. With it in the row, the row's own 16px
  bottom margin is the space above the description, which gives the 48px icon room and matches the card's other gaps.
- **Gap value**: 16px, from the spec's assumption of about 16px.
- **Alternatives**: `align-items: flex-start` (rejected: the owner asked for vertical centering).

## Tests

- **Decision**: One e2e spec on the home page. For each service card, read the bounding boxes of the icon tile and the
  `h3`: the title's left is at least 12px right of the icon's right edge, the vertical centers are within 1px when the
  title's height is at most one line, the title's right edge is inside the card, and its computed `text-align` is
  left (or start). It loops over the cards found and does not assert how many there are. The existing axe and
  no-horizontal-scroll checks cover the rest. A narrow-viewport run (360px) checks the title stays inside the card.
