# Research: Remove Button Arrows

## Where the arrow is used

- **Finding**: `ArrowRight` is used twice, both as `rightIcon` on the shared `Button`: `CTABand.tsx` line 29
  (`<ArrowRight size={18} />`) and `ContactPopup.tsx` line 219 (`<ArrowRight size={18} aria-hidden="true" />`). It is imported
  in both files, and `ContactPopup.tsx` also imports `X` for the Close button.
- **Decision**: Delete both `rightIcon` props and the `ArrowRight` import in each file.
- **Leftover import**: `CTABand.tsx` imports only `ArrowRight` from Lucide, so its whole `lucide-react` import goes.

## Keep or change the Button component

- **Finding**: `Button` renders `{leftIcon}{children}{rightIcon}` and ignores undefined icons. `.an-btn` is
  `display: inline-flex; align-items: center; justify-content: center; gap: 0.5em; padding: 0.7em 1.15em`. With one child,
  the label is centered, and `gap` has nothing to separate.
- **Decision**: No change to `Button` or any style.
- **Alternatives**: remove `leftIcon` and `rightIcon` from `Button` (they are unused now but are a normal part of the
  design system; the owner asked only to remove two uses).

## Layout

- **Finding**: Without the arrow (18px) and the 0.5em gap, each button is about 27px narrower at the button's 14px font.
  Padding is unchanged, so the label keeps the same side space. Send is centered in the form by its container, and Contact Us
  sits in the call-to-action band's button wrap, so neither shifts.
- **Check**: `send-button-style.spec.ts` compares Send and Contact Us with `width` zeroed out, so it keeps passing.
  `ok-button.spec.ts` compares OK and Send on everything but width.

## Tests

- **Decision**: In `tests/e2e/ok-button.spec.ts` change `expect(send.arrows).toBe(1)` to `toBe(0)`, and update the test
  title and comment accordingly ("OK looks like Send, and is centered"). Add `tests/e2e/button-no-arrow.spec.ts`: on `/`,
  the Contact Us button in the call-to-action band (the `.an-cta-band__button-wrap` button) has no `svg`; its label is
  centered (the text node's range box center is within 1px of the button's center); open the popup and assert the same
  for the Send button. It counts nothing.
