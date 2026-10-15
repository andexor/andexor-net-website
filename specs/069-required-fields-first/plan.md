# Implementation Plan: Required Fields First

**Branch**: `55-add-customer-phone-number-to-the-contact-us-form` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/069-required-fields-first/spec.md`

## Summary

In `ContactPopup.tsx`, move the Primary need `<div className="an-field">` block (the hand-written label, its mark, and
the `<select>`) from after Company website to directly after the Work email `<Input>`. No other markup changes, so
focus on open, the reset on reopen, the Esc handling for the open list, and the asterisks all carry over. Three e2e
specs and one unit test that walk the old order are updated, and one new e2e test pins the new order by name. The
design README, UI kit, and compiled bundle, and the spec 001 and spec 068 texts that give the order, are updated.
Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Vitest (`tests/unit/contact-popup.test.tsx`, order test updated) and Playwright
(`tests/e2e/contact-phone-field.spec.ts` gains the order test and loses the old one; `keyboard-navigation.spec.ts` and
`contact-popup-a11y.spec.ts` Tab order updated). Chromium and Android run here; WebKit is not installed.

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; Prettier formatting for `src/` and `tests/`; straight quotes; nothing else about
the fields changes.

**Scale/Scope**: One block moved in one component; four test files; three design files; four spec files.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. A block moves; nothing is added. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. DOM order is Tab order, so keyboard and reading order follow the visual order with no extra work. axe runs on the popup. |
| IV. Design & content consistency | Pass. The design documents are updated to the new order. |
| V. Test-first | Pass. The order tests are changed first and seen to fail. Nothing is counted. |
| VI. Always-dark, no hover underline | Pass. No CSS change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/069-required-fields-first/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-contracts.md       # the new field order in the ContactPopup contract
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/components/contact/ContactPopup.tsx                  # Primary need block moves after Work email

tests/unit/contact-popup.test.tsx                        # order test: Work email, Primary need, Phone number, Company website
tests/e2e/contact-phone-field.spec.ts                    # order and Tab tests updated to the new order
tests/e2e/keyboard-navigation.spec.ts                    # Tab walk in the new order
tests/e2e/contact-popup-a11y.spec.ts                     # Tab order array in the new order

design/README.md                                         # field list reordered
design/ui_kits/marketing-site/ContactUs.jsx.txt          # Primary need block moved
design/_ds_bundle.js                                     # same, compiled copy

specs/001-homepage-contact-us/spec.md                    # scenario 1 and the amended FR-008 list the fields in order
specs/001-homepage-contact-us/contracts/ui-contracts.md  # point 2 order
specs/068-contact-phone-field/data-model.md              # "Form order" line
specs/068-contact-phone-field/contracts/ui-contracts.md  # point 2 order
```

**Structure Decision**: single Next.js project; no new files outside this spec directory.

## Complexity Tracking

None.
