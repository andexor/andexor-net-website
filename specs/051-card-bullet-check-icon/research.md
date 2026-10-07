# Research: Card Bullet Check Icon

## Where the check is used

- **Finding**: `Services.tsx` renders Lucide `Check` (size 15, class `an-services__bullet-icon`, `aria-hidden`) once per
  bullet. `ContactPopup.tsx` also uses Lucide `Check` (28px) for its success state, which is not on the page at load.
- **Decision**: Replace only the bullet icons. The popup check is out of scope (spec assumption).

## Which FontAwesome icon

- **Finding**: The site's kit has only brands and duotone solid. `faCheck` exists in
  `@awesome.me/kit-0a6c11d394/icons/duotone/solid`.
- **Decision**: Import `faCheck` from there and render it with `FontAwesomeIcon`, as the service icons do.
- **Alternatives**: a classic solid check (not in the kit); a hand-copied SVG (drifts from the package).

## Size

- **Finding**: FontAwesome's stylesheet gives every icon `height: 1em` and `width: 1.25em`, so left alone the check
  would be 15 by 18.75 pixels (with `font-size: 15px`) instead of 15 by 15.
- **Decision**: Add the override rule the project's pattern asks for, named from the svg's two classes:
  `.svg-inline--fa.fa-check { width: 15px; height: 15px; }`. Two classes outrank FontAwesome's one, so no `!important`.
  The sizes are plain pixels because the surrounding element, the list item, has no size to inherit.
- **Alternatives**: `font-size: 15px` on the icon (wrong width); `width: inherit` (the list item is as wide as the
  card); patching FontAwesome's CSS (forbidden by CLAUDE.md).

## Color

- **Decision**: Keep the `an-services__bullet-icon` class, whose `color: var(--gold-600)` already colors the icon.
  Duotone icons draw the main layer in the current color and the second layer at 40% of it, so both are gold.
  Keep `flex: none`.
- **Rationale**: Reuses the token, so no copied color value (FR-003).

## Tests

- **Decision**: One e2e spec on the home page. For each `.an-services__bullet`, find the `svg` and assert: its box is
  15 by 15 within 0.5px; its computed `color` equals the computed `color` of a reference taken from the page (the
  `--gold-600` token resolved on an element); it has `aria-hidden="true"`; and it carries the `fa-check` class. It
  loops over what it finds and counts nothing. Text position and card height are covered by the existing layout
  tests plus a check that the text's left edge is the svg's right edge plus 8px.
