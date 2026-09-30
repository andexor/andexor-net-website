---

description: "Task list for the footer 'Contact Us' that opens the contact form"
---

# Tasks: Footer "Contact Us" Opens the Contact Form

**Input**: Design documents from `/specs/014-footer-contact-us/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/contact-us-action.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-009 lists what they must cover.

**Organization**: Grouped by user story. The shared popup provider is foundational (every story needs it). US1 adds the footer button and its behavior on the home page, US2 checks the label and look, and US3 proves it on the other pages.

## Format: `[ID] [P?] [Story]` Description

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header (`//` comments in `.ts`/`.tsx`)
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`) and `tsc` rejects untyped helper parameters, so inline repeated steps instead of writing helper functions
- Spec 015 (Esc closes the popup) is already built inside `ContactPopup`; nothing here changes it
- Manual checks in Firefox and Safari are optional and low priority (owner decision); do not add them as required steps

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure. WebKit hangs on the owner's machine and is skipped.

---

## Phase 2: Foundational (blocks all user stories)

**Purpose**: one popup per page, shared through context, mounted once in the root layout. The home page keeps working exactly as before.

- [X] T002 Create `tests/unit/contact-provider.test.tsx` (with the SPDX header). Define a small test component `Opener` that calls `useContact()` and renders `<button onClick={(event) => openContact(event.currentTarget)}>Open</button>`, and a second one, `OpenerNoArg`, that renders `<button onClick={() => openContact()}>Open no arg</button>`. Tests: (a) inside `<ContactProvider>`, no dialog is rendered at first; clicking "Open" shows `getByRole("dialog", { name: "Contact Us" })` and only one dialog exists; (b) after opening with "Open", clicking the popup's "Close" button removes the dialog and `document.activeElement` is the "Open" button (use `waitFor`); (c) same as (b) when the popup is closed with "Escape" (`fireEvent.keyDown(document, { key: "Escape" })`); (d) with `OpenerNoArg`, focus the button first (`button.focus()`), click it, close, and expect focus back on it (the fallback is `document.activeElement`); (e) if the opener has been removed from the DOM before the popup closes (`unmount` its container or `element.remove()`), closing does not throw and focus is not moved; (f) opening again after closing shows the empty form; (g) `useContact()` rendered without a provider throws an error whose message mentions `ContactProvider` (wrap the render in `expect(() => render(<Opener />)).toThrow(/ContactProvider/)` and silence `console.error` with `vi.spyOn(console, "error").mockImplementation(() => {})`). Run `bun run test tests/unit/contact-provider.test.tsx` and confirm it fails (the module does not exist yet).
- [X] T003 Create `src/components/contact/ContactProvider.tsx` (with the SPDX header, `"use client"`). Export `ContactProvider({ children })` and `useContact()`. Keep `const [open, setOpen] = useState(false)` and `const returnFocusRef = useRef<HTMLElement | null>(null)`. `openContact(opener?: HTMLElement | null)` (wrapped in `useCallback`) sets `returnFocusRef.current = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)` and calls `setOpen(true)`; the opener is passed explicitly by the footer button because Safari and Firefox on macOS do not focus a button when it is clicked. `closeContact` (`useCallback`) calls `setOpen(false)`. Add `useEffect(() => { if (open) return; const opener = returnFocusRef.current; returnFocusRef.current = null; if (opener && opener.isConnected) opener.focus(); }, [open])`, which runs after the popup has unmounted. Render `<ContactContext.Provider value={{ openContact }}>{children}<ContactPopup open={open} onClose={closeContact} /></ContactContext.Provider>`. `useContact()` returns the context value and throws `new Error("useContact must be used inside ContactProvider")` when there is no provider (create the context with `null` as its default). Import `ContactPopup` from `./ContactPopup`. Do not change `ContactPopup.tsx`.
- [X] T004 Edit `src/app/layout.tsx`: import `ContactProvider` from `@/components/contact/ContactProvider` and change `<body>{children}</body>` to `<body><ContactProvider>{children}</ContactProvider></body>`. Leave the head, the font script, and the metadata alone. (The layout stays a server component; the provider is a client component.)
- [X] T005 Edit `src/app/page.tsx`: remove the local `contactOpen` state, `openContactPopup`, `closeContactPopup`, the `useState` import, and the `<ContactPopup ... />` element and its import. Call `const { openContact } = useContact();` and pass `onContactClick={() => openContact()}` to `Hero` and `CTABand`. Update the comment above the component to say the popup is rendered once by `ContactProvider` in the layout and every "Contact Us" call to action opens it (FR-007 of spec 001). Keep `"use client"`.
- [X] T006 Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox`. T002's tests must now pass, and the existing home page popup tests (`tests/e2e/contact-flow.spec.ts`, `contact-popup-a11y.spec.ts`, `keyboard-navigation.spec.ts`, `contact-escape.spec.ts`) must still pass. If the home page shows two dialogs, `page.tsx` still renders its own `ContactPopup`; remove it.

