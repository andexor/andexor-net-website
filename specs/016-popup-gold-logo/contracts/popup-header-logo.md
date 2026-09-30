# Contract: Popup Header Logo

## Rules

- The Contact Us popup header contains one `<img class="an-contact-header__logo">` whose `src` is
  `/logo/logo-gold.svg` and whose `alt` is empty.
- It is 34 by 34 px, has no corner radius and no background, and sits immediately left of the "Contact
  Us" title with the header's 12px gap. The header's height and the title's position are unchanged.
- It is present in the popup's form state and its "Request received" state, whichever trigger opened it
  (hero, call-to-action band, footer) and on whichever page.
- The image loads (no broken-image state).
- `logo-gold.svg` appears in exactly two files under `src/`: `Logo.tsx` and `ContactPopup.tsx`.
- No other logo on the site changes.

## Checked by tests

| Check | Where |
|-------|-------|
| Header `img` has `src` `/logo/logo-gold.svg` and `alt` `""`, in the form state and after a send | `tests/unit/contact-popup.test.tsx` (edited) |
| `logo-gold.svg` is referenced by exactly `Logo.tsx` and `ContactPopup.tsx` under `src/` | `tests/unit/logo.test.tsx` (edited) |
| From the hero button on `/`: the image is loaded (`complete`, `naturalWidth > 0`), is 34 by 34, has a transparent background and zero radius, and is 12px left of the title | `tests/e2e/contact-popup-logo.spec.ts` (new) |
| The same from the footer on `/web-development` | `tests/e2e/contact-popup-logo.spec.ts` |
| Popup passes WCAG 2.1 AA in both states | `tests/e2e/contact-popup-a11y.spec.ts` (existing) |
| Other logos unchanged | `tests/unit/logo.test.tsx` (existing lockup tests) |
