# Tasks: How Can We Help You Field

Tests first, seen to fail. Straight quotes. Prettier. The owner reviews before commit; do not commit. Stay on `71-help-field`.

- [X] T001 Tests: `tests/unit/input.test.tsx` for `Textarea` (label, optional has no asterisk, required has it).
- [X] T002 Tests: `tests/unit/contact-popup.test.tsx` (field under Website, `help` name and id, four lines, optional,
  request carries `help`, empty on reopen).
- [X] T003 Tests: `tests/e2e/contact-help-field.spec.ts` (Tab order, Enter makes a new line and does not send, sends
  with and without text); update the Tab walks in `keyboard-navigation.spec.ts`, `contact-popup-a11y.spec.ts`,
  `contact-phone-field.spec.ts`.
- [X] T004 `src/components/ui/Input.tsx`: shared `Field`, new `Textarea`.
- [X] T005 `src/styles/components.css`: `textarea.an-input { resize: vertical; }`.
- [X] T006 `src/components/contact/ContactPopup.tsx`: the field and `help` in the request.
- [X] T007 `design/README.md`, `design/ui_kits/marketing-site/ContactUs.jsx.txt`, `design/_ds_bundle.js`,
  `specs/001-homepage-contact-us/data-model.md`.
- [X] T008 Format, run all tests, check quotes and hover underline, free port 3000.

## Counter and progress bar

- [X] T009 Tests: `tests/unit/input.test.tsx` (counter text, fill percentage, maxlength, described by the counter,
  no counter without `maxLength`), `tests/unit/contact-popup.test.tsx` (250 and "0/250" in the strip),
  `tests/e2e/contact-help-field.spec.ts` (same line and right-justified, label narrower than the field, Source Code Pro,
  40 percent fill at 100, the browser stops at 250, no accessibility violation at 95 percent).
- [X] T010 `src/components/ui/Input.tsx`: `Textarea` counter and strip.
- [X] T011 `src/styles/components.css` and `src/styles/marketing.css`: strip, counter, fill, near-limit tint, reduced
  motion.
- [X] T012 `src/components/contact/ContactPopup.tsx`: `maxLength={250}`.
- [X] T013 Design README, UI kit, bundle, spec 001 data model: say 250 characters and the counter.
