# Research: Service Card Hover

## Edit the existing rule

- **Decision**: Change `.an-card--hover:hover` in `src/styles/components.css` in place.
- **Rationale**: The owner named that rule, then said to keep the transform on `:active` and remove the one on
  `:hover`. So the hover rule loses its `transform` and the card moves only when pressed. Only `Card` with `hover` uses it, and the only such cards are the home
  page's service cards (`src/components/marketing/Services.tsx`), so the change shows only there (FR-001 to FR-003).
- **Alternatives considered**: An override in `marketing.css` for `.an-services__card`. Rejected: it would leave the old
  hover values in place and add a rule, and the owner asked to change the class.

## Border color

- **Decision**: Delete the `border-color` declaration from the hover rule.
- **Rationale**: "Remove" means the border keeps its resting color (`--border-subtle`). Setting it to `none` or
  `transparent` would change the card's look.
- **Alternatives considered**: `border-color: inherit` or a reset to the resting token. Rejected: it is the same as
  removing the line, with more CSS.

## The press rule

- **Decision**: Keep `.an-services__card.an-card--hover:active` in `marketing.css` with its transform and transition.
  Only its comment changes: it says the extra class outranks the design system's hover lift, and that lift no longer
  exists.
- **Rationale**: It is now the only place the card moves, as the owner asked (FR-001, FR-005). The extra class is still
  harmless, and the 0.05s transform transition keeps the quick press feel.
- **Alternatives considered**: Moving the transform into `.an-card--hover:active` in `components.css`. Rejected: not
  asked for.

## Transition

- **Decision**: Keep the transition on `.an-card--hover`. It still names `transform` (used by the press) and
  `border-color`, which no longer changes.
- **Rationale**: The spec says the transition stays. The `border-color` entry is inert and harmless.
- **Alternatives considered**: Dropping `border-color` from the transition list. Rejected: not asked for.

## Visibility of the ring

- **Decision**: Use `var(--gold-500)` as written.
- **Rationale**: Gold-500 is the site's accent, already used for focus rings and button glows on the dark surface, so
  the 2px ring is easy to see.
- **Alternatives considered**: None; the owner chose the token.

## Test

- **Decision**: One Playwright test loads `/`, takes the first `.an-services__card`, and reads its computed
  `transform`, `box-shadow`, and `border-color` at rest. On hover it expects the transform to equal the resting one,
  the shadow to be a 2px gold-500 ring, and the border color to equal the resting one. While the mouse button is held
  down on the card it expects the transform to be a 2px right, 2px down move (`matrix(1, 0, 0, 1, 2, 2)`). The gold-500
  value is resolved from the token on the page, not written as a literal. It uses Playwright's retrying matchers to
  wait for the transitions, and makes no count assertion.
- **Rationale**: The values are what the owner specified, and the test names the token.
