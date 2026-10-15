# Implementation Plan: Contact Phone Field

**Branch**: `55-add-customer-phone-number-to-the-contact-us-form` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/068-contact-phone-field/spec.md`

## Summary

Three changes to the Contact Us form in `ContactPopup.tsx`: a "Phone number" field (`type="tel"`,
`autoComplete="tel"`, optional) between Work email and Company website; Company website loses `required`; and every
required field's label ends with an asterisk. The asterisk is a small `aria-hidden` span that the shared `Input`
component renders whenever it is given `required`, and the Primary need label renders the same span. It inherits the
label's color, so it needs no new token and passes the popup's accessibility check as the label does, and being hidden
from assistive technology it does not join the field's accessible name. `ContactRequest` gains `phoneNumber`. The
unit test that asserts Company website is required is reversed, the Tab-order tests gain a stop, and one new e2e spec
covers the field, the optional website, and the marks. Spec 001 and the design documents are updated to describe the
form as it now is. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new. `@testing-library/react` and Playwright with axe, as today.

**Storage**: N/A. The request is still not sent anywhere (spec 001 FR-018).

**Testing**: Vitest for `tests/unit/contact-popup.test.tsx` (updated) and a new `tests/unit/input.test.tsx`; Playwright
for a new `tests/e2e/contact-phone-field.spec.ts` and the updated `keyboard-navigation.spec.ts`,
`contact-popup-a11y.spec.ts`, and `contact-flow.spec.ts`. Playwright runs Chromium and WebKit, desktop and emulated
phones.

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change. One more field and three tiny spans.

**Constraints**: No count assertions; no underline; Prettier formatting for `src/` and `tests/`; straight quotes;
license header on every new file; axe must still report no violations on the popup; the asterisk must not change any
field's accessible name, or every `getByLabel("Full name")` in the suite would break; no leading whitespace in a text
node (the build's HTML formatter rejects it), so the gap before the asterisk is CSS, not a space.

**Scale/Scope**: Two components, one stylesheet rule, two unit test files, four e2e files, five design files, and four
spec 001 files.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One field, one attribute removed, one small element in a component that already exists. No new dependency, no new token. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. The field is a labeled native input; the required state stays on the controls, where screen readers read it; the asterisk is hidden from them and has the label's contrast. axe runs on the popup in CI. |
| IV. Design & content consistency | Pass. The mark lives in the shared `Input` component and shared CSS, so any future required field gets it for free. The design documents are updated to match the site. |
| V. Test-first | Pass. Tests are written first and seen to fail. Nothing is counted. |
| VI. Always-dark, no hover underline | Pass. No link or hover rule changes. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. Formatting, quotes, and license headers as usual. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/068-contact-phone-field/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-contracts.md       # what changes in the ContactPopup and Input contracts
└── checklists/requirements.md
```

### Source Code (repository root)

```text
src/components/ui/Input.tsx                              # renders the required mark when `required` is set
src/components/contact/ContactPopup.tsx                  # phone field; website optional; mark on Primary need; phoneNumber in ContactRequest
src/styles/components.css                                # .an-label__required rule (the gap before the asterisk)

tests/unit/contact-popup.test.tsx                        # required set, order, type, payload, marks
tests/unit/input.test.tsx                                # new: Input shows the mark only when required
tests/e2e/contact-phone-field.spec.ts                    # new: field, keypad type, order, optional website, marks, names
tests/e2e/keyboard-navigation.spec.ts                    # Tab stop for Phone number
tests/e2e/contact-popup-a11y.spec.ts                     # Tab order gains Phone number
tests/e2e/contact-flow.spec.ts                           # Phone number in the visible-fields check

design/README.md                                         # field list: phone, optional website, asterisk on required
design/DESIGN.md                                         # Input line mentions the required mark
design/components/forms/Input.jsx.txt                    # reference Input renders the mark
design/components/forms/Input.prompt.md                  # mentions the mark
design/ui_kits/marketing-site/ContactUs.jsx.txt          # phone field; website not required
design/_ds_bundle.js                                     # same, compiled copy

specs/001-homepage-contact-us/spec.md                    # FR-008 amended; scenario 1 and the entity list the fields
specs/001-homepage-contact-us/contracts/ui-contracts.md  # ContactRequest and the required set
specs/001-homepage-contact-us/data-model.md              # phoneNumber row; companyWebsite not required
specs/001-homepage-contact-us/quickstart.md              # step that fills the form
```

**Structure Decision**: single Next.js project; two new test files, no new components.

## Complexity Tracking

None.
