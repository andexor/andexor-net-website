# Research: Confirmation Square Check

## Where the check is

- **Finding**: `ContactPopup.tsx` line 164 renders Lucide `<Check size={28} strokeWidth={2.5} aria-hidden="true" />` inside
  `<div className="an-contact-confirmation__icon">`. `.an-contact-confirmation__icon` is a 56px circle with
  `background: var(--success-100)`, `color: var(--success-600)`, flex-centered. `ArrowRight` and `X` stay imported from Lucide.
- **Decision**: Replace only that element. Drop `Check` from the Lucide import.

## Icon and size

- **Finding**: FontAwesome's stylesheet gives `.svg-inline--fa` `height: 1em; width: 1.25em`. The card bullet rule
  `.svg-inline--fa.fa-square-check { 24px }` (spec 053) is a global two-class rule, so it would also size this icon to 24px.
- **Decision**: Add `.an-contact-confirmation__icon .svg-inline--fa.fa-square-check { height: 28px; width: 28px; }`. Three
  classes outrank the global rule, so no `!important`, and the card bullets keep 24px. The rule is named from the svg's two
  classes plus the badge that holds it, following the project's sizing pattern.
- **Alternatives**: change the global rule to 28px (breaks the bullets); scope the bullets' rule instead (a wider change
  than needed); `font-size: 28px` on the badge (gives 28 by 35px).

## Colors and clear square

- **Finding**: The badge already sets `color: var(--success-600)`, which the icon's layers draw in (`currentColor`). The
  duotone secondary layer is a `.fa-secondary` path at `opacity: var(--fa-secondary-opacity, 0.4)`. Custom properties inherit.
- **Decision**: Add `--fa-secondary-opacity: 0` to `.an-contact-confirmation__icon`, so the square layer is clear and only
  the check mark (the `.fa-primary` path) shows over the `--success-100` circle. Add `background: transparent` through a
  rule on the svg (inside the same new rule) so the icon element has no fill of its own, as the owner asked.
- **Alternatives**: put the custom property on the svg only (same result, but then the badge rule and the svg rule both
  carry icon details; the badge is the better place since it is the container the owner described).

## Tests

- **Decision**: New e2e spec `tests/e2e/contact-confirmation-icon.spec.ts`. Open the popup on `/`, fill the form, send, and on
  the Request received screen assert for the badge's svg: class `fa-square-check` and not `fa-check`; 28 by 28 within 0.5px;
  `aria-hidden="true"`; computed `color` equals the resolved `--success-600`; computed `background-color` of the svg is
  `rgba(0, 0, 0, 0)`; the `.fa-secondary` path has computed `opacity` `0` and the `.fa-primary` path `1`; the badge is 56 by 56
  with the resolved `--success-100` background and a 999px radius; and the icon's center is within 1px of the badge's
  center. It also asserts that the page's card bullet icons still measure 24 by 24 (the two sizes must not interfere),
  counting nothing. Existing popup focus, Escape, axe, and unit tests cover the rest.
