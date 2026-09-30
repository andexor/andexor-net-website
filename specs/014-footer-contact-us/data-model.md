# Data Model: Contact Us Action

No stored data. The one shared piece of state is whether the popup is open, plus the element to
return focus to.

## Contact state (in `ContactProvider`)

| Field | Type | Notes |
|-------|------|-------|
| `open` | boolean | Starts `false`. `true` renders the one `ContactPopup`. |
| `returnFocusTo` | element or none | The element that had focus when the popup opened. Cleared after focus is returned. |

## Context value (`useContact()`)

| Member | Effect |
|--------|--------|
| `openContact(opener?)` | Records `opener` (or, if omitted, the focused element) to return focus to, then sets `open` to `true`. The footer button passes itself as `opener`. |

The popup's own close handler calls the provider's close: `open` becomes `false`, then focus goes
back to `returnFocusTo` if it is still in the document.

## Triggers

| Trigger | Where | Element |
|---------|-------|---------|
| Hero "Contact Us" | home page | `<button>` (existing) |
| Call-to-action band "Contact Us" | home page | `<button>` (existing) |
| Footer "Contact Us" | every page with the footer | `<button aria-haspopup="dialog">` (new) |

The popup's fields, validation, confirmation, and reset-on-reopen are unchanged (spec 001).
