# Research: Service Card Icon Labels

## Where the icons are drawn

- **Finding**: `Services.tsx` renders the title icon as `<FontAwesomeIcon icon={service.icon} aria-hidden="true" />`
  inside `.an-services__icon-tile`, and the bullet check marks the same way. `services-data.ts` holds each service's
  icon, title, href, description, and bullets.
- **Decision**: Add `iconLabel: string` to `ServiceOffering`, filled for all eight services, and use it on the title
  icon. Keeping it beside `icon` means a swapped icon and its label change together (FR-005).
- **Alternatives considered**: A separate map keyed by title (can drift from the data); writing the strings in the JSX
  (same problem).

## How the label is exposed

- **Finding**: Passing `aria-label` to `FontAwesomeIcon` makes it render `<svg role="img" aria-label="...">` with no
  `aria-hidden`; the footer social icons already work this way, and `social-icon-names.spec.ts` asserts it.
- **Decision**: Replace `aria-hidden="true"` with `aria-label={service.iconLabel}` on the title icon only.
- **Alternatives considered**: `alt` (invalid on an inline SVG); `title` (renders a tooltip and is read inconsistently);
  a label on the card link (would name the link, not the picture).

## Effect on the card link

- **Finding**: The whole card is an `<a>`, so its accessible name is built from its content. It will now start with the
  icon label, for example "source code icon Web Development ...". Tests that find cards by role and name use the title
  text; `homepage-content.spec.ts` and the layout specs select by class or title heading, not by the full link name.
- **Decision**: Accept this; it is what the owner asked for. Run the existing e2e specs to confirm none relied on the
  old link name.

## Tests

- **Decision**: A new spec reads each card by its title heading, checks that the icon's `aria-label` equals the table
  value, that `role` is `img`, that `aria-hidden` is not `true`, that no `alt` is written, and that bullet icons stay
  `aria-hidden="true"`. It iterates over the table and counts nothing.
