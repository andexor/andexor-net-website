---

description: "Task list for Contact Phone Field"
---

# Tasks: Contact Phone Field

**Input**: Design documents from `/specs/068-contact-phone-field/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md, quickstart.md

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything: check each field by
name. Playwright specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: Three user stories, each independently testable. New and edited source files keep or get the SPDX
license header and are formatted with Prettier (`bun run format`); `design/` and `specs/` are not formatted. The owner
reviews before committing, so do not commit. Stay on the current branch
(`55-add-customer-phone-number-to-the-contact-us-form`); never create or switch branches. The accessible name of every
field must stay exactly its label text, because the whole suite finds fields with `getByLabel("Full name")` and the
unit tests with the exact-match `getByLabelText`.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. `src/components/contact/ContactPopup.tsx` lines 179-188 render Full name, Work
  email (`type="email"`), and Company website (`required`) with `Input`, and lines 189-208 render the Primary need
  `<select required>` under a hand-written `<label className="an-label" htmlFor="primaryNeed">`. `ContactRequest`
  (lines 15-20) has four fields. `src/components/ui/Input.tsx` renders `<label className="an-label">{label}</label>`.
  `tests/unit/contact-popup.test.tsx` line 27 asserts Company website `toBeRequired()`, and `fillValidForm` (lines
  10-15) fills four fields. `tests/e2e/keyboard-navigation.spec.ts` lines 27-29 and `tests/e2e/contact-popup-a11y.spec.ts`
  lines 36-37 Tab from Work email straight to Company website. `tests/e2e/contact-flow.spec.ts` lines 14-17 list the
  visible fields. `.an-label` is styled at `src/styles/components.css` line 154. Nothing in `src/` or `tests/` mentions a
  phone number yet

---

## Phase 2: User Story 1 - A visitor can leave a phone number (Priority: P1) MVP

**Goal**: A "Phone number" field, `type="tel"`, optional, sits between Work email and Company website; the submitted
request carries it; reopening clears it.

**Independent Test**: Open the Contact Us popup from `/`. The fields read Full name, Work email, Phone number, Company
website, Primary need. Type a number, fill the rest, press Send, see "Request received".

### Tests (write first, see them fail)

- [X] T002 [US1] In `tests/unit/contact-popup.test.tsx`: add `fireEvent.change(screen.getByLabelText("Phone number"),
  { target: { value: "+1 212 555 0100" } })` to `fillValidForm` after the Work email line, and add `phoneNumber: "+1 212
  555 0100"` to the expected `onSubmit` payload (between `workEmail` and `companyWebsite`). Add a test "renders the
  Phone number field as an optional telephone field between Work email and Company website": the field from
  `getByLabelText("Phone number")` has attribute `type` "tel" and `autocomplete` "tel", is `not.toBeRequired()`, and
  `workEmail.compareDocumentPosition(phone) & Node.DOCUMENT_POSITION_FOLLOWING` and
  `phone.compareDocumentPosition(website) & Node.DOCUMENT_POSITION_FOLLOWING` are both truthy. In the reset test, also
  expect `getByLabelText("Phone number")` `toHaveValue("")` after reopening
- [X] T003 [US1] Create `tests/e2e/contact-phone-field.spec.ts` (SPDX header as `//` comments, no type annotations, a
  header comment naming spec 068). `test.describe("Contact phone field")` with: (a) "shows an optional telephone field
  between Work email and Company website": go to `/`, click the first "Contact Us" button, `getByLabel("Phone number")`
  is visible, has attribute `type` "tel", and its `boundingBox().y` is greater than Work email's and less than Company
  website's; (b) "Tab goes from Work email to Phone number to Company website": focus Work email, press Tab, expect
  Phone number focused, press Tab, expect Company website focused; (c) "sends with the phone number filled": fill Full
  name, Work email, Phone number "+1 212 555 0100", Company website, select "Web Development", click Send, expect the
  "Request received" heading visible; (d) "clears the phone number on reopen": after (c), click OK, click Contact Us
  again, expect Phone number `toHaveValue("")`
- [X] T004 [US1] Run `bun run test -- contact-popup`: T002 fails because there is no "Phone number" label. Run
  `bun run build && bun run test:e2e -- contact-phone-field --project=chromium`: T003 fails for the same reason, not
  because of a typo or server startup. Port 3000 must be free

### Implementation

