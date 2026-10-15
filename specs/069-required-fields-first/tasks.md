---

description: "Task list for Required Fields First"
---

# Tasks: Required Fields First

**Input**: Design documents from `/specs/069-required-fields-first/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md, quickstart.md

**Tests**: Included (Principle V), changed first and seen to fail. Never assert a count of anything: check each field by
name. Playwright specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.

**Organization**: One user story. Edited source files keep their SPDX header and are formatted with Prettier
(`bun run format`); `design/` and `specs/` are not formatted. The owner reviews before committing, so do not commit.
Stay on the current branch (`55-add-customer-phone-number-to-the-contact-us-form`); never create or switch branches.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/contact/ContactPopup.tsx` the form renders Full name (line
  181), Work email (182-189), the spec 068 comment and Phone number `<Input>` (190-197), Company website (198), and
  then the Primary need block (199-220): `<div className="an-field">` holding a spec 068 comment, the label with its
  `.an-label__required` span, and the `<select id="primaryNeed" ... required>`. The old order is encoded in
  `tests/unit/contact-popup.test.tsx` lines 99-100, `tests/e2e/contact-phone-field.spec.ts` lines 17-37,
  `tests/e2e/keyboard-navigation.spec.ts` lines 27-35, and `tests/e2e/contact-popup-a11y.spec.ts` lines 34-38. Port
  3000 is free

---

## Phase 2: User Story 1 - Required fields come first (Priority: P1) MVP

**Goal**: The form reads Full name, Work email, Primary need, Phone number, Company website, and Tab follows that
order. Nothing else about any field changes.

**Independent Test**: Open the Contact Us popup from `/`; the five fields are in that order; Tab from Work email lands
on Primary need, then Phone number, then Company website.

### Tests (change first, see them fail)

