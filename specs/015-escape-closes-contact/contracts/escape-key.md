# Contract: Esc Closes the Contact Us Popup

## Rules

- While the popup is open, pressing Escape calls the popup's `onClose`, once per press.
- It works wherever focus is: on the page, in a field, on the close button, on "Send", on "Done".
- It works on the form and on the "Request received" confirmation.
- While the popup is closed, Escape does nothing to the site (no listener exists).
- While the "Primary need" list is expanded, Escape closes only the list.
- Escape is ignored if `event.defaultPrevented` or `event.isComposing`.
- The close button, "Done", and the scrim keep working. The popup's markup and look are unchanged.
- The popup's form resets on open, so text typed before an Esc is gone next time.

## Checked by tests

| Check | Where |
|-------|-------|
| Esc calls `onClose` from the form and from the confirmation | `tests/unit/contact-popup.test.tsx` (edited) |
| Esc does nothing when `open` is false | `tests/unit/contact-popup.test.tsx` |
| Esc is ignored while the select reports `:open`, and when `defaultPrevented` | `tests/unit/contact-popup.test.tsx` |
| Open by keyboard, press Esc with focus on the page: it closes | `tests/e2e/contact-escape.spec.ts` (new) |
| Esc with focus in a text field closes it; reopening shows an empty form | `tests/e2e/contact-escape.spec.ts` |
| Esc on the confirmation closes it | `tests/e2e/contact-escape.spec.ts` |
| With the popup closed, Esc changes nothing on `/` and `/web-development` | `tests/e2e/contact-escape.spec.ts` |
| Real "Primary need" list: first Esc closes the list only, second closes the popup (Chromium only) | `tests/e2e/contact-escape.spec.ts` |
| The existing close button, "Done", and scrim tests still pass | `tests/e2e/contact-flow.spec.ts` (existing) |