- [X] T005 [US1] In `src/components/contact/ContactPopup.tsx`: add `phoneNumber: string;` to `ContactRequest` between
  `workEmail` and `companyWebsite`; in `handleSubmit`, add `phoneNumber: String(formData.get("phoneNumber") ?? ""),`
  in the same position; after the Work email `<Input>` (line 187), add `<Input name="phoneNumber" label="Phone number"
  type="tel" autoComplete="tel" placeholder="+1 212 555 0100" />` with no `required`. Add a one-line comment above it
  naming spec 068
- [X] T006 [P] [US1] In `tests/e2e/keyboard-navigation.spec.ts`, after the Work email `keyboard.type` (line 26), insert
  `await page.keyboard.press("Tab"); await expect(page.getByLabel("Phone number")).toBeFocused();` and a
  `keyboard.type("+1 212 555 0100")`, so the next Tab lands on Company website as before
- [X] T007 [P] [US1] In `tests/e2e/contact-popup-a11y.spec.ts`, insert `dialog.getByLabel("Phone number"),` into the
  `order` array between Work email and Company website (line 36)
- [X] T008 [P] [US1] In `tests/e2e/contact-flow.spec.ts` line 15, add `await expect(page.getByLabel("Phone
  number")).toBeVisible();` after the Work email line
- [X] T009 [US1] Run `bun run test -- contact-popup` and `bun run test:e2e -- "contact|keyboard" --project=chromium`.
  All pass, including the a11y spec (axe reports no violations with the new field)

**Checkpoint**: the phone field is on the form, optional, in place, and carried in the request.

---

## Phase 3: User Story 2 - Company website is no longer required (Priority: P2)

**Goal**: Company website stays on the form, unchanged in look and place, but no longer blocks sending. Full name, Work
email, and Primary need stay required.

**Independent Test**: Open the popup, fill only Full name and Work email, choose a need, press Send: "Request received".

### Tests (write first, see them fail)

- [X] T010 [US2] In `tests/unit/contact-popup.test.tsx`, rename the test on line 23 to "requires Full name, Work email,
  and Primary need, and nothing else" and make it assert Full name, Work email, and Primary need `toBeRequired()` and
  Phone number and Company website `not.toBeRequired()` (one assertion per field, by name; no counting)
- [X] T011 [US2] In `tests/e2e/contact-phone-field.spec.ts`, add a `test.describe("Optional fields")` with: (a) "sends
  with Phone number and Company website blank": open the popup, fill Full name and Work email, select "Web
  Development", click Send, expect the "Request received" heading visible; (b) "still stops a send with Work email
  blank": open the popup, fill Full name only, select "Web Development", click Send, expect the heading not visible
  and `page.getByLabel("Work email").evaluate((el) => el.validity.valueMissing)` to be true
- [X] T012 [US2] Run `bun run test -- contact-popup` (T010 fails on Company website) and
  `bun run test:e2e -- contact-phone-field --project=chromium` (T011a fails: the browser refuses the send)

### Implementation

- [X] T013 [US2] In `src/components/contact/ContactPopup.tsx`, remove `required` from the Company website `<Input>`
  (line 188). Change nothing else on that line
- [X] T014 [US2] Run `bun run test -- contact-popup` and `bun run test:e2e -- "contact|keyboard" --project=chromium`.
  All pass

**Checkpoint**: only Full name, Work email, and Primary need are required.

---

## Phase 4: User Story 3 - Required fields are marked with an asterisk (Priority: P3)

**Goal**: Each required field's label ends with "*" in the label's own color, hidden from assistive technology.
Optional fields have none. The shared `Input` does it from its `required` prop; the Primary need label does it by hand.

**Independent Test**: Open the popup: Full name, Work email, and Primary need end with "*"; Phone number and Company
website do not. `getByLabel("Full name", { exact: true })` still finds the field.

### Tests (write first, see them fail)

- [X] T015 [P] [US3] Create `tests/unit/input.test.tsx` (SPDX header, header comment naming spec 068). Import `Input`
  from `@/components/ui/Input`. Tests: (a) "marks a required field's label with an asterisk hidden from assistive
  technology": render `<Input label="Full name" required />`; `screen.getByLabelText("Full name")` finds the input
  (exact match proves the name is unchanged); the label (`document.querySelector("label")`) contains a
  `.an-label__required` span with text "*" and attribute `aria-hidden` "true", and it is the label's last child; (b)
  "shows no mark on an optional field": render `<Input label="Phone number" />`; the label has no `.an-label__required`
  and its text is exactly "Phone number"
