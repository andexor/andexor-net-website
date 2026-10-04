# Data Model: Esc Closes the Contact Us Popup

No stored data and no new state. The popup's existing `open` flag decides whether the Esc listener
exists.

## Popup close paths (after this feature)

| Path | Where | Result |
|------|-------|--------|
| Close button | popup header | `onClose()` |
| "OK" | confirmation | `onClose()` |
| Click outside the panel | scrim | `onClose()` |
| Esc (new) | anywhere, while open | `onClose()`, unless the "Primary need" list is expanded |

Every path ends in the same `onClose()`. The popup resets its form on the next open (spec 001
FR-013), so text is discarded and reopening shows the empty form.

## Esc handling rules

| Situation | Esc closes the popup? |
|-----------|-----------------------|
| Popup closed | No (no listener) |
| Popup open, form showing | Yes |
| Popup open, confirmation showing | Yes |
| Focus on the page, in a field, or on a popup button | Yes |
| "Primary need" list expanded | No; the list closes. A second Esc closes the popup |
| Another handler already used the event (`defaultPrevented`), or an input method is composing | No |
