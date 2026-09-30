---

description: "Task list for the gold logo in the Contact Us popup"
---

# Tasks: Gold Logo in the Contact Us Popup

**Input**: Design documents from `/specs/016-popup-gold-logo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/popup-header-logo.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-006 requires an automated check that fails if the popup goes back to the boxed logo.

**Organization**: One user story, so one story phase. Setup records the "before" header measurements that SC-002 compares against.

## Format: `[ID] [P?] [Story]` Description

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`) and `tsc` rejects untyped helper parameters, so inline repeated steps instead of writing helper functions
- Manual checks in Firefox and Safari are optional and low priority (owner decision); do not add them as required steps

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure. WebKit hangs on the owner's machine and is skipped. Then record the "before" popup header layout for SC-002: build and serve (`bun run build && bun server.ts &`), and with a small script under the scratchpad directory (`import { chromium } from "playwright"`) open `http://localhost:3000/`, click the first "Contact Us" button, and print `.an-contact-header` `getBoundingClientRect().height` and `.an-contact-header__title` `getBoundingClientRect().x`, plus a screenshot of the header (`page.locator(".an-contact-header").screenshot({ path })`). Keep the numbers and the screenshot path for T007, then stop the server.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - The popup header shows the gold logo (Priority: P1) 🎯 MVP

**Goal**: The Contact Us popup header shows the gold logo on a transparent background, in both states and from every trigger, at the same size and place as before.

**Independent Test**: Open the popup from any "Contact Us" button. The header logo is the gold mark with no blue box behind it, the same mark the site header and hero use.

### Tests for User Story 1 (write first; they fail until T005 and T006)

- [X] T002 [P] [US1] In `tests/unit/contact-popup.test.tsx`, add inside `describe("ContactPopup")` a test "shows the gold logo, decorative, in the form and the confirmation": render `<ContactPopup open onClose={vi.fn()} />`, get the header image with `document.querySelector(".an-contact-header__logo")`, expect it to be an `HTMLImageElement` with `getAttribute("src")` equal to `/logo/logo-gold.svg` and `getAttribute("alt")` equal to `""`; then `fillValidForm()`, click "Send", expect the "Request received" heading, and expect the same image (queried again) with the same `src` and `alt`. Run `bun run test tests/unit/contact-popup.test.tsx` and confirm it fails on the `src`.
- [X] T003 [P] [US1] In `tests/unit/logo.test.tsx`, import `readdirSync` from `node:fs` and add inside `describe("shared lockup")` a test "logo-gold.svg is referenced in exactly the lockup and the popup header": `const files = (readdirSync("src", { recursive: true }) as string[]).filter((f) => /\.tsx?$/.test(f)).map((f) => "src/" + f).filter((f) => readFileSync(f, "utf8").includes("logo-gold.svg")).sort();` and expect it `toEqual(["src/components/contact/ContactPopup.tsx", "src/components/marketing/Logo.tsx"])`. Leave the existing test in that block alone. Confirm the new test fails (only `Logo.tsx` matches today).
- [X] T004 [P] [US1] Create `tests/e2e/contact-popup-logo.spec.ts` (with the SPDX header). For each of two starts, `["hero on /", "footer on /web-development"]`, add a test: for the hero, `page.goto("/")` and click `getByRole("button", { name: "Contact Us" }).first()`; for the footer, `page.goto("/web-development")` and click `page.locator("footer").getByRole("button", { name: "Contact Us" })`. Expect `getByRole("dialog", { name: "Contact Us" })` visible. Let `logo = page.locator(".an-contact-header__logo")` and `title = page.locator(".an-contact-header__title")`. Assert: `logo` has attribute `src` `/logo/logo-gold.svg` and `alt` `""`; `await logo.evaluate((img) => img.complete && img.naturalWidth > 0)` is `true`; its bounding box is 34 by 34 (`toBeCloseTo(34, 0)`); computed `backgroundColor` is `rgba(0, 0, 0, 0)` and `borderRadius` is `0px`; and `titleBox.x - (logoBox.x + logoBox.width)` is close to 12 (`toBeCloseTo(12, 0)`). In a separate test, open from the hero, fill the four fields (Full name, Work email, Company website, Primary need `selectOption("Web Development")`), click "Send", expect the "Request received" heading, and assert the same `src` and loaded state on the header logo. Inline the repeated steps. Run `bun run test:e2e tests/e2e/contact-popup-logo.spec.ts --project=chromium` and confirm the tests fail.

