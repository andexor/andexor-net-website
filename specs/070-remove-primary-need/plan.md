# Implementation Plan: Remove Primary Need

**Branch**: `55-add-customer-phone-number-to-the-contact-us-form` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/070-remove-primary-need/spec.md`

## Summary

In `ContactPopup.tsx`, delete the Primary need `<div className="an-field">` block (label, mark, and `<select>`), the
`primaryNeed` key of `ContactRequest` and of the request built in `handleSubmit`, the import of the options module, and
the `:open` check inside the spec 015 Esc handler, which then simply calls `onClose`. Delete
`src/components/contact/primary-need-options.ts` and its unit test file. The form becomes Full name, Work email, Phone
number, Company website, with the first two required and asterisked, and Esc closes the popup on the first press
everywhere. Thirteen test files select a need or name the field and are updated; two tests that exist only for the list
are removed. The design README, UI kit, and compiled bundle, and the spec 001, 015, 068, and 069 texts that describe
the field, are amended. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new. One module (`primary-need-options.ts`) is removed.

**Storage**: N/A

**Testing**: Vitest (`tests/unit/contact-popup.test.tsx` updated; `tests/unit/primary-need-select.test.tsx` deleted)
and Playwright (ten `tests/e2e/*.spec.ts` files drop the `selectOption` call; `contact-flow.spec.ts` loses the grouped
options test; `contact-escape.spec.ts` loses the open-list test; `contact-phone-field.spec.ts`,
`keyboard-navigation.spec.ts`, and `contact-popup-a11y.spec.ts` walk the new order). Chromium and Android run here;
WebKit is not installed.

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change. The page's script chunk shrinks slightly.

**Constraints**: No count assertions; Prettier formatting for `src/` and `tests/`; straight quotes; nothing else about
the remaining fields changes; the spec 015 Esc behavior stays for everything except the removed list.

**Scale/Scope**: One component edited, one module and one unit test file deleted, twelve test files edited, three
design files, and documents in four earlier spec directories.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Code is removed, including a special case (the `:open` check) that existed only for the removed control. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Fewer controls, same Tab mechanics; axe runs on the popup. Esc now behaves the same in every browser because the one browser-specific branch is gone. |
| IV. Design & content consistency | Pass. The design documents are updated to the four-field form. |
| V. Test-first | Pass. Tests that look for the field are changed first and seen to fail; the new "no Primary need" and "two required" checks name fields and count nothing. |
| VI. Always-dark, no hover underline | Pass. No CSS change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/070-remove-primary-need/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-contracts.md       # the four-field ContactPopup contract and the simplified Esc rule
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/components/contact/ContactPopup.tsx                  # Primary need block, primaryNeed key, options import, :open check removed
src/components/contact/primary-need-options.ts           # deleted

tests/unit/contact-popup.test.tsx                        # fillValidForm, required test, onSubmit payload, asterisk loop,
                                                         #   order test, Esc-in-list test (removed), new "no Primary need" check
tests/unit/primary-need-select.test.tsx                  # deleted
tests/e2e/contact-flow.spec.ts                           # grouped-options test removed; selectOption calls dropped
tests/e2e/contact-escape.spec.ts                         # open-list test removed; selectOption calls dropped
tests/e2e/contact-phone-field.spec.ts                    # order, Tab, required-marks, and send tests in the new shape
tests/e2e/keyboard-navigation.spec.ts                    # Tab walk without Primary need
tests/e2e/contact-popup-a11y.spec.ts                     # Tab order array without Primary need; selectOption dropped
tests/e2e/contact-flow-timing.spec.ts                    # selectOption dropped
tests/e2e/contact-confirmation-icon.spec.ts              # selectOption dropped
tests/e2e/contact-close-icon.spec.ts                     # selectOption dropped
tests/e2e/contact-popup-logo.spec.ts                     # selectOption dropped
tests/e2e/ok-button.spec.ts                              # selectOption dropped

design/README.md                                         # Primary need line removed from the field list
design/ui_kits/marketing-site/ContactUs.jsx.txt          # Primary need block removed
design/_ds_bundle.js                                     # same, compiled copy

specs/001-homepage-contact-us/spec.md                    # FR-008 amended again; FR-009 struck through, superseded by 070
specs/001-homepage-contact-us/contracts/ui-contracts.md  # ContactRequest and field list
specs/001-homepage-contact-us/data-model.md              # primaryNeed row and option list marked removed by 070
specs/001-homepage-contact-us/quickstart.md              # steps that pick a need or open the list
specs/015-escape-closes-contact/spec.md                  # User Story 3 scenarios 2-3 and FR-005 struck through
specs/068-contact-phone-field/data-model.md              # primaryNeed row and "Form order" line
specs/068-contact-phone-field/contracts/ui-contracts.md  # ContactRequest, point 2, hand-written label note
specs/069-required-fields-first/contracts/ui-contracts.md  # point 2
specs/069-required-fields-first/data-model.md            # note that 070 removed the field
```

**Structure Decision**: single Next.js project; no new files outside this spec directory.

## Complexity Tracking

None.
