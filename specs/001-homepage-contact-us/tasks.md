---

description: "Task list template for feature implementation"
---

# Tasks: Homepage and Contact Us Popup

**Input**: Design documents from `/specs/001-homepage-contact-us/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md, quickstart.md (all present)

**Tests**: Included. The constitution's Test-First Quality Gates principle and plan.md's Constitution Check commit to Vitest/RTL + Playwright tests for every acceptance scenario, written alongside implementation.

**Organization**: Tasks are grouped by user story (from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single Next.js project at the repository root, per plan.md's Project Structure:
- `src/app/`, `src/components/`, `src/styles/` — application source
- `public/` — static assets
- `tests/unit/`, `tests/e2e/` — tests
- `Dockerfile`, `server.ts`, `build.sh`, `run.sh`, `debug.sh`, `.dockerignore` already exist at the repo root (created earlier in this feature's planning) — no setup tasks needed for them.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic tooling, per plan.md's Technical Context and research.md

- [X] T001 Initialize the Next.js App Router project with TypeScript and Bun as the package manager: `package.json` (with `dev`, `build`, `lint`, `test`, `test:e2e` scripts matching quickstart.md), `tsconfig.json`, and `next.config.ts` with `output: "export"` (research.md "Rendering strategy" decision; required for the existing `Dockerfile`'s build stage to produce `out/`)
- [X] T002 [P] Configure ESLint and Prettier for the Next.js/TypeScript project
- [X] T003 [P] Configure Vitest + React Testing Library (`vitest.config.ts` and a test setup file) per plan.md's Testing section
- [X] T004 [P] Configure Playwright with Chromium, WebKit, and Firefox projects, plus `@axe-core/playwright` for accessibility assertions (`playwright.config.ts`), including device-emulation projects (e.g. Playwright's built-in `devices['iPhone 13']`, `devices['iPad Pro']`, `devices['Pixel 7']`) alongside the desktop browser projects, per plan.md's Testing section, research.md's "Testing approach" decision, and FR-020
- [X] T005 [P] Copy design tokens into `src/styles/tokens/` from `design/tokens/*.css`, `design/styles.css`, and `design/components/components.css` (copied as-is per research.md's "Styling approach" decision)
- [X] T006 [P] Self-host fonts: add the Play, Roboto, and Source Code Pro font files under `public/fonts/` and write `@font-face` declarations in `src/styles/fonts.css`, implementing FR-024's bounded 3-second wait with fallback-and-no-later-swap behavior (research.md's "Fonts and icons" decision)
- [X] T007 [P] Copy brand assets (logo SVGs, full favicon set, `site.webmanifest`) from `design/assets/` into `public/`, per `design/README.md`'s Assets section
- [X] T008 [P] Add `lucide-react` as a dependency for icons (research.md's "Fonts and icons" decision: "Use `lucide-react` for icons")

**Checkpoint**: Toolchain and static assets ready; no application code yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared UI primitives and static content that every user story's components depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 [P] Port the Button component to `src/components/ui/Button.tsx` (and a `Button.types.ts` if kept separate) from `design/components/forms/Button.jsx.txt` / `Button.types.ts.txt`: variants primary/secondary/ghost/accent, sizes sm/md/lg, `block`, `onInk`, `leftIcon`, `rightIcon`, `as`/`href` props, per `design/README.md`'s Components section
- [X] T010 [P] Port the Input component to `src/components/ui/Input.tsx` from `design/components/forms/Input.jsx.txt` / `Input.types.ts.txt`: label, hairline border, gold focus halo, per `design/README.md`'s Components section
- [X] T011 [P] Port the Card component to `src/components/ui/Card.tsx` from `design/components/data-display/Card.jsx.txt` / `Card.types.ts.txt`: `hover`, `ink`, `pad` props; never a colored left-border accent, per `design/README.md`'s Components section
- [X] T012 [P] Port the Badge component to `src/components/ui/Badge.tsx` from `design/components/data-display/Badge.jsx.txt` / `Badge.types.ts.txt`: tone neutral/brand/accent/success/warning/danger/info, optional dot, per `design/README.md`'s Components section
- [X] T013 [P] Create the Logo lockup component in `src/components/marketing/Logo.tsx`, ported from the `Logo` function in `design/ui_kits/marketing-site/Icon.jsx.txt`: `light`/`compact` props, boxed gold mark + "Andexor / Network, Inc." wordmark
- [X] T014 [P] Define the Service Offering static content in `src/components/marketing/services-data.ts`: an array of the 4 fixed entries from data-model.md's "Service Offering" table (icon, badgeTone, title, description, bullets) — Web Development (brand, `code-2`), Technical SEO (accent, `search`), Agentic Systems (brand, `bot`), Growth Marketing (accent, `line-chart`), with the exact copy from `design/README.md`'s Services section (FR-004)
- [X] T015 [P] Define the Primary Need option list in `src/components/contact/primary-need-options.ts` per data-model.md's "Primary Need option list": Technical Services group (Web Development, Web Hosting, Technical SEO, Agentic Systems), Business Services group (Cost Reduction, Lead Generation, Growth Marketing, Process Re-engineering), then "Something else" (FR-009)
- [X] T016 Create the root layout in `src/app/layout.tsx`: import global styles/tokens (T005), load self-hosted fonts (T006) with the 3-second-wait/no-swap strategy (FR-024), and set page metadata (title, favicon from T007) (depends on T005, T006, T007)

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Learn what Andexor Network offers (Priority: P1) 🎯 MVP

**Goal**: A visitor can load the homepage and, without any interaction beyond scrolling, understand who Andexor Network is, what it offers, and see how to get in touch.

**Independent Test**: Load the homepage with no interaction; confirm the company name, value proposition, four service disciplines, and contact affordance are all visible/readable, and that layout holds up from 320px to 1920px wide.

### Tests for User Story 1 ⚠️

> Write these tests FIRST, ensure they FAIL before implementation

- [X] T017 [P] [US1] Unit test asserting the Services section renders exactly the 4 service cards from `services-data.ts` (T014) with correct title/description/bullets, in `tests/unit/services.test.tsx` (FR-004)
- [X] T018 [P] [US1] E2E test covering spec.md User Story 1's Acceptance Scenarios 1-4 (hero headline "Enterprise-grade services at small business prices" above the fold, exactly 4 service cards, footer with 3 link groups + social links + copyright, no overlapping/cut-off content from 320px to 1920px wide per SC-004) in `tests/e2e/homepage-content.spec.ts`
- [X] T019 [P] [US1] E2E accessibility test running an axe scan against the homepage and asserting no WCAG 2.1 AA violations, in `tests/e2e/homepage-a11y.spec.ts` (FR-025)

### Implementation for User Story 1

- [X] T020 [US1] Create the Hero component in `src/components/marketing/Hero.tsx`: brand row (Logo + gold radial glow), H1 "Enterprise-grade services at small business prices", subhead "Andexor Network designs, builds, and manages solutions to help your business grow.", accent lg "Contact Us" button with trailing arrow-right icon that calls an `onContactClick` prop (FR-002, FR-003), per `design/README.md`'s Hero section (depends on T009, T013)
- [X] T021 [US1] Create the Services component in `src/components/marketing/Services.tsx`: header block, responsive card grid (`repeat(auto-fit, minmax(250px, 1fr))`) rendering the 4 entries from `services-data.ts` (T014) via Card + Badge, with check-icon bullets (FR-004); each card is rendered as a link (placeholder href at the time; now the card's page, spec 011), per `design/README.md`'s Services section (depends on T011, T012, T014)
- [X] T022 [US1] Create the CTABand component in `src/components/marketing/CTABand.tsx`: dark panel, H2 "Let's talk about your needs and explore solutions, then plan the way forward.", accent lg "Contact Us" button with a centered gold radial glow that calls an `onContactClick` prop (FR-005), per `design/README.md`'s CTA band section (depends on T009)
- [X] T023 [US1] Create the Footer component in `src/components/marketing/Footer.tsx`: Logo lockup + tagline, social media links (LinkedIn, Twitter/X, GitHub — placeholder hrefs, no-op per FR-017), three link-group columns (technical services, business services, company, per FR-006), bottom bar with "© 2026 Andexor Network, Inc. All rights reserved." and placeholder Privacy/Terms links, per `design/README.md`'s Footer section (depends on T013)
- [X] T024 [US1] Compose the homepage route in `src/app/page.tsx`: render Hero → Services → CTABand → Footer in that fixed order (FR-001), with a page-level `contactOpen` boolean state (per contracts/ui-contracts.md's page composition contract) wired to Hero's and CTABand's `onContactClick` props; do not render `ContactPopup` yet (added in User Story 2) (depends on T020, T021, T022, T023)

**Checkpoint**: User Story 1 is fully functional and independently testable — homepage content is complete and correct; "Contact Us" buttons exist and update `contactOpen` state, even though nothing visibly opens yet.

---

## Phase 4: User Story 2 - Request contact from anywhere on the homepage (Priority: P1)

**Goal**: A visitor can open a Contact Request form from any "Contact Us" call to action, submit it, and see a confirmation.

**Independent Test**: Click any "Contact Us" button, fill in the required fields, submit, and confirm a "Request received" confirmation is shown; verify closing/reopening behavior.

### Tests for User Story 2 ⚠️

> Write these tests FIRST, ensure they FAIL before implementation

- [X] T025 [P] [US2] Unit test for `ContactPopup`'s state/validation behavior per contracts/ui-contracts.md's Behavior contract (points 1-5): closed renders nothing; open+not-sent renders the form with all fields required; valid submit calls `onSubmit` and shows confirmation without a network request (FR-018); invalid/empty submit does not transition and doesn't call `onSubmit` (FR-010); reopening always resets `sent` to `false` (FR-013); submit control is disabled after send and re-enabled on open (FR-023) — in `tests/unit/contact-popup.test.tsx`
- [X] T026 [P] [US2] E2E test covering spec.md User Story 2's Acceptance Scenarios 1-6 (popup opens from hero and from CTA band and shows the same form; empty required field blocks submission; valid submit shows "Request received" confirmation without navigating away; "Done" closes the popup; scrim click and × close without submitting; reopening after a submission shows the empty form) in `tests/e2e/contact-flow.spec.ts`
- [X] T027 [P] [US2] E2E test asserting the timing budgets: the full open-popup-to-submit flow completes in under 60 seconds (SC-002), and the "Request received" confirmation appears within 10 seconds of clicking "Send" (SC-003), in `tests/e2e/contact-flow-timing.spec.ts`
- [X] T027b [P] [US2] E2E accessibility test running an axe scan against the open ContactPopup (form state and confirmation state) and asserting no WCAG 2.1 AA violations, in `tests/e2e/contact-popup-a11y.spec.ts` (FR-025)

### Implementation for User Story 2

- [X] T028 [US2] Create the ContactPopup component in `src/components/contact/ContactPopup.tsx` implementing the props/state contract from contracts/ui-contracts.md (`open: boolean`, `onClose: () => void`, optional `onSubmit: (request: ContactRequest) => void`; internal `sent: boolean` reset to `false` whenever `open` transitions false→true per FR-013) with the form fields and their exact validation from data-model.md's Contact Request table: `fullName` — "Non-empty (native `required`)"; `workEmail` — "Non-empty, valid email format (native `type=\"email\"` + `required`)"; `companyWebsite` — "Non-empty (native `required`); no format enforcement beyond that, per design reference" (depends on T009, T010)
- [X] T029 [US2] Implement the popup's scrim + panel chrome, header (Logo, "Contact Us" title, close control with an accessible name such as "Close" exposed to assistive technology per FR-021), and the "Request received" confirmation view (success icon, "Request received" heading, "Thanks for reaching out. A strategist will review your site and contact you soon." body copy, "Done" button that calls `onClose`) in `src/components/contact/ContactPopup.tsx`, per `design/README.md`'s Contact Us popup section (depends on T028)
- [X] T030 [US2] Implement submit-disable-on-send and re-enable-on-open behavior in `src/components/contact/ContactPopup.tsx` per FR-023 (disable the submit control immediately on a valid "Send" activation to prevent duplicate submissions, with no separate double-click handler; ensure the control is enabled whenever the popup opens or reopens, regardless of whether the component remounts or is a toggled singleton) (depends on T028)
- [X] T031 [US2] Add a mobile email-keyboard hint to the work email field (`type="email"` plus `inputMode="email"`) in `src/components/contact/ContactPopup.tsx` per FR-022, without adding any additional validation (depends on T028)
- [X] T032 [US2] Wire `<ContactPopup>` into `src/app/page.tsx`, connecting its `open`/`onClose` props to the `contactOpen` state and Hero/CTABand handlers from User Story 1, completing FR-007's "every Contact Us CTA opens the same popup" (depends on T024, T028, T029, T030, T031)

**Checkpoint**: User Stories 1 AND 2 both work independently — the full contact request flow is complete.

---

## Phase 5: User Story 3 - Choose a specific service interest when requesting contact (Priority: P2)

**Goal**: A visitor who knows what they need can select it from a grouped list in the contact form, pre-qualifying their request.

**Independent Test**: Open the contact popup, open the "Primary need" selector, confirm all options are listed and grouped correctly, and confirm submission is blocked until a real option is chosen.

### Tests for User Story 3 ⚠️

> Write these tests FIRST, ensure they FAIL before implementation

- [X] T033 [P] [US3] Unit test asserting the primary-need `<select>` renders the grouped options exactly as defined in `primary-need-options.ts` (T015) — "Technical Services" (Web Development, Web Hosting, Technical SEO, Agentic Systems), "Business Services" (Cost Reduction, Lead Generation, Growth Marketing, Process Re-engineering), then "Something else" — with a disabled "Select a service…" placeholder, in `tests/unit/primary-need-select.test.tsx` (FR-009)
- [X] T034 [P] [US3] E2E test covering spec.md User Story 3's Acceptance Scenarios 1-2 (grouped options visible and in source order; submission blocked while the "Select a service…" placeholder is still selected) in `tests/e2e/contact-flow.spec.ts` (extends T026's file)

### Implementation for User Story 3

- [X] T035 [US3] Add the "Primary need" `<select>` field to `ContactPopup`'s form in `src/components/contact/ContactPopup.tsx`: `<optgroup>`s built from `primary-need-options.ts` (T015), a disabled `value=""` "Select a service…" placeholder option, and `required`, relying on native `<select>` keyboard behavior per FR-015 (no custom dropdown) (depends on T028, T015)

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story verification and the checks from quickstart.md not already covered by a single user story's tests

- [X] T036 [P] E2E test for full keyboard-only navigation (Tab/Shift+Tab/Enter/Space/Escape only) reaching and activating every "Contact Us" button, all form fields, the primary-need selector, the submit button, and the popup close control, asserting a visible focus indicator at each stop, in `tests/e2e/keyboard-navigation.spec.ts` (FR-015, SC-006)
- [X] T037 [P] E2E/visual test asserting the site adapts to a dark OS color-scheme preference automatically with no manual toggle present, in `tests/e2e/dark-mode.spec.ts` (FR-016, SC-007)
- [X] T038 [P] E2E test sweeping viewport widths from 320px to 1920px asserting no visual defects (overlapping text, cut-off content, unusable controls), in `tests/e2e/responsive.spec.ts` (SC-004); include at least one pass using the device-emulation projects from T004 rather than only raw viewport widths, to cover FR-020's device-support requirement
- [X] T039 [P] Performance check asserting Largest Contentful Paint under 2.5 seconds on a simulated fast 4G connection (~1.6 Mbps down, 150ms RTT, standard Lighthouse mobile throttling), in `tests/e2e/performance.spec.ts` or an equivalent Lighthouse CI config (SC-005)
- [X] T040 Run the full manual validation pass from `quickstart.md` and confirm all automated checks pass: `bun test`, `bun run test:e2e`, `bun run lint`, `bun run build`
- [X] T041 [P] Verify the production Docker image serves the built site correctly: `./build.sh` then `./run.sh`, and confirm `http://localhost:3000` matches the `bun run dev` experience, per `quickstart.md`'s "Run via Docker" section
- [X] T042 [P] E2E test simulating a slow or failed font load (e.g. blocking/delaying the font requests) and asserting no visible layout shift/reflow occurs once the 3-second fallback threshold passes, in `tests/e2e/font-loading.spec.ts` (FR-024)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion; its page-composition task (T032) also depends on User Story 1's T024, since both edit `src/app/page.tsx`
- **User Story 3 (Phase 5)**: Depends on Foundational completion and on User Story 2's `ContactPopup` existing (T028), since it adds a field to that same component
- **Polish (Phase 6)**: Depends on all three user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories. Fully testable alone (static content).
- **User Story 2 (P1)**: Independently testable via its own Independent Test, but its final integration task (T032) touches `page.tsx` after User Story 1's T024 for a clean merge — not a functional dependency on US1's content being "correct," just on the file existing.
- **User Story 3 (P2)**: Builds directly on User Story 2's `ContactPopup` component (adds one field to it); cannot be implemented before US2's T028 exists.

### Within Each User Story

- Tests are written and expected to FAIL before implementation tasks begin
- Foundational/shared components (ui/, marketing/, data files) before the components that consume them
- Component implementation before page-level wiring
- Story complete and checked off before moving to the next priority

### Parallel Opportunities

- All Setup tasks marked [P] (T002-T008) can run in parallel once T001 exists
- All Foundational tasks marked [P] (T009-T015) can run in parallel; T016 depends on T005-T007
- Once Foundational completes, User Story 1's component tasks (T020-T023) can run in parallel with each other (different files); T024 depends on all four
- User Story 2's tests (T025-T027) can run in parallel; T029-T031 all touch `ContactPopup.tsx` so are NOT parallel with each other, only with unrelated files
- User Story 3 can be staffed in parallel with User Story 2's later tasks once T028 (ContactPopup's base) exists, though in practice it's a small, fast-following addition
- Polish tasks marked [P] (T036-T039, T041) can run in parallel with each other

---

## Parallel Example: User Story 1

```bash
# Once Foundational (Phase 2) is complete, launch US1's tests together:
Task: "Unit test for Services section content in tests/unit/services.test.tsx"
Task: "E2E test for homepage content acceptance scenarios in tests/e2e/homepage-content.spec.ts"
Task: "E2E accessibility (axe) test in tests/e2e/homepage-a11y.spec.ts"

# Then launch US1's independent component tasks together:
Task: "Create Hero component in src/components/marketing/Hero.tsx"
Task: "Create Services component in src/components/marketing/Services.tsx"
Task: "Create CTABand component in src/components/marketing/CTABand.tsx"
Task: "Create Footer component in src/components/marketing/Footer.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run US1's tests, load the homepage, confirm content per its Independent Test
5. Deploy/demo if ready (homepage content only, "Contact Us" buttons present but inert)

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add User Story 1 → validate independently → demo (content-complete MVP)
3. Add User Story 2 → validate independently → demo (full contact flow works)
4. Add User Story 3 → validate independently → demo (pre-qualified leads)
5. Polish phase → cross-cutting checks (keyboard, dark mode, responsive, performance, Docker) → ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