- [X] T016 [P] [US3] In `tests/unit/contact-popup.test.tsx`, add a test "marks exactly the required fields with the
  asterisk": for each label in ["Full name", "Work email", "Phone number", "Company website", "Primary need"], get the
  control with `getByLabelText(label)` and its label with `control.labels[0]`; expect
  `label.querySelector(".an-label__required") !== null` to equal `control.required`, and the label's text to start with
  the label string. This checks every field by name and counts nothing
- [X] T017 [P] [US3] In `tests/e2e/contact-phone-field.spec.ts`, add a `test.describe("Required marks")` with: (a)
  "shows an asterisk after each required label and none after optional ones": open the popup; find each label by its
  `for` attribute (`label[for="an-full-name"]`, `label[for="an-work-email"]`, `label[for="primaryNeed"]`,
  `label[for="an-phone-number"]`, `label[for="an-company-website"]`; `Input` builds the id from the label); for the
  first three, the label has a `.an-label__required` with text "*" whose computed `color` equals the label's computed
  `color` (evaluate `getComputedStyle` on both); for the last two, the label has no `.an-label__required`; (b) "keeps the accessible names": `page.getByLabel("Full
  name", { exact: true })`, `getByLabel("Work email", { exact: true })`, and `getByLabel("Primary need", { exact: true })`
  are each visible; (c) "focuses the field when the asterisk is clicked": click the `.an-label__required` inside the
  Full name label, expect Full name focused
- [X] T018 [US3] Run `bun run test -- "contact-popup|input"` (T015 and T016 fail: no `.an-label__required`) and
  `bun run test:e2e -- contact-phone-field --project=chromium` (T017a fails)

### Implementation

- [X] T019 [US3] In `src/components/ui/Input.tsx`, pull `required` out of the props (`{ label, hint, error, id,
  required, className = "", ...rest }`), pass it through to the `<input required={required}>`, and render the label as
  `<label className="an-label" htmlFor={fieldId}>{label}{required && <span className="an-label__required"
  aria-hidden="true" />}</label>`. The span is empty: the glyph is CSS content, because Testing Library matches labels
  by text content and a "*" text node breaks the exact `getByLabelText` queries (found during implementation). Add a comment naming spec 068 and saying why the span is
  `aria-hidden`
- [X] T020 [P] [US3] In `src/styles/components.css`, after the `.an-label` rule (line 158), add
  `.an-label__required { margin-left: 0.25em; }` and `.an-label__required::after { content: "*"; }` with a short
  comment: the span is empty and aria-hidden, the glyph comes from CSS, and the mark inherits the label color and size
- [X] T021 [US3] In `src/components/contact/ContactPopup.tsx`, change the Primary need label (lines 190-192) to
  `<label className="an-label" htmlFor="primaryNeed">Primary need<span className="an-label__required"
  aria-hidden="true" /></label>`, and a comment that it mirrors what `Input` does for `required`
- [X] T022 [US3] Run `bun run test -- "contact-popup|input"` and `bun run test:e2e -- "contact|keyboard"
  --project=chromium`. All pass, including the a11y spec: the mark has the label's contrast, so axe is clean. Open `/`
  in a browser, click Contact Us, and confirm the three asterisks read "Full name *" with a small gap and the label's
  color, and the two optional labels are bare

**Checkpoint**: required fields are marked, optional ones are not, and names are unchanged.

---

## Phase 5: Polish & Cross-Cutting Concerns

Design and spec 001 documents describe the form as it now is. These are edited by hand; `design/` is not formatted and
`_ds_bundle.js` is not regenerated.

- [X] T023 [P] In `design/README.md` lines 77-80: insert `  - Phone number (tel, "+1 212 555 0100", optional)` after
  the Work email line; change the Company website line to `("company.com", optional)`; and add to the "Form state"
  line, after the labels sentence, "Required fields end with a "*" in the label color, hidden from assistive
  technology; optional fields have no mark." Keep the rest of each line
- [X] T024 [P] In `design/DESIGN.md` line 140, extend the Input line: "`required` adds a "*" after the label, in the
  label's color and hidden from assistive technology."
- [X] T025 [P] In `design/components/forms/Input.jsx.txt`, make the same change as T019 (destructure `required`, pass it
  to the input, render the `aria-hidden` span after `{label}`), keeping the file's single-quote style. In
  `design/components/forms/Input.prompt.md`, add one sentence: "`required` also appends a "*" to the label, hidden from
  assistive technology." No change to `Input.types.ts.txt` (`required` is already a native attribute)
