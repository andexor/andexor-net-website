# Research: Confirmation Check Size

## Size

- **Finding**: Spec 054 added `.an-contact-confirmation__icon .svg-inline--fa.fa-square-check { height: 28px; width: 28px;
  background: transparent; }`, which outranks the global 24px card bullet rule.
- **Decision**: Change that rule's `height` and `width` to `64px`.
- **Alternatives**: `font-size` on the badge (wrong aspect with FontAwesome's 1.25em width); enlarging the badge as well
  (not requested; the owner asked to keep the round background).

## The box is larger than the badge

- **Finding**: The badge is a 56 by 56 flex container (`align-items: center; justify-content: center`) with no
  `overflow` setting. A 64px svg is larger than the badge. A flex item shrinks by default (`flex-shrink: 1`), so the svg
  could be squeezed toward 56px.
- **Decision**: Add `flex: none` to the scoped rule so the svg keeps 64 by 64. With `justify-content` and `align-items` set
  to `center`, an overflowing item overflows equally on both sides, so the box is centered and extends 4px past the circle
  on every side. The badge keeps its 56px height and `margin: 0 auto 16px`, so the heading and text do not move (overflow
  does not change layout size).
- **Visible shape**: The square-check's viewBox is 448 by 512. At a 64px height the drawing is 56px wide inside the 64px box,
  and the check mark path spans about 103 to 352 of the 448 units across and about 145 to 375 of the 512 units down, which
  is roughly 31 by 29 pixels, centered. The square layer is hidden (opacity 0) and the background is transparent, so
  nothing else is drawn. The mark sits well inside the 56px circle (about 12px margin each side).
- **Scrolling**: The badge's overflow is 4px and symmetric, inside the confirmation's 40px top padding, so it does not
  create a scrollbar. The e2e test checks that the panel and page do not scroll sideways.

## Tests

- **Decision**: Update `tests/e2e/contact-confirmation-icon.spec.ts`: expect the icon at 64 by 64 within 0.5px; keep the
  class, `aria-hidden`, color, transparent background, clear square, solid check mark, badge 56 by 56 and
  `--success-100` and round, and centering within 1px. Add: the visible check mark, measured from the `.fa-primary` path's
  bounding box, lies inside the badge's circle (its box inside the badge's box with at least 8px margin); the heading's top
  edge is at the same position it would have with the previous icon (the test records the badge's bottom edge, which is
  56px below its top, and checks that the heading starts at least 16px below it, as the margin gives); and the confirmation
  panel has no horizontal overflow (`scrollWidth` not greater than `clientWidth`). The card bullet test (24 by 24) stays.
  It loops over what it finds and counts nothing.