**Checkpoint**: the popup is app-wide, and nothing visible has changed yet.

---

## Phase 3: User Story 1 - The footer's "Contact Us" opens the contact form (Priority: P1) 🎯 MVP

**Goal**: On the home page, activating "Contact Us" in the footer opens the same popup as the hero and call-to-action band buttons, without navigating, and closing it returns focus to the footer entry.

**Independent Test**: On `/`, activate the footer's "Contact Us". The Contact Us popup opens; the address does not change; closing it puts focus back on the footer entry.

### Tests for User Story 1 (write first; they fail until T010)

- [X] T007 [P] [US1] Create `tests/e2e/footer-contact.spec.ts` (with the SPDX header). In `test.describe("Footer Contact Us on the home page")`, define the footer entry as `page.locator("footer").getByRole("button", { name: "Contact Us" })` and add tests: (a) clicking it shows `getByRole("dialog", { name: "Contact Us" })`, exactly one dialog exists, and it has the fields "Full name", "Work email", "Company website", and "Primary need"; (b) the URL is still `/` and `page.evaluate(() => window.scrollY)` is the same before and after the click (scroll to the footer first with `scrollIntoViewIfNeeded()`, read `scrollY`, click, read again); (c) fill the four fields (`getByLabel("Primary need").selectOption("Web Development")`), click "Send", and expect the "Request received" heading; (d) closing with the "Close" button, with "Done" after sending, and with `Escape` each hide the dialog and leave `document.activeElement` on the footer button (check with `await expect(footerButton).toBeFocused()`); (e) keyboard: `footerButton.focus()`, press `Enter`, expect the dialog; close it with `Escape`, expect focus back, press `Space`, expect the dialog again; (f) after closing, clicking it a second time opens the popup again.
- [X] T008 [P] [US1] Update the unit tests that render the footer on its own, which will throw without a provider: in `tests/unit/content-links.test.tsx` and `tests/unit/logo.test.tsx`, wrap each `render(<Footer />)` in `<ContactProvider>` (`import { ContactProvider } from "@/components/contact/ContactProvider";`). In `content-links.test.tsx`, the footer's internal links must still equal `FOOTER_PAGES` (the new button has no `href`, so `internalPaths` does not count it). Do not change anything else in those files. They keep passing after T010.
- [X] T009 [US1] In `tests/e2e/contact-flow.spec.ts`, change the CTA band test (line 22, `page.getByRole("button", { name: "Contact Us" }).last().click()`) to `page.locator(".an-cta-band").getByRole("button", { name: "Contact Us" }).click()`, because `.last()` will become the footer button once T010 is done. The other tests use `.first()`, which is still the hero button. In `tests/e2e/footer-links.spec.ts`, remove `["Contact", "#contact"]` from `PLACEHOLDERS`, rename the test to "Privacy and Terms are still placeholders on ...", and update the comment so it says Privacy and Terms stay placeholders (FR-003 of spec 010, amended by spec 014).

### Implementation for User Story 1

