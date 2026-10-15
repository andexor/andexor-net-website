---

description: "Task list for Remove Primary Need"
---

# Tasks: Remove Primary Need

**Input**: Design documents from `/specs/070-remove-primary-need/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md, quickstart.md

**Tests**: Included (Principle V), changed first and seen to fail. Never assert a count of anything: check each field by
name. The one exception is a zero-count absence check (`toHaveCount(0)` / `queryByLabelText(...)` being null), which
the project already uses for "not present". Playwright specs must not use TypeScript type annotations (the loader fails
on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
The bundle already holds `…` for the ellipsis in the deleted block; do not add any escape of your own.

**Organization**: One user story. Edited source files keep their SPDX header and are formatted with Prettier
(`bun run format`); `design/` and `specs/` are not formatted. The owner reviews before committing, so do not commit.
Stay on the current branch (`55-add-customer-phone-number-to-the-contact-us-form`); never create or switch branches.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/contact/ContactPopup.tsx`: line 13 imports
  `PRIMARY_NEED_GROUPS` and `PRIMARY_NEED_OTHER`; line 20 is `primaryNeed: string;` in `ContactRequest`; lines 63-85
  are the spec 015 Esc handler with the `listOpen` / `matches(":open")` try/catch; line 143 is `primaryNeed:
  String(formData.get("primaryNeed") ?? "")`; lines 190-212 are the Primary need `<div className="an-field">` block
  (spec 069 comment through `</div>`) between the Work email `<Input>` and the spec 068 Phone number comment.
  `src/components/contact/primary-need-options.ts` is imported only there and by
  `tests/unit/primary-need-select.test.tsx`. Port 3000 is free

---

## Phase 2: User Story 1 - A visitor sends the form without choosing a service (Priority: P1) MVP

**Goal**: The form reads Full name, Work email, Phone number, Company website, with only the first two required and
asterisked. No "Primary need" control exists. Esc closes the popup on the first press wherever focus is.

**Independent Test**: Open the Contact Us popup from `/`; the four fields are in that order with no list of services;
fill Full name and Work email, press Send, see "Request received"; reopen and press Esc once, the popup closes.

### Tests (change first, see them fail)

- [X] T002 [P] [US1] Delete `tests/unit/primary-need-select.test.tsx` (all four tests are about the removed list)
- [X] T003 [P] [US1] In `tests/unit/contact-popup.test.tsx`: (a) remove the Primary need line from `fillValidForm`
  (line 15); (b) rename the test on line 25 to "requires Full name and Work email, and nothing else", drop its Primary
  need assertion (line 31), and add `expect(screen.queryByLabelText("Primary need")).toBeNull();`; (c) remove
  `primaryNeed: "Web Development",` from the `onSubmit` payload (line 46); (d) in the asterisk loop (line 81) the array
  becomes `["Full name", "Work email", "Phone number", "Company website"]`; (e) rewrite the order test (lines 90-104):
  comment "Spec 070: Primary need is gone, so Phone number follows Work email directly.", name "renders the Phone number
  field as an optional telephone field, between Work email and Company website", delete the `need` const and its two
  comparisons, and assert `workEmail.compareDocumentPosition(phone)` and `phone.compareDocumentPosition(website)`, each
  `& Node.DOCUMENT_POSITION_FOLLOWING` and `toBeTruthy()`; (f) delete the test "leaves Esc to the Primary need list
  while it is expanded" (lines 187-197). Keep the other Esc tests
- [X] T004 [P] [US1] In `tests/e2e/contact-phone-field.spec.ts`: (a) change the header comment to say the form is Full
  name, Work email, Phone number, Company website since spec 070; (b) rewrite the first test as "shows an optional
  telephone field between Work email and Company website": keep the `type` check, take the `boundingBox()` of Work
  email, Phone number, and Company website, and expect `phoneBox.y > emailBox.y` and `websiteBox.y > phoneBox.y`; (c)
  rewrite the Tab test as "Tab goes from Work email to Phone number, then Company website" with those two focus
  expectations; (d) delete the three `selectOption("Web Development")` lines (50, 65, 73); (e) in "Required marks" the
  `required` list becomes `["an-full-name", "an-work-email"]` and the comment about the select's own id goes; (f) in
  "keeps the accessible names" delete the Primary need line (108); (g) add one test to the "Optional fields" block,
  "has no Primary need field", that opens the popup and expects `page.getByLabel("Primary need")` `toHaveCount(0)`
- [X] T005 [P] [US1] In `tests/e2e/keyboard-navigation.spec.ts` lines 27-30, delete the spec 069 comment, the Tab, the
  Primary need focus expectation, and the `selectOption`, so Tab after typing the email lands on Phone number
- [X] T006 [P] [US1] In `tests/e2e/contact-popup-a11y.spec.ts`: remove `dialog.getByLabel("Primary need"),` from the
  `order` array (line 35) and the two `selectOption` lines (62, 109)