- [X] T002 [P] [US1] In `tests/unit/contact-popup.test.tsx`, rename the order test (line 92) to "renders the Phone
  number field as an optional telephone field, after Primary need and before Company website", add `const need =
  screen.getByLabelText("Primary need");`, and replace lines 99-100 with three assertions:
  `workEmail.compareDocumentPosition(need)`, `need.compareDocumentPosition(phone)`, and
  `phone.compareDocumentPosition(website)`, each `& Node.DOCUMENT_POSITION_FOLLOWING` and `toBeTruthy()`. Keep the
  `type`, `autocomplete`, and `not.toBeRequired()` checks
- [X] T003 [P] [US1] In `tests/e2e/contact-phone-field.spec.ts`, rewrite the first two tests. (a) Rename "shows an
  optional telephone field between Work email and Company website" to "lists the required fields first: Primary need
  sits between Work email and Phone number"; after the `type` check, take the `boundingBox()` of Work email, Primary
  need, Phone number, and Company website and expect each `y` to be greater than the one before (three comparisons,
  by name). (b) Rename "Tab goes from Work email to Phone number to Company website" to "Tab goes from Work email to
  Primary need, Phone number, then Company website" and expect, after each Tab, Primary need, then Phone number, then
  Company website focused
- [X] T004 [P] [US1] In `tests/e2e/keyboard-navigation.spec.ts` lines 27-35, reorder the walk: after typing the email
  and pressing Tab, expect Primary need focused and `selectOption("Web Development")`; Tab, expect Phone number focused,
  type "+1 212 555 0100"; Tab, expect Company website focused, type "example.com"; then the existing Tab to the Privacy
  link. Remove the old Primary need lines (34-35)
- [X] T005 [P] [US1] In `tests/e2e/contact-popup-a11y.spec.ts` lines 34-38, reorder the `order` array to Work email,
  Primary need, Phone number, Company website, then the links and buttons as they are
- [X] T006 [US1] Run `bun run test -- contact-popup`: the order test fails (Primary need is not before Phone number).
  Run `bun run build && bun run test:e2e -- "contact-phone-field|keyboard|a11y" --project=chromium`: the order, Tab,
  keyboard, and a11y Tab-order tests fail for the same reason, not because of a typo or server startup

### Implementation

- [X] T007 [US1] In `src/components/contact/ContactPopup.tsx`, cut the whole Primary need block (the
  `<div className="an-field">` from line 199 through its closing `</div>` on line 220, including the spec 068 comment
  inside it) and paste it directly after the Work email `<Input ... />` (after line 189), before the Phone number
  comment. Change nothing inside the block. Add one comment line above it: `{/* Spec 069: required fields first. */}`
- [X] T008 [US1] Run `bun run test -- contact-popup` and `bun run build && bun run test:e2e -- "contact|keyboard"
  --project=chromium`. All pass, including the a11y spec

**Checkpoint**: the three required fields are the first three, Tab follows, everything else unchanged.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T009 [P] In `design/README.md` lines 77-81, move the "Primary need (select, required). ..." line to directly after
  the Work email line, so the list reads Full name, Work email, Primary need, Phone number, Company website, Send
- [X] T010 [P] In `design/ui_kits/marketing-site/ContactUs.jsx.txt`, move the Primary need `<div className="an-field">`
  block (lines 41-56, label `htmlFor="svc"` through `</div>`) to directly after the Work email `<Input>` line (38). In
  `design/_ds_bundle.js`, move the matching `React.createElement("div", { className: "an-field" }, ...label htmlFor
  "svc"... select ...)` element (starting at line 1227) to directly after the Work email `Input` element (ending at
  line 1219), keeping the comma placement valid and the code otherwise byte for byte
- [X] T011 [P] In `specs/001-homepage-contact-us/spec.md`: scenario 1 (lines 115-116) reads "full name, work email,
  primary need, phone number, and company website (order per spec 069)"; the amended FR-008 note (line 198-201) lists
  "full name, work email, primary need, phone number, and company website". In
  `specs/001-homepage-contact-us/contracts/ui-contracts.md` lines 48-50, the order becomes "full name, work email,
  primary need, phone number, company website" with "amended by specs 068 and 069"
- [X] T012 [P] In `specs/068-contact-phone-field/data-model.md` line 14, change the Form order line to end with "(spec
  069 moved `primaryNeed` to third: `fullName`, `workEmail`, `primaryNeed`, `phoneNumber`, `companyWebsite`)". In
  `specs/068-contact-phone-field/contracts/ui-contracts.md` lines 19-22, add after the order sentence: "Spec 069 then
  moved primary need to third, after work email."
- [X] T013 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e -- --project=chromium --project=android`. All pass except the pre-existing straight-quotes failure
  on the ignored `.agents/skills/higgsfield-*` files, which is not ours. WebKit projects cannot launch on this machine.
  Port 3000 must be free; run the e2e suite in the background and wait for it
- [X] T014 Grep the changed files for curly quotes; grep `design/` and the spec 001 and 068 files for "primary need"
  and confirm no line still places it after company website; open `/`, click Contact Us, and confirm the three
  asterisked fields are the first three
- [X] T015 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #55.`

---

## Dependencies & Execution Order

- T001 first. T002 to T005 touch different files and run together; T006 after them; T007 after T006; T008 after T007.
- T009 to T012 are different files and run together after T008. T013, T014, and T015 in order.

## Implementation Strategy

One story, so the MVP is the whole feature: the four test edits first and failing, then the one block move, then the
documents and the full suite.

## Implementation Notes (2026-10-15)

- T013: `bun run test` has the same pre-existing straight-quotes failure as spec 068, on the git-ignored
  `.agents/skills/higgsfield-*` files; every other unit test passes (183). `bun run test:e2e --project=chromium
  --project=android`: 558 passed, 0 failed. WebKit projects cannot launch here (binary not installed). `bun run format`
  changed nothing; `format:check` and `lint` are clean.
- T010: the moved element in `design/_ds_bundle.js` keeps its `/*#__PURE__*/` prefix; the file parses (`bun build
  --no-bundle`).