- [X] T026 [P] In `design/ui_kits/marketing-site/ContactUs.jsx.txt` lines 37-39: insert `<Input label="Phone number"
  type="tel" placeholder="+1 212 555 0100" />` after the Work email line and remove `required` from the Company website
  line. In `design/_ds_bundle.js` lines 1207-1218: insert the matching `React.createElement(Input, { label: "Phone
  number", type: "tel", placeholder: "+1 212 555 0100" })` after the Work email element and remove `required: true`
  from the Company website element, keeping the surrounding code byte for byte
- [X] T027 [P] In `specs/001-homepage-contact-us/spec.md`: in scenario 1 (lines 115-116) list "full name, work email,
  phone number, company website, and primary need"; strike FR-008 (lines 196-198) with `~~...~~` and add "**Amended by
  068 FR-001, FR-003, and FR-003a:** the form requests full name, work email, phone number, company website, and
  primary need; full name, work email, and primary need are required, phone number and company website are optional,
  and required labels carry an asterisk", in the style FR-016 uses for spec 002; in the Contact Request entity (lines
  264-266) add phone number (optional) and mark company website optional
- [X] T028 [P] In `specs/001-homepage-contact-us/contracts/ui-contracts.md` line 49, list the five fields in order with
  "(full name, work email, and primary need `required`; phone number and company website optional; amended by spec
  068)". In `specs/001-homepage-contact-us/data-model.md` lines 13-18, add a `phoneNumber` row after `workEmail`
  ("string | No | None; free text in a `type="tel"` field, empty string when blank (spec 068)") and change
  `companyWebsite` to "No | None (optional since spec 068)". In `specs/001-homepage-contact-us/quickstart.md` line 49,
  change the fill step to "Fill in full name, work email, and a primary need (phone number and company website are
  optional); submit."
- [X] T029 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bunx tsc --noEmit` (errors in the older
  untyped e2e specs are known and not ours; none may be in `src/` or the new tests), `bun run build`, `bun run test`,
  and `bun run test:e2e`. All pass, including the contact popup and a11y specs on every project. Port 3000 must be
  free. The full e2e run takes several minutes: run it in the background and wait for it. A flaky webkit or ipad
  failure should be re-run alone before being reported
- [X] T030 Grep the changed files for curly quotes and hover underlines; grep `design/` and
  `specs/001-homepage-contact-us/` for "Company website" and "company website" and confirm no line still calls it
  required; grep `src/` and `out/` for `an-label__required` and confirm it appears only on the three required labels'
  markup and the one CSS rule
- [X] T031 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #55.`

---

## Dependencies & Execution Order

- T001 first. US1: T002 and T003 (different files, together), then T004, then T005; T006, T007, and T008 are
  different files and can run together after T005; T009 last.
- US2 depends on US1 only through the shared test files: T010 and T011 together, T012, T013, T014.
- US3: T015, T016, and T017 are different files and can run together; T018; then T019, with T020 in parallel; T021
  after T019 (same pattern); T022 last.
- Polish: T023 to T028 are all different files and can run together; T029, T030, and T031 in order.

## Implementation Strategy

- **MVP**: US1 alone is a useful increment: the phone field on the form, optional, in the request.
- US2 is a one-token source change once its tests are in.
- US3 touches the shared `Input` component; do it last so the field set is settled before the marks are tested.
- The document updates in Polish describe the end state, so they come once, after all three stories.

## Implementation Notes (2026-10-15)

- T029: `bun run test:e2e` on all projects reports 1108 failures, all on webkit, iphone, and ipad, because the WebKit
  binary (`~/.cache/ms-playwright/webkit-2370`) is not installed here (the known WebKit limitation in `CLAUDE.md`).
  Rerun on `--project=chromium --project=android`: 558 passed, 2 skipped, 0 failed.
- T029: `bun run test` has one pre-existing failure, `straight-quotes.test.ts`, which flags curly quotes in the
  git-ignored `.agents/skills/higgsfield-*` files added with #53. Nothing in this feature touches them; the owner
  decides whether to exempt or fix them. Every other unit test passes (183).
- T029: `bun run format` also re-joined one line in `scripts/format-html.ts` that the earlier CodeQL autofix had left
  outside Prettier style; `format:check` now passes.
- T019: the mark is an empty span with a CSS glyph, not a "*" text node, because Testing Library matches labels by
  text content (see research.md).
