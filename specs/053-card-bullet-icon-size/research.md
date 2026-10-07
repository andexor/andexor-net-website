# Research: Card Bullet Icon Size

## Icon size

- **Finding**: The rule `.svg-inline--fa.fa-square-check { height: 15px; width: 15px; }` in `marketing.css` sizes the
  icon (spec 052). `.an-services__bullet-icon` has `flex: none`, so the icon does not shrink when text is long.
- **Decision**: Change both values to `24px`.
- **Alternatives**: `font-size: 24px` on the icon (gives a 30px-wide box with FontAwesome's 1.25em width); `1.5rem`
  (the same 24px at the default root size, but the owner gave pixels and the rule already uses pixels).

## Text size

- **Finding**: `.an-services__bullet` has `font-size: 13px`; `.an-services__card-body` has `font-size: 14px`. The
  typography tokens have `--text-sm: 0.875rem` (14px), but `.an-services__card-body` uses the literal `14px`.
- **Decision**: Set `.an-services__bullet` to `font-size: 14px`, the same literal as `.an-services__card-body`, so the two
  rules match exactly as the owner asked.
- **Alternatives**: `var(--text-sm)` on both (a wider change than asked, and `rem` would differ from `14px` if the root
  size ever changed).

## Alignment and wrapping

- **Finding**: `.an-services__bullet` is `display: flex; align-items: center; gap: 8px`. The icon is a flex item with
  a fixed size, and the text is a `<span>` that takes the rest and wraps.
- **Decision**: No alignment change. Centering holds for one and two lines. The row height becomes the larger of the 24px
  icon and the text block, so cards grow a few pixels per bullet. The 7px gap between bullets stays.
- **Check**: The `span` needs to be able to shrink so a long bullet wraps instead of overflowing. Flex items default to
  `min-width: auto`, which for text wraps normally, so no rule is needed; the e2e overflow checks cover it, and the test
  also asserts every bullet's right edge is inside its card.

## Tests

- **Decision**: In `tests/e2e/card-bullet-check-icon.spec.ts` change the expected width and height from 15 to 24,
  rename the wording, and add: the bullet text's computed `font-size` is `14px` and equals the computed `font-size` of the
  card's `.an-services__card-body`; the icon's vertical center is within 1px of its bullet's vertical center; and the
  bullet's right edge is inside the card's box. It loops over what it finds and counts nothing. The other assertions
  stay.