- [X] T010 [US1] Create `src/components/marketing/FooterContactButton.tsx` (with the SPDX header, `"use client"`): `export function FooterContactButton({ label }: { label: string })` renders `<button type="button" className="an-footer__col-link" aria-haspopup="dialog" onClick={(event) => openContact(event.currentTarget)}>{label}</button>` with `const { openContact } = useContact();`. Then edit `src/components/marketing/Footer.tsx`: change the COMPANY items to `["About Us", "Contact Us"]`; import `FooterContactButton`; in the `column.items.map`, render `<FooterContactButton label={item} />` when `item === "Contact Us"` and otherwise `<a href={ITEM_HREFS[item]} className="an-footer__col-link">{item}</a>`; delete the `slugify` function and the `?? \`#${slugify(item)}\`` fallback (no entry uses it any more); update the comment above `Footer` so it says Contact Us opens the contact popup (spec 014) and only Privacy and Terms remain placeholders per FR-017. Keep `Footer` a server component (no `"use client"`).
- [X] T011 [US1] In `src/styles/marketing.css`, extend `.an-footer__col-link` so it also works on a `<button>`: add `background: none; border: 0; padding: 0; font-family: inherit; cursor: pointer; text-align: left;` to the existing rule (keep `font-size`, `color`, and `text-decoration: none`). Do not add any hover underline; hover stays the existing `color: #ffffff` rule. Buttons keep the browser's default focus ring; check in T012 that it is visible on the dark background and add `outline: 2px solid var(--blue-300); outline-offset: 2px;` to `.an-footer__col-link:focus-visible` only if it is not (look at how other focus rings are styled in `src/styles/` and match them).
- [X] T012 [US1] Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox`. T007, T008, and T009 must pass, along with `tests/unit/no-hover-underline.test.ts`, `tests/unit/no-top-links.test.ts`, and the axe checks in `tests/e2e/homepage-a11y.spec.ts`.

**Checkpoint**: US1 is complete and shippable on its own (on the home page).

---

## Phase 4: User Story 2 - The footer entry reads "Contact Us" (Priority: P1)

**Goal**: The Company column reads "About Us" and "Contact Us", and the new entry looks like the others: same type and color, color change on hover, focus ring, no underline.

**Independent Test**: View the footer on any page. The second Company entry reads exactly "Contact Us" and is styled like "About Us".

- [X] T013 [US2] In `tests/e2e/footer-contact.spec.ts`, add `test.describe("Footer Contact Us label and look")` for each start page in `["/", "/web-development", "/nope"]`: (a) the Company column's entries (`page.locator("footer ul.an-footer__col-list").last().locator("li")`) have text `["About Us", "Contact Us"]`, and `footer.getByText("Contact", { exact: true })` has count 0; (b) the entry is a button with `aria-haspopup="dialog"`, `footer.getByRole("link", { name: "Contact Us" })` has count 0, and the button has no `href`; (c) `getComputedStyle(button).textDecorationLine` is `"none"` at rest, while hovered (`await button.hover()`), and while focused (`await button.focus()`); (d) the button's `font-size` and `color` at rest equal those of the "About Us" link (`footer.getByRole("link", { name: "About Us" })`), and hovering changes the button's `color` (compare before and after, as `tests/e2e/link-style.spec.ts` does for links). Inline the repeated steps; do not write helper functions.
- [X] T014 [US2] Run `bun run test:e2e --project=chromium --project=firefox`. T013 must pass. If the look differs from the links, fix the CSS in T011's rule (`src/styles/marketing.css`), not the tests.

**Checkpoint**: label and look match the other footer entries.

---

## Phase 5: User Story 3 - "Contact Us" in the footer on the other pages (Priority: P2)

**Goal**: On the content pages and the "Page not found" page, the footer's "Contact Us" opens the same popup on that page, with no navigation.

**Independent Test**: From `/web-development` and `/nope`, activate the footer's "Contact Us": the popup opens on that page and the address is unchanged.

- [X] T015 [US3] In `tests/e2e/footer-contact.spec.ts`, add `test.describe("Footer Contact Us on other pages")` for each of `/web-development` and `/nope`: (a) go to the page, click `footer.getByRole("button", { name: "Contact Us" })`, expect the dialog, exactly one dialog, and the URL unchanged; (b) close with "Close" and expect the footer button focused; (c) fill and send, expect "Request received", press `Escape`, expect the dialog gone and the same page still shown (its heading, or "Page not found", still visible). In the same describe, add an axe test on `/web-development` with the popup open, as in `tests/e2e/contact-popup-a11y.spec.ts` (`new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()`), expecting no violations. No source change is expected.
- [X] T016 [US3] Run `bun run test:e2e --project=chromium --project=firefox`. T015 must pass. If a case fails on content pages, check that `ContactProvider` is in `layout.tsx` (not in a page); do not add a popup to `ContentPage`. Confirm `content/` Markdown pages and `src/app/[...slug]/page.tsx` are unchanged (`git diff --stat -- content src/app/\[...slug\]`).

**Checkpoint**: all three stories are complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T017 [P] In `specs/001-homepage-contact-us/spec.md`, add a dated Amendments entry (2026-09-30, see `specs/014-footer-contact-us/spec.md`): the popup is app-wide (rendered once in the root layout), the footer's "Contact Us" opens it on every page, and focus returns to the control that opened it; also add "and the footer" to FR-007's "Every 'Contact Us' call to action on the page". In `specs/001-homepage-contact-us/contracts/ui-contracts.md`, update the page composition contract (the code block at lines 14 to 18 and the note at line 24): popup state now lives in `ContactProvider` (root layout), and the home page calls `useContact().openContact`.
- [X] T018 [P] Update spec 010's living documents, which say "Contact" is a placeholder: in `specs/010-footer-page-links/spec.md` (the Edge Cases line about "Contact", "Privacy", and "Terms", FR-003, and the Assumption about "Contact"), `specs/010-footer-page-links/data-model.md` (the Contact row), and `specs/010-footer-page-links/contracts/footer-links.md` (lines 9 and 18), say that "Contact Us" now opens the contact popup (spec 014) and only Privacy and Terms remain placeholders. Leave spec 010's plan, research, and tasks as the record of what was built.
- [X] T019 [P] Make spec 014's own documents match what was built: in `specs/014-footer-contact-us/plan.md`, `research.md` (Decision 5), `data-model.md`, and `contracts/contact-us-action.md`, change `openContact()` to `openContact(opener?)`, explain that the footer button passes its own element because Safari and Firefox on macOS do not focus a button when it is clicked, that the other triggers fall back to `document.activeElement`, and that focus is returned in an effect that runs after the popup has unmounted (instead of "after the next frame"). In `contracts/contact-us-action.md`, add the new tests (`footer-contact.spec.ts` label-and-look and other-pages cases) to the "Checked by tests" table.
- [X] T020 Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox` once more. Grep for regressions: `grep -rn "underline" src/styles` (nothing new), `grep -rn "#top" src content` (nothing new), and `grep -rn "#contact" src tests specs/014-footer-contact-us` (no source or test should still expect `#contact`). Then run the Docker shutdown check: `./build.sh && ./run.sh`, open the site, click the footer's "Contact Us" on `/` and `/web-development`, one `^C`, and `docker ps -a` shows no leftover container. Manual checks in Firefox and Safari are optional.
- [ ] T021 Do not open a PR unless asked. Commit with `git commit -s`, subject ending in `Closes #N.` for the GitHub issue (use `Refs #15.` if there is no issue for it).

