# Research: Close Square X

## Where the X is

- **Finding**: `ContactPopup.tsx` renders the Close button once, in the header that both screens share (the form and the
  confirmation are children of the same panel):
  `<button onClick={onClose} aria-label="Close" className="an-contact-header__close"><X size={22} strokeWidth={3}
  aria-hidden="true" /></button>`. `X` is the last name imported from `lucide-react` in this file, and no other file in
  `src/` imports Lucide now (spec 056 removed the arrows).
- **Decision**: Replace only that element, and remove the `lucide-react` import line.

## Icon

- **Finding**: `faSquareX` is exported by `@awesome.me/kit-0a6c11d394/icons/duotone/solid`. Its svg has class
  `fa-square-x`. It has a `.fa-secondary` path (the square, with the X cut out of it) and a `.fa-primary` path (the X).
- **Decision**: `<FontAwesomeIcon icon={faSquareX} aria-hidden="true" />`.

## Size, color, and clear square

- **Finding**: `.an-contact-header__close` is a 38 by 38 flex-centered button with `color: #ffffff` and a glossy gradient
  background; `.an-contact-header__close svg` adds a small drop shadow to any svg. The FontAwesome default is
  `1em` high and `1.25em` wide, and layers draw in `currentColor`.
- **Decision**: In `marketing.css`, add `--fa-secondary-opacity: 0` to the existing `.an-contact-header__close` size rule
  (the one that sets width, height, and flex centering), and add
  `.an-contact-header__close .svg-inline--fa.fa-square-x { height: 22px; width: 22px; background: transparent; }`.
  The icon takes its white from the button's `color`, so no color is added. The existing svg drop shadow stays, so the X
  keeps the shadow the old one had.
- **Scope**: The new selector includes `.fa-square-x` and the button, so it affects no other icon. The check icon rules
  (`fa-square-check`) are unaffected.
- **Alternatives**: a global `.svg-inline--fa.fa-square-x` rule (not needed; this icon is used once); `font-size: 22px`
  on the button (wrong width with FontAwesome's 1.25em).

## Layout

- **Finding**: A 22px icon in a 38px flex-centered button is centered with 8px around it. The icon's drawing is 448 by 512
  units, so at a 22px box height its width is 19px inside the 22px box, and the X mark is a little over half of that.
- **Note**: The X will look smaller than the old Lucide X, which filled most of the 22px box with a heavy stroke. This follows
  from keeping the size, and is listed in the spec's edge cases.

## Dependency

- **Finding**: After this change nothing in `src/` imports `lucide-react`, but `package.json` still lists it.
- **Decision**: Leave the dependency in place in this change, and mention it to the owner. Removing it is a separate
  change to `package.json` and `bun.lock`, which also need the license report to be refreshed.

## Tests

- **Decision**: New `tests/e2e/contact-close-icon.spec.ts`. Open the popup and assert, for the Close button on the form screen
  and again after sending the form (the Request received screen): the button contains exactly the one svg with class
  `fa-square-x` and not an `lucide` class; the svg is 22 by 22 within 0.5px; `aria-hidden="true"`; its computed `color`
  equals white; its computed `background-color` is `rgba(0, 0, 0, 0)`; the `.fa-secondary` path has computed `opacity` `0` and
  the `.fa-primary` path `1`; its center is within 1px of the button's center; the button is 38 by 38 and still has a
  `linear-gradient` background image; and the button's accessible name is "Close". It counts nothing. The existing popup
  tests cover focus, Escape, and axe.
