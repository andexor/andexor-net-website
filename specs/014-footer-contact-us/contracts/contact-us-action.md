# Contract: Contact Us Action

## Rules

- There is one Contact Us popup per page, rendered by `ContactProvider` in the root layout.
- Every trigger opens it through `useContact().openContact(opener?)` (the footer button passes itself; the others omit it): the hero button, the call-to-action
  band button, and the footer entry.
- The footer entry is a `<button type="button" aria-haspopup="dialog">` labeled exactly "Contact Us"
  in the Company column, after "About Us". It is not a link and has no `href`.
- Activating it does not navigate, change the address, or scroll the page.
- On close, keyboard focus returns to the element that opened the popup, if it is still on the page.
- The footer entry looks like the other footer entries: `an-footer__col-link`, color change on hover,
  visible focus ring, no underline at rest, on hover, or on focus.
- `useContact()` throws if used outside `ContactProvider`.
- The popup itself (`ContactPopup`) is unchanged.

## Checked by tests

| Check | Where |
|-------|-------|
| `openContact` opens the popup; closing it returns focus to the opener; the hook throws outside a provider | `tests/unit/contact-provider.test.tsx` (new) |
| The footer's Company column reads "About Us", "Contact Us"; no entry reads "Contact" | `tests/e2e/footer-contact.spec.ts` (new) |
| From `/`, `/web-development`, and `/nope`: the footer's "Contact Us" opens the dialog; the address does not change; the page does not scroll; closing returns focus to the footer button | `tests/e2e/footer-contact.spec.ts` |
| Filling the form and sending from the footer-opened popup shows the same confirmation | `tests/e2e/footer-contact.spec.ts` |
| The footer entry is a button with `aria-haspopup="dialog"`, not a link; it is not underlined at rest, on hover, or on focus | `tests/e2e/footer-contact.spec.ts` |
| The home page has exactly one dialog when open, and the hero and CTA band buttons still open it | `tests/e2e/contact-flow.spec.ts` (existing, CTA test edited) |
| Footer renders inside the provider in unit tests | `tests/unit/content-links.test.tsx`, `tests/unit/logo.test.tsx` (edited) |
| No `#top` link, no hover underline in CSS | existing `no-top-links.test.ts`, `no-hover-underline.test.ts` |
