# Research: Card Bullet Square Check

## The icon

- **Finding**: `faSquareCheck` is exported by `@awesome.me/kit-0a6c11d394/icons/duotone/solid`, the module that already
  supplies the service icons and, since spec 051, `faCheck`. Its `<svg>` classes are `svg-inline--fa fa-square-check`.
- **Decision**: Use `faSquareCheck` in place of `faCheck` in `Services.tsx`.
- **Alternatives**: none; the owner named the icon.

## Size

- **Finding**: FontAwesome's one-class rule gives `height: 1em; width: 1.25em`. The override rule from spec 051 fixes
  15 by 15 pixels for `.fa-check`. The square-check has the same 512-unit height as the check but is a different
  shape, so it needs its own rule name.
- **Decision**: Rename the selector in `marketing.css` to `.svg-inline--fa.fa-square-check`, keeping `height: 15px;
  width: 15px`. Leave nothing named `.fa-check` behind, because the check is no longer used on the site.
- **Note**: The square-check's mark is smaller inside the same box, which the spec lists as an edge case. Size stays 15px.

## Color

- **Decision**: In `marketing.css`, change `.an-services__bullet-icon` from `color: var(--gold-600)` to
  `color: var(--gold-300)`, and add `background: transparent` and `--fa-secondary-opacity: 0` to it. The primary layer (the check mark) draws in
  that color at full strength.
- **Background**: The `<svg>` and the `<li>` already have no background, so `background: transparent` states the
  requirement and guards against a future change. The icon's square is its secondary layer (the `.fa-secondary` path, which has the check cut out of it), and the
  owner confirmed it should be clear, so `--fa-secondary-opacity: 0` hides it and only the check mark is drawn. The
  icon's footprint, and so its 15px box, is unchanged.

## Tests

- **Decision**: In `tests/e2e/card-bullet-check-icon.spec.ts`, change the class check to `fa-square-check`, rename the
  test's wording to say square-check, and keep the other assertions (15 by 15, `aria-hidden`, 8px gap), compare the color with `--gold-300`, and assert the icon's and its bullet's
  computed `background-color` is transparent (`rgba(0, 0, 0, 0)`), and that the icon's `.fa-secondary` path has computed
  `opacity` 0. It still
  loops over what it finds and counts nothing. The file keeps its name so its history stays with it.