- [X] T007 [P] [US1] In `tests/e2e/contact-flow.spec.ts`: delete the test "shows the primary-need selector's grouped
  options with a disabled placeholder" (lines 40-60) and the three `selectOption` lines (69, 82, 107); drop the Primary
  need visibility expectation on line 18
- [X] T008 [P] [US1] In `tests/e2e/contact-escape.spec.ts`: delete the test "the first Esc closes only the open Primary
  need list" (lines 89-98) and the two `selectOption` lines (35, 73)
- [X] T009 [P] [US1] Delete the one `selectOption("Web Development")` line in each of
  `tests/e2e/contact-flow-timing.spec.ts` (18), `tests/e2e/contact-confirmation-icon.spec.ts` (18),
  `tests/e2e/contact-close-icon.spec.ts` (67), `tests/e2e/contact-popup-logo.spec.ts` (37), and
  `tests/e2e/ok-button.spec.ts` (18)
- [X] T010 [US1] Run `bun run test -- contact-popup`: the "requires ... nothing else" test fails (a Primary need
  control is found) and the `onSubmit` payload test fails (the request still carries `primaryNeed`); the order test
  passes already, since Phone number does follow Work email, just not directly. Run `bun run build && bun run test:e2e
  -- "contact-phone-field|contact-flow" --project=chromium`: "has no Primary need field" fails, and every send test fails
  because the browser blocks a send with the required select left empty. Confirm the failures are these and not a typo
  or server startup

### Implementation

- [X] T011 [US1] In `src/components/contact/ContactPopup.tsx`: (a) delete the import on line 13; (b) delete
  `primaryNeed: string;` from `ContactRequest`; (c) in the Esc handler, delete the `let listOpen = false;` line, the
  `try { ... } catch { ... }` block, and `if (listOpen) return;`, so the function is the `if (event.key !== "Escape" ||
  event.defaultPrevented || event.isComposing) return;` guard followed by `onClose();`; shorten the comment above it to
  end after "when an input method is composing." and drop the two sentences about the "Primary need" list; (d) delete
  `primaryNeed: String(formData.get("primaryNeed") ?? ""),` from `handleSubmit`; (e) delete the whole Primary need
  block, from the `{/* Spec 069: required fields first. */}` comment through the closing `</div>` of the
  `an-field` div, so the spec 068 Phone number comment follows the Work email `<Input>` directly. Leave `FOCUSABLE`
  as it is
- [X] T012 [US1] Delete `src/components/contact/primary-need-options.ts`
- [X] T013 [US1] Run `bun run lint` (no unused import), `bun run test -- contact-popup`, and `bun run build && bun run
  test:e2e -- "contact|keyboard|ok-button" --project=chromium`. All pass, including the a11y and Esc specs

**Checkpoint**: four fields, two required, no list, Esc closes on the first press.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T014 [P] In `design/README.md`, delete line 79 (the "Primary need (select, required). ..." line) so the list reads
  Full name, Work email, Phone number, Company website, Send
- [X] T015 [P] In `design/ui_kits/marketing-site/ContactUs.jsx.txt`, delete the Primary need `<div className="an-field">`
  block (lines 39-57, from the opening div through its `</div>`). In `design/_ds_bundle.js`, delete the matching
  element: from `/*#__PURE__*/React.createElement("div", {` on line 1220 (keeping the preceding `}), ` that closes the
  Work email `Input`) through the `"Something else"))), /*#__PURE__*/` on line 1241, so the Work email `Input`'s `}), `
  is followed directly by `/*#__PURE__*/React.createElement(Input, {` with `label: "Phone number"`. Check the file still
  parses with `bun build --no-bundle design/_ds_bundle.js --outdir /tmp/claude-1000/-lab-andexor-net-website/5d2cf13c-0bbe-4b88-9165-fc5ad0b268dd/scratchpad/bundle-check`
- [X] T016 [P] In `specs/001-homepage-contact-us/spec.md`: scenario 1 (lines 114-117) reads "fields for full name, work
  email, phone number, and company website (phone number added by spec 068; primary need removed by spec 070)"; in the
  FR-008 amendment (lines 199-202) change the lead-in to "**Amended by 068 FR-001, FR-003, and FR-003a, by 069 FR-001,
  and by 070 FR-001:**" and the text to "the form requests, in order, full name, work email, phone number, and company
  website; full name and work email are required, phone number and company website are optional, and required labels
  end with an asterisk."; strike FR-009 (lines 203-204) with `~~...~~` and append "**Superseded by 070 FR-001:** the
  primary need field is removed."