### Added during implementation

- `server.ts` did not decode percent-encoded paths, so the `app/[...slug]/page-*.js` chunk 404ed and content pages never hydrated (found when the footer button did nothing on `/web-development`). Fixed with path decoding and an out-of-`out/` guard; `tests/e2e/static-server.spec.ts` covers it (3 tests fail without the fix). See research.md, Decision 7.
- `tests/unit/not-found.test.tsx` and one test in `tests/unit/logo.test.tsx` render the not-found page, whose footer needs the provider; they were wrapped too.

---

## Dependencies & Execution Order

- T001, then T002, then T003, then T004 and T005 (different files, both after T003), then T006.
- US1: T007, T008, and T009 are in different files and can run in parallel (all after T006); T010 follows them; T011 follows T010 (T010's markup, T011's style); T012 is last.
- US2 (T013, T014) follows T012 and edits the file T007 created. US3 (T015, T016) follows T014 and edits the same file.
- T017, T018, and T019 are in different files and can run in parallel after T012. T020 and T021 come last.
- Spec 015 (Esc) is already built and independent.

## Parallel Example: User Story 1

```text
T007 tests/e2e/footer-contact.spec.ts
T008 tests/unit/content-links.test.tsx, tests/unit/logo.test.tsx
T009 tests/e2e/contact-flow.spec.ts, tests/e2e/footer-links.spec.ts
```

## Implementation Strategy

MVP is Phase 2 plus US1 (T001 to T012): the shared provider, the footer button, and its behavior on the
home page, with focus returning on close. US2 only adds tests for the label and look (the CSS is part of
T011). US3 adds only tests, because the provider is in the root layout and so already reaches every page;
do not ship the button without the provider being in the layout, or it would work on the home page only.
