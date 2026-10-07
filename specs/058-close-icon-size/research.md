# Research: Close Icon Size

## Size

- **Finding**: Spec 057 added `.an-contact-header__close .svg-inline--fa.fa-square-x { height: 22px; width: 22px;
  background: transparent; }`. The button is `width: 38px; height: 38px; padding: 0; display: flex; align-items: center;
  justify-content: center; border: 1px solid ...; overflow: hidden`.
- **Decision**: Change `height` and `width` to `36px` and add `flex: none`.
- **Alternatives**: `font-size` on the button (wrong width with FontAwesome's 1.25em); enlarging the button as well (the owner
  chose the icon only).

## Fit inside the button

- **Finding**: The button is 38px outside with a 1px border, so its inner (padding) box is 36 by 36 pixels. The icon is 36 by
  36, so it exactly fills the inner box and touches the inside of the border on every side, with no clipping. In the spec's
  terms, it has 1 pixel of space to the button's outer edge, which is the border.
- **Risk**: `overflow: hidden` on the button clips anything outside the padding box. The icon is exactly the padding box, so
  nothing is clipped. A flex item shrinks by default, which could reduce the width below 36 if the container is narrower than
  the item; `flex: none` prevents it. The drop shadow (`filter: drop-shadow`) is drawn outside the icon's box and would be
  clipped at the edge where the icon touches it, but the shadow only matters beneath the X mark, which is about 10px inside the
  box, so it is not visibly affected.
- **Header height**: The header is a flex row with `padding: 22px 24px`, so its height is 44px of padding plus its tallest child,
  which is the 38px button (about 82px), unless the title is taller. The button stays 38px, and the icon sits inside it, so the
  header does not change height. The e2e test checks that the header's height equals 44px plus the button's height within 1px, which
  holds today and must keep holding.
- **Visible X**: The drawing is 448 by 512 units. At 36px high it is 31.5px wide, and the X mark is a little over half of that, so
  about 16px across, centered.

## Press and hover

- **Finding**: `:active` moves the button by `translate(2px, 2px)` and changes its shadow; `:hover` changes its gradient. Neither
  depends on the icon's size, and the icon moves with the button.

## Tests

- **Decision**: In `tests/e2e/contact-close-icon.spec.ts` change the expected icon width and height from 22 to 36. Add: the icon
  box lies inside the button's box on every side (`left`, `right`, `top`, `bottom`); and the popup header's height equals 44px plus the button's height within 1px, which is what it is with the old icon (the
  button is the header's tallest child). The button stays 38 by 38 and
  keeps its gradient. It counts nothing.
