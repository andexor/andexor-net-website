# Implementation Plan: Contact Source Page

**Branch**: `59-record-originating-page-in-contact-form` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

## Summary

`ContactProvider` calls `usePathname()` and, in `openContact`, saves the current pathname in state next to `open`. It
passes it to `ContactPopup` as `sourcePath`. The popup renders `<input type="hidden" name="sourcePath" value=...>`
inside the form and adds `sourcePath` to `ContactRequest` and to the request built in `handleSubmit`. No trigger
changes.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new (`next/navigation`).

**Testing**: Vitest (`contact-popup.test.tsx`, `contact-provider.test.tsx`, with `next/navigation` mocked). No e2e
check is added: nothing is transmitted yet, so the request is only visible to the unit tests.

**Constraints**: Prettier formatting; straight quotes; no count assertions; popup looks and behaves as before.

## Constitution Check

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One state value, one hidden input, no new parameter. |
| III. Accessibility & performance | Pass. A hidden input is not rendered or focusable. |
| IV. Design & content consistency | Pass. No visible change. |
| V. Test-first | Pass. Tests are written first and seen to fail. |

No violations.

## Design notes

- The path is stored in state at open time (not read from `usePathname()` during render of the popup) so the value is
  fixed for as long as the popup is open and refreshed on every open.
- Fallback when `usePathname()` is null (no router, as in unit tests): "/".