- [X] T017 [P] In `specs/001-homepage-contact-us/data-model.md`: strike the `primaryNeed` row (line 19) and add
  "removed by spec 070" in its notes cell; on line 33 change "and reused as the option list in the Contact Request's
  `primaryNeed` field (technical services group)" to "(it was also the option list of the Contact Request's primary
  need field until spec 070 removed that field)"; under "## Primary Need option list" (line 53) add a first line
  "Removed by spec 070 with the field. Kept for history:" before the existing text. In
  `specs/001-homepage-contact-us/contracts/ui-contracts.md` lines 47-50, point 2 becomes "full name, work email, phone
  number, company website (full name and work email `required`; phone number and company website optional; amended by
  specs 068, 069, and 070)". In `specs/001-homepage-contact-us/quickstart.md`: line 49 reads "Fill in full name and
  work email (phone number and company website are optional); submit."; replace the body of step 3 (lines 60-64) with
  one line "Removed by spec 070: the form no longer has a primary need selector."; on line 69 delete "the primary need
  selector,"
- [X] T018 [P] In `specs/015-escape-closes-contact/spec.md`: in User Story 3 (lines 60-80) strike the sentences "When
  the visitor has the "Primary need" list open, Esc closes that list first, the way it does in any browser, and does not
  also close the popup. A second Esc closes the popup." and scenarios 2 and 3 with `~~...~~`, and add after the
  scenarios "**Withdrawn by 070 FR-006:** the Primary need list no longer exists, so Esc always closes the popup on the
  first press."; strike FR-005 (lines 105-106) the same way with the same note
- [X] T019 [P] In `specs/068-contact-phone-field/contracts/ui-contracts.md`: delete `primaryNeed: string;` from the
  `ContactRequest` block (line 16) and add a comment line `// primaryNeed removed by spec 070`; after "Spec 069 then
  moved primary need to third, after work email." (line 22) add "Spec 070 then removed it."; change line 40 to "Labels
  written by hand next to a required control render the same span (the Primary need `<select>` was the example until
  spec 070 removed it)." In `specs/068-contact-phone-field/data-model.md`: strike the `primaryNeed` row (line 12) with
  "removed by spec 070"; extend the Form order parenthesis (lines 14-15) with "; spec 070 then removed `primaryNeed`:
  `fullName`, `workEmail`, `phoneNumber`, `companyWebsite`"; on line 20 change "for the hand-written Primary need label
  it is written next to the `required` select" to "a hand-written label next to a required control carries the same
  span (the Primary need select was the example until spec 070)". In
  `specs/069-required-fields-first/contracts/ui-contracts.md` add a last line "Spec 070 then removed primary need; see
  its contract." In `specs/069-required-fields-first/data-model.md` add a last line "Spec 070 then removed the Primary
  need field, leaving Full name, Work email, Phone number, Company website."
- [X] T020 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e -- --project=chromium --project=android`. All pass except the pre-existing straight-quotes failure
  on the ignored `.agents/skills/higgsfield-*` files, which is not ours. WebKit projects cannot launch on this machine.
  Port 3000 must be free; run the e2e suite in the background and wait for it
- [X] T021 `grep -rn -i "primary need\|primaryNeed\|PRIMARY_NEED" src tests design` returns nothing; grep the changed
  files for curly quotes; open `/`, click Contact Us, and confirm four fields with asterisks on the first two, no list,
  a send with only those two filled, and Esc closing the reopened popup on the first press
- [X] T022 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #55.`

---

## Dependencies & Execution Order

- T001 first. T002 to T009 touch different files and run together; T010 after them; T011 and T012 after T010; T013
  after T012.
- T014 to T019 are different files and run together after T013. T020, T021, and T022 in order.

## Implementation Strategy

One story, so the MVP is the whole feature: the eight test edits first and failing, then the component and module
removal, then the documents and the full suite.

## Implementation Notes (2026-10-15)

- T010: before the component change, five unit tests failed (every test that submits the form, plus the new absence
  check) and eight e2e tests failed (the sends, the Tab walk, and "has no Primary need field"), all because the
  required select was still rendered.
- T015: `bun build --no-bundle design/_ds_bundle.js --outfile ...` parses the edited bundle (`--outdir` fails on this
  machine with an ENOENT, unrelated to the file). The `/*#__PURE__*/` that prefixed the removed div now prefixes the
  Phone number `Input`.
- T020: `bun run test` has the same pre-existing straight-quotes failure as specs 068 and 069, on the git-ignored
  `.agents/skills/higgsfield-*` files; every other unit test passes (178). `bun run test:e2e --project=chromium
  --project=android`: 557 passed, 1 skipped (the Chromium-only LCP test on Android), 0 failed. WebKit is not installed.
  `bun run format` changed nothing; `format:check` and `lint` are clean.
- T021: the popup is client-rendered, so the check is on the built site chunk (`out/_next/static/chunks/site-*.js`):
  it has no "Primary need" text, no select or optgroup, and the four labels in order.
- T022: nothing committed; the owner reviews first.
