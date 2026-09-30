# Implementation Plan: Esc Closes the Contact Us Popup

**Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/015-escape-closes-contact/spec.md`

## Summary

`ContactPopup` renders the dialog when its `open` prop is true and calls `onClose` from the close
button, "Done", and a click on the scrim. It has no keyboard handling. The plan adds one effect in
`ContactPopup.tsx`: while `open` is true, listen for `keydown` on `document` and call `onClose` when
the key is Escape. A document-level listener works wherever focus is (spec User Story 2), covers the
form and the confirmation (both are the same `open` state), and needs no change to the hero,
call-to-action band, or footer triggers. Two guards keep it from doing harm: it ignores an Esc that
another handler already used, and it ignores Esc while the "Primary need" list is expanded (User Story
3). No new files in `src/`, no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change; the listener exists only while the popup is open

**Constraints**: the popup's look, fields, and other ways to close are unchanged (FR-007); Esc must
not close the popup when the popup is closed (FR-004) or when the native "Primary need" list is
open (FR-005); no focus trap or other dialog behavior is added

**Scale/Scope**: 1 effect in 1 component, 1 unit test file edited, 1 new e2e spec, spec 001 and spec
014 amended

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. One `useEffect` with one listener. No focus-trap or dialog library. |
| II. Component stack | Pass. Plain React. |
| III. Accessibility & performance | Pass, and improved: Esc is the standard way to dismiss a dialog. The listener is added and removed with `open`. |
| IV. Design & content consistency | Pass. One popup, one behavior for all triggers. |
| V. Test-first | Pass. Tests are written first and fail until the effect exists. |
| VI. Always-dark, no link underlines | Not affected. |
| VII. Graceful shutdown | Not affected; the usual Docker check still applies. |
| VIII. Markdown-authored pages | Not affected. |
| License header | The new e2e spec file gets the SPDX header. |

No violations; Complexity Tracking is empty. No constitution change.

## Project Structure

### Documentation (this feature)

```text
specs/015-escape-closes-contact/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── escape-key.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/components/contact/ContactPopup.tsx      # edit: Esc-to-close effect while open

tests/
├── unit/contact-popup.test.tsx              # edit: Esc closes, ignored when closed, ignored with the list open
└── e2e/contact-escape.spec.ts               # new: Esc from the form, a field, and the confirmation; reopen is empty

specs/001-homepage-contact-us/{spec.md,contracts/ui-contracts.md}   # edit: Esc is a way to close
specs/014-footer-contact-us/{spec.md,plan.md,research.md,data-model.md,contracts/contact-us-action.md}   # edit: drop "Esc is not added"
```

**Structure Decision**: Existing single Next.js project; the change is inside `ContactPopup`, so it
holds whichever trigger opened the popup, and whether or not spec 014's provider exists.

## Design Decisions

- **Document-level listener, not a handler on the panel.** A handler on the panel would work only
  when focus is inside it. After opening from the keyboard, focus stays on the trigger button behind
  the scrim, so a panel handler would miss the main case (User Story 2).
- **Inside `ContactPopup`.** The component already owns "is it open" and the close call, so the
  Esc behavior travels with it to every page and trigger.
- **Two guards.** (1) Skip if `event.defaultPrevented` or `event.isComposing`, so an input method or
  another handler that used Esc keeps it. (2) Skip if the "Primary need" `<select>` is expanded,
  checked with `select.matches(":open")` inside a `try` (browsers without the `:open` selector throw
  a `SyntaxError`, which is treated as "not open").
- **Browsers do most of the work for the dropdown.** Measured with Playwright: with the list open,
  Chromium 153 does not send Esc to the page at all (it closes the list), and `:open` is supported
  there. Firefox 155 sends Esc to the page, so the `:open` guard is what protects the list there. The
  guard's real-Firefox and Safari behavior can optionally be tried by hand (see quickstart; low priority).
- **Esc is not treated as a submit or a discard prompt.** It calls the same `onClose` as the close
  button, and the existing reset-on-open effect gives an empty form next time.
- **No `preventDefault`.** Esc has no default action on this page, so nothing needs suppressing
  (FR-006 is satisfied by not handling scroll or navigation at all).
- **`"Escape"` only.** The legacy `"Esc"` key value was for old Edge and Internet Explorer.

## Complexity Tracking

None.
