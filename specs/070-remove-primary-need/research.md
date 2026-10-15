# Research: Remove Primary Need

## The component

- **Finding**: In `src/components/contact/ContactPopup.tsx` the Primary need field is a `<div className="an-field">`
  block (lines 190-212) between the Work email `<Input>` and the Phone number `<Input>`, holding a spec 069 comment, a
  hand-written label with the spec 068 required mark, and a `<select id="primaryNeed">` that maps
  `PRIMARY_NEED_GROUPS` into `<optgroup>`s and appends `PRIMARY_NEED_OTHER`. Three other places refer to it: the import
  on line 13, the `primaryNeed` key in `ContactRequest` (line 20) and in the request built in `handleSubmit` (line
  143), and the spec 015 Esc handler (lines 63-85), which stands aside while
  `document.getElementById("primaryNeed")?.matches(":open")` is true, in a try/catch for browsers without `:open`.
- **Decision**: Delete the block, the import, both `primaryNeed` lines, and the `:open` branch with its try/catch and
  the comment sentences about the list. The handler keeps its `defaultPrevented` and `isComposing` guards and calls
  `onClose`. The `FOCUSABLE` selector keeps `select:not([disabled])`: it is a generic focus-trap list, not tied to this
  field, and removing it would only make the trap less general.
- **Alternatives considered**: Hiding the select (a hidden required control blocks sending; a hidden optional one is
  dead markup); keeping the options module for later (nothing imports it, and the constitution's YAGNI rule says
  unused code goes; specs 012 and 013 record the list if it is ever wanted again).

## The options module

- **Finding**: `src/components/contact/primary-need-options.ts` exports `PrimaryNeedGroup`, `PRIMARY_NEED_GROUPS`, and
  `PRIMARY_NEED_OTHER`. Its only importers are `ContactPopup.tsx` and `tests/unit/primary-need-select.test.tsx`. The
  home page service cards have their own copy and do not read it.
- **Decision**: Delete the module and the test file with it.

## Styling

- **Finding**: No CSS targets `select`, `optgroup`, or `#primaryNeed`. The select used the shared `.an-field`, `.an-label`,
  and `.an-input` classes, which the four remaining fields still use.
- **Decision**: No CSS change.

## Tests

- **Finding**: Thirteen test files touch the field.
  - `tests/unit/primary-need-select.test.tsx`: four tests, all about the list.
  - `tests/unit/contact-popup.test.tsx`: `fillValidForm` sets the need (line 15); "requires Full name, Work email, and
    Primary need" (25-32); the `onSubmit` payload includes `primaryNeed` (46); the asterisk loop lists it (81); the
    order test compares it (92-104); "leaves Esc to the Primary need list while it is expanded" (187-197).
  - `tests/e2e/contact-flow.spec.ts`: "shows the primary-need selector's grouped options" (40-60) and three
    `selectOption` calls.
  - `tests/e2e/contact-escape.spec.ts`: "the first Esc closes only the open Primary need list" (89-98) and two
    `selectOption` calls.
  - `tests/e2e/contact-phone-field.spec.ts`: the order test, the Tab test, three `selectOption` calls, `primaryNeed` in
    the `required` id list (82), and the accessible-name check (108).
  - `tests/e2e/keyboard-navigation.spec.ts` (27-30) and `tests/e2e/contact-popup-a11y.spec.ts` (35, 62, 109): Tab
    stops and `selectOption`.
  - One `selectOption` each in `contact-flow-timing`, `contact-confirmation-icon`, `contact-close-icon`,
    `contact-popup-logo`, and `ok-button`.
- **Decision**:
  - Delete `primary-need-select.test.tsx`, the grouped-options e2e test, the open-list e2e test, and the Esc-in-list
    unit test. Each existed only for the removed control or the removed branch.
  - Drop every `selectOption("Web Development")` line and the `primaryNeed` payload key.
  - Rewrite the required test as "requires Full name and Work email, and nothing else", and add one assertion that
    `screen.queryByLabelText("Primary need")` is null (a by-name absence check, not a count).
  - Order tests become Work email, Phone number, Company website: the unit `compareDocumentPosition` chain, the e2e
    bounding-box test ("Phone number sits between Work email and Company website", as spec 068 first wrote it), the Tab
    test, the keyboard walk, and the a11y order array.
  - The required-marks `required` list becomes `["an-full-name", "an-work-email"]`; the accessible-name test drops the
    Primary need line. The asterisk loop iterates the four remaining names.
  - The e2e "sends with Phone number and Company website blank" test now fills only Full name and Work email, which is
    spec 070 acceptance scenario 4. One new e2e test in `contact-phone-field.spec.ts` asserts
    `getByLabel("Primary need")` has count 0, as `contact-escape.spec.ts` already does for the closed dialog.
  - Nothing is counted beyond the zero-count absence check, which the project's existing tests already use for
    "not present".

## Design and spec documents

- **Finding**: `design/README.md` line 79 describes the field. `design/ui_kits/marketing-site/ContactUs.jsx.txt` lines
  39-57 render it, and `design/_ds_bundle.js` lines 1220-1246 are the compiled copy. There is no `design/components/
  forms/` select guidance. Spec 001 has FR-008 (amended twice already), FR-009 (the field's requirement), a
  `primaryNeed` row and a "Primary Need option list" section in `data-model.md`, point 2 of `contracts/ui-contracts.md`,
  and quickstart steps that pick a need. Spec 015 User Story 3 and FR-005 are the open-list Esc rule. Spec 068's
  `data-model.md` and `contracts/ui-contracts.md` and spec 069's `contracts/ui-contracts.md` and `data-model.md` list
  the field. Specs 012 and 013 are the group renames.
- **Decision**: Remove the field from the three design files (bundle edited by hand, as before). In spec 001, extend the
  FR-008 amendment with "and by 070 FR-001" and the four-field, two-required form; strike FR-009 through with
  "Superseded by 070 FR-001"; mark the `data-model.md` row and option-list section removed by 070; update the contract
  and quickstart. In spec 015, strike User Story 3 scenarios 2 and 3 and FR-005 with "Withdrawn by 070 FR-006". In specs
  068 and 069, update the contract points and data-model lines with a one-line note citing 070. Specs 012 and 013 are
  left as history: they describe group headings that no longer exist on the site, and spec 070 FR-001 names them as
  superseded.
