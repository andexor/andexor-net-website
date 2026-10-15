# Tasks: Contact Source Page

**Tests**: first, seen to fail. No counts. Straight quotes only. Prettier for `src/` and `tests/`. Stay on branch
`59-record-originating-page-in-contact-form`. The owner reviews before committing; do not commit.

- [X] T001 Tests: in `tests/unit/contact-popup.test.tsx`, the request passed to `onSubmit` has `sourcePath` equal to
  the `sourcePath` prop, and the form has no visible field for it.
- [X] T002 Tests: in `tests/unit/contact-provider.test.tsx`, mock `next/navigation`; opening on "/" then sending gives
  "/", opening with the mock set to "/web-development" gives that path, and a later open after the mock changes gives
  the new path.
- [X] T003 `src/components/contact/ContactPopup.tsx`: add `sourcePath` prop, hidden input, `ContactRequest.sourcePath`.
- [X] T004 `src/components/contact/ContactProvider.tsx`: `usePathname()`, save the path in `openContact`, pass it down.
- [X] T005 Update spec 001 `data-model.md` Contact Request to list the source path.
- [X] T006 Run `bun run format`, `bun run test`, and the Playwright contact specs; check no curly quotes and no hover
  underline; port 3000 free afterward.

Note: the hidden input matched the Tab trap's `input:not([disabled])` selector, so `FOCUSABLE` in `ContactPopup.tsx` now
excludes `[type="hidden"]`. The Playwright Tab-order specs cover it.