### Implementation for User Story 1

- [X] T005 [US1] In `src/components/contact/ContactPopup.tsx` (line 96), change `<img src="/logo/andexor-logo.svg" alt="" className="an-contact-header__logo" />` to use `src="/logo/logo-gold.svg"`. Keep `alt=""`, the class, and the `eslint-disable-next-line @next/next/no-img-element` comment on the line above. Change nothing else in the file.
- [X] T006 [US1] In `src/styles/marketing.css`, in the `.an-contact-header__logo` rule, delete `border-radius: 8px;` and leave `position: relative; width: 34px; height: 34px;` as they are. Do not touch `.an-contact-header`, `.an-contact-header__glow`, or `.an-contact-header__title`.
- [X] T007 [US1] Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox`. T002, T003, and T004 must pass, along with `tests/e2e/contact-popup-a11y.spec.ts` (both popup states have no WCAG 2.1 AA violations), `tests/e2e/contact-flow.spec.ts`, and the lockup tests in `tests/unit/logo.test.tsx`. Then repeat the "before" measurements from T001 against a fresh build: the header height and the title's x must equal the recorded values (SC-002). Take the header screenshot again and read both screenshots (the Read tool shows images): the gold mark must read clearly over the header's faint gold glow, with no box behind it. If it does not read well, report what you see and do not adjust the design on your own.

**Checkpoint**: US1 is complete and shippable.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T008 [P] Update spec 003 for the second place the mark is used. In `specs/003-logo-wordmark/data-model.md` (the Mark row, line 9), add that the popup header also shows the mark alone (spec 016). In `specs/003-logo-wordmark/contracts/logo-component.md`, add a note under "Callers" that the Contact Us popup header uses `/logo/logo-gold.svg` directly, without the wordmark, so it does not use `Logo`. In `specs/003-logo-wordmark/spec.md`, add a dated Amendments entry (2026-09-30, see `specs/016-popup-gold-logo/spec.md`) saying the mark is referenced by `Logo.tsx` and by the popup header, and that `tests/unit/logo.test.tsx` now pins those two files. Leave the rest of spec 003 alone.
- [X] T009 [P] In `design/README.md` (line 75), change "Boxed logo 34px, radius 8px" to "Gold logo (`assets/logo/logo-gold.svg`, transparent) 34px, no radius (spec 016; the design system's boxed logo was replaced)". Do not edit `design/ui_kits/marketing-site/ContactUs.jsx.txt` or `design/_ds_bundle.js` (they are the design tool's mock).
- [X] T010 Grep for regressions: `grep -rn "andexor-logo.svg" src tests` (nothing), `grep -rn "logo-gold.svg" src` (exactly `Logo.tsx` and `ContactPopup.tsx`), `grep -rn "underline" src/styles` (nothing new), `grep -rn "#top" src content` (nothing new). Then run the Docker shutdown check: `./build.sh && ./run.sh`, open the site, open the popup and see the gold logo, one `^C`, and `docker ps -a` shows no leftover container. Manual checks in Firefox and Safari are optional.
- [ ] T011 Do not open a PR unless asked. Commit with `git commit -s`, subject ending in `Closes #N.` for the GitHub issue (use `Refs #15.` if there is no issue for it).

---

## Dependencies & Execution Order

- T001, then T002, T003, and T004 in parallel (different files), then T005 and T006 (different files, can run together after the tests), then T007.
- T008 and T009 can run any time after T007, in parallel. T010 and T011 come last.

## Parallel Example: User Story 1

```text
T002 tests/unit/contact-popup.test.tsx
T003 tests/unit/logo.test.tsx
T004 tests/e2e/contact-popup-logo.spec.ts
```

## Implementation Strategy

MVP is the whole feature (T001 to T007): one attribute, one removed CSS declaration, and three tests. The
polish tasks only correct documents that describe the boxed logo or say the mark lives in one file.
