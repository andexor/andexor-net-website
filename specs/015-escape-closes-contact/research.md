# Research: Esc Closes the Contact Us Popup

## Decision 1: A `keydown` listener on `document`, added while the popup is open

- **Decision**: In `ContactPopup`, `useEffect(() => { if (!open) return; ... }, [open, onClose])` adds
  `document.addEventListener("keydown", handler)` and removes it on cleanup. The handler calls
  `onClose()` for `event.key === "Escape"`.
- **Rationale**: After opening from the keyboard, focus stays on the trigger button behind the scrim
  (the popup does not move focus). Only a document-level listener sees Esc there. It also sees Esc
  from a field or a popup button, which bubble to `document`. One handler covers all three stories.
- **Alternatives considered**:
  - `onKeyDown` on the scrim or panel. Rejected: misses the case where focus is outside the panel.
  - Move focus into the panel on open, then use a panel handler. Rejected: a bigger change to the
    popup's focus behavior, which is outside this request.
  - The native `<dialog>` element with `showModal()`. Rejected: Esc and focus trapping come for free,
    but it changes the popup's markup and styling and its close events; too large for this request.

## Decision 2: Guard against the native "Primary need" list

- **Decision**: Ignore Esc if `select.matches(":open")` is true for the popup's `<select>`, and
  ignore it if `event.defaultPrevented` or `event.isComposing`.
- **Rationale**: Measured with Playwright (headless), using a bare `<select>` and a document
  `keydown` logger:

  | Browser | Esc, list closed, select focused | Esc, list open after a click |
  |---------|----------------------------------|------------------------------|
  | Chromium 153 | reaches the page | does not reach the page; `:open` is `true` before and `false` after |
  | Firefox 155 | reaches the page | reaches the page; `:open` stayed `false` (headless Firefox may not really open the list) |

  So Chromium needs no guard and Firefox may need one. Where `:open` works, it is exact. Where a
  browser lacks it, the selector throws and the guard is skipped.
- **Alternatives considered**: Track "list open" ourselves from mouse and key events. Rejected:
  browsers open the list from many inputs (click, Alt+Down, F4, Space), so this would be fragile
  code for a rare case. Ignore Esc whenever the select has focus. Rejected: it would break Esc from
  a focused but closed select (User Story 2).
- **Residual risk**: real Firefox and Safari behavior with the list open cannot be checked headless.
  It is an optional, low-priority manual step in the quickstart (owner decision). If a browser delivers Esc while its list is open and lacks
  `:open`, the popup would close along with the list; that is a minor annoyance, not data loss
  (it is what the close button does).

## Decision 3: Closing with Esc is the same as the close button

- **Decision**: The handler calls `onClose()` and nothing else.
- **Rationale**: The close button, "OK", and the scrim already call `onClose`, and the popup
  resets its form when it opens (FR-013 in spec 001). That gives "text discarded" and "reopens
  empty" (FR-003) with no new code.

## Decision 4: Tests

- **Decision**: Unit tests in `tests/unit/contact-popup.test.tsx` (`fireEvent.keyDown(document,
  { key: "Escape" })`): closes the form, closes the confirmation, ignored when closed, ignored when
  the select reports `:open`, ignored when `defaultPrevented`. A new `tests/e2e/contact-escape.spec.ts`
  covers keyboard-opened, field-focused, and confirmation cases, and reopening to an empty form.
  One Chromium-only e2e test opens the real list, presses Esc (list closes, popup stays), and
  presses Esc again (popup closes).
- **Rationale**: Unit tests pin the logic; e2e proves it in real browsers. The list test is
  Chromium-only because headless Firefox and WebKit do not open the native list.

## Findings from the code

- `ContactPopup.tsx` has one `useEffect` (reset on open), no key handling, and no focus management.
- It returns `null` when `open` is false, so the listener effect must key off `open`.
- `onClose` is an inline function in `page.tsx` today, so the effect must not re-subscribe in a loop;
  it depends on `[open, onClose]`, which is fine because re-subscribing is cheap.
- Spec 014's plan (not yet built) moves the popup into a provider; the Esc effect is inside the popup
  and is unaffected.
- Existing e2e tests close the popup with the close button and "OK"; they stay valid.

No open questions.
