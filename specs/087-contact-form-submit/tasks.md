# Tasks: Submit the Contact Us Form

**Input**: Design documents from `/specs/087-contact-form-submit/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/contact-service.md, contracts/ui-contract.md, quickstart.md

**Tests**: written alongside the code (constitution V), for behavior only: the request shape, confirmation after 200
only, release before send, the failure path, retry, reopen, and the ignored late answer. No test asserts the message
wording, colors, or spacing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: the user story the task serves (US1 delivery, US2 responsive Send, US3 failure path)

## Phase 1: Setup

No setup needed: no new dependency or configuration. Branch `102-contact-form-submit` and issue #102 exist.

## Phase 2: Foundational

The service module and the test stand-ins. Every story depends on these.

- [X] T001 Create `src/lib/contact-service.ts` (license header) exporting `CONTACT_SERVICE_URL = "https://andexor.net/api/contact"`, `CONTACT_TIMEOUT_MS = 10_000`, the `ContactRequest` interface moved from `src/components/contact/ContactPopup.tsx` (fields `name`, `email`, `phone`, `website`, `help`, `sourcePath`, all `string`, with the spec 071 comment on `sourcePath`), and `async function sendContactRequest(request: ContactRequest, signal?: AbortSignal): Promise<void>`. It creates an `AbortController`, aborts it from `setTimeout(CONTACT_TIMEOUT_MS)` and when the caller's `signal` aborts, calls `fetch(CONTACT_SERVICE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "omit", body: JSON.stringify(request), signal })`, clears the timer in `finally`, resolves when `response.status === 200`, and otherwise throws an `Error` naming the status. The answer body is never read. Doc comment cites spec 087 and `contracts/contact-service.md`.
- [X] T002 In `src/components/contact/ContactPopup.tsx`, replace the local `ContactRequest` interface with `import type { ContactRequest } from "@/lib/contact-service"` and `export type { ContactRequest }` so existing imports keep working.
- [X] T003 [P] Create `tests/unit/contact-service.test.ts` (license header) with `vi.stubGlobal("fetch", vi.fn())`: `CONTACT_SERVICE_URL` equals the literal `"https://andexor.net/api/contact"` (the Playwright fixture repeats it); a call fetches that URL once with `method` `"POST"`, `Content-Type` `application/json`, `credentials` `"omit"`, and a body that parses back to the six fields passed in, empty strings included; status 200 resolves; statuses 201, 400, and 500 reject; a rejecting `fetch` rejects; with `vi.useFakeTimers()` a `fetch` that never settles rejects once `CONTACT_TIMEOUT_MS` passes and the signal given to `fetch` is aborted; an already-aborted caller signal aborts the fetch. Restore the stub and timers in `afterEach`.
- [X] T004 [P] In `tests/e2e/fixtures.ts`, add and export `async function stubContactService(context, { status = 200, delayMs = 0 } = {})` that routes `"https://andexor.net/api/contact"` (comment: must match `CONTACT_SERVICE_URL` in `src/lib/contact-service.ts`, pinned by `tests/unit/contact-service.test.ts`), fulfilling `OPTIONS` with 204 and `POST` with `status` after `delayMs`, both with `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: POST, OPTIONS`, and `Access-Control-Allow-Headers: Content-Type`, and returning an array that collects each `POST` body as parsed JSON. Call it from the `context` fixture next to `stubCookiebot` so every test gets the 200 answer. No TypeScript type annotations in this file (Playwright's loader here fails on them; use contextual typing like the existing code).

**Checkpoint**: `bun run test` passes with the new service test; `bun run test:e2e` still passes because the fixture answers the address and the popup still shows the confirmation at once.

## Phase 3: User Story 1 - A contact request is delivered (Priority: P1) MVP

**Goal**: Send posts the request to the service and the confirmation appears only after a 200.

**Independent Test**: fill the form, press Send, and see one `POST` carrying the six fields reach the service address, with "Request received" shown only after the answer (quickstart steps 1, 2, and 4).

- [X] T005 [US1] In `src/components/contact/ContactPopup.tsx`, change `onSubmit` to `(request: ContactRequest) => Promise<void> | void`, defaulting to `sendContactRequest` from `@/lib/contact-service`, and make `handleSubmit` async: `preventDefault()`; return if `busyRef.current` is set, else set it; read the `FormData` into a `ContactRequest` at once; `setSubmitting(true)`; create an `AbortController` in `controllerRef`; `await onSubmit(request)` in try/catch, passing `controller.signal` only when `onSubmit` is the default sender; after it settles, do nothing if `controller.signal.aborted`; on success `setSent(true)`; on failure `setSubmitting(false)` (the message comes in US3); in `finally` clear `busyRef` and `controllerRef`. Keep the spec 001 FR-023 comment accurate and cite spec 087 and `contracts/ui-contract.md`.
- [X] T006 [US1] In the same file, in the effect on `open`, when `open` is false abort `controllerRef.current` (and in the effect's cleanup on unmount), so a late answer after close changes nothing (spec FR-008). The open branch still resets `sent`, `submitting`, and the form.
- [X] T007 [US1] In `tests/unit/contact-popup.test.tsx`, make the submission tests async: rename "calls onSubmit and shows the confirmation on a valid submit, without any network request" to say the confirmation follows a resolved `onSubmit`, and use `await screen.findByRole("heading", { name: "Request received" })`. Add: with an `onSubmit` returning a deferred promise, after the click the form is still shown, Send is disabled, and the heading is absent; after resolving, the heading appears. Add: with `onSubmit` deferred, rerender with `open={false}` then `open`, resolve the promise, and assert the heading never appears and Send is enabled. Add: with the default `onSubmit` and `fetch` stubbed to answer 200, the confirmation appears (the default is wired). Update the other submit tests (`findBy`, `await`) as needed; keep `fillValidForm`.
- [X] T008 [US1] Create `tests/e2e/contact-submit.spec.ts` (license header, contextual typing only) using `stubContactService` per test with `page.context()`: (a) fill Name, Email, Website, and the help field, press Send, wait for the heading, and assert the one recorded body has exactly the keys `name`, `email`, `phone`, `website`, `help`, `sourcePath` with the typed values, `phone` as `""`, and `sourcePath` `"/"`; (b) from `/web-development`, assert `sourcePath` is `"/web-development"`; (c) with `delayMs: 700`, after pressing Send assert the heading is not visible and Send is disabled while waiting, then the heading becomes visible.

**Checkpoint**: unit and e2e suites pass; by hand against the live service (quickstart step 4) one `POST` with the six fields gets a 200 and the confirmation appears.

## Phase 4: User Story 2 - Send looks fully responsive (Priority: P2)

**Goal**: the visitor sees Send come back up before the request is sent.

**Independent Test**: press Send with a mouse, by touch, and with a held Enter or Space; the button is drawn normal, with the form still shown, before the `POST` leaves (quickstart steps 4 and 6).

- [X] T009 [US2] In `src/components/contact/ContactPopup.tsx`, add `whenReleased(form: HTMLFormElement): Promise<void>`: with `requestAnimationFrame`, loop until the form's submit button (`button[type="submit"]`) no longer matches `:active` and `activationKeyDownRef.current` is false, then resolve after one more frame. Track the key in a ref with `keydown`/`keyup` listeners on the panel for `event.key === "Enter"` and `" "`, installed by the effect that already runs while `open` (set the ref false on cleanup). In `handleSubmit`, `await whenReleased(event.currentTarget)` after reading the form data and before `setSubmitting(true)`, so Send stays enabled and drawn normal during the wait while `busyRef` blocks a second activation. Comment why (spec 087 FR-003; Chrome fires click on Enter keydown, Space on keyup; `.an-btn:disabled` and the `:not(:disabled):active` rule mean a disabled Send never looks pressed).
- [X] T010 [US2] In `tests/unit/contact-popup.test.tsx`, add: after `fireEvent.click` on Send, `onSubmit` has not been called and Send is still enabled synchronously; after `await` of two animation frames (`await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))`, or `waitFor`), `onSubmit` was called once and Send is disabled. Add: two clicks in a row before the frames pass call `onSubmit` once.
- [X] T011 [US2] In `tests/e2e/contact-submit.spec.ts`, add a chromium-only test (`test.skip(browserName !== "chromium", ...)`): fill the form, focus Send with Tab, `keyboard.down("Enter")`, wait 300 ms, assert no body was recorded and the heading is absent, `keyboard.up("Enter")`, then the heading appears and one body was recorded. Add the same for `" "` (Space) on all projects, since Space sends on keyup.

**Checkpoint**: unit and e2e suites pass; by hand, a mouse press on Send visibly comes back up before the confirmation, and a held Enter sends on release.

## Phase 5: User Story 3 - A failed send does not lose the visitor's entries (Priority: P3)

**Goal**: a failed send keeps the form, says so, and lets the visitor retry.

**Independent Test**: make the service answer 500 or not at all, press Send, see the entries kept, an announced message, and Send enabled; press Send again and reach the confirmation (quickstart step 5).

- [X] T012 [US3] In `src/components/contact/ContactPopup.tsx`, add `failed` state: set false at the start of `handleSubmit` and on open; set true in the catch when the controller is not aborted. Render, directly above the Send button and only while `failed`, `<p role="alert" className="an-contact-form__note an-contact-form__error">We could not send your request. Please try again.</p>`. No newline inside the text. The message is not focusable, so the Tab order is unchanged.
- [X] T013 [US3] In `src/styles/marketing.css`, add a rule for `.an-contact-form__error` only if the message sits too close to Send; if added, it sets spacing only, no new color (comment citing spec 087). Otherwise add nothing. (Done: nothing added; the form's 14px flex gap already spaces the message.)
- [X] T014 [US3] In `tests/unit/contact-popup.test.tsx`, add: with `onSubmit` rejecting, after the click the form stays with the typed values, `screen.findByRole("alert")` resolves, the heading is absent, and Send is enabled; clicking Send again calls `onSubmit` a second time and the alert is gone while the second promise is pending; with a resolving second `onSubmit` the heading appears; after a failure, rerender closed then open shows no alert and empty fields. Assert the alert's presence by role only, never its text.
- [X] T015 [US3] In `tests/e2e/contact-submit.spec.ts`, add: with `status: 500`, after Send the dialog still shows the form, the Name field keeps its value, `getByRole("alert")` is visible, Send is enabled, and the heading is absent; then register a 200 route (`page.route` on the same address, which wins over the fixture's), press Send again, and the heading appears. Run `@axe-core/playwright` on the dialog while the alert is shown, the way `tests/e2e/contact-popup-a11y.spec.ts` does, and assert no violations.

**Checkpoint**: unit and e2e suites pass; by hand with the address blocked, the message appears and a retry after unblocking reaches the confirmation.

## Phase 6: Polish

- [X] T016 [P] In `CLAUDE.md`, add a short paragraph (near the Markdown content pages section) saying the Contact Us form posts to the fully-qualified `https://andexor.net/api/contact` through `src/lib/contact-service.ts`, that the request format is in `specs/087-contact-form-submit/contracts/contact-service.md`, that tests answer the address themselves and must never reach the live service, and that a manual send from a local run creates a real contact request.
- [X] T017 Run `bun run format`, `bun run lint`, `bun run build`, `bun run test`, and `bun run test:e2e` (port 3000 free), then the hand checks in `specs/087-contact-form-submit/quickstart.md` steps 4 to 7 (step 4 creates one real contact request; use a recognizable name). (Done 2026-10-28: format, lint (one pre-existing rules-of-hooks error in fixtures.ts, same on main), build, 176 unit tests, and the chromium and android e2e projects pass, apart from the two retired spec 041 "Page data in an external file" tests, which cannot pass since the data stays inline; firefox and webkit are not installed on this machine. Two real sends reached the live service and got 200.)
- [X] T018 Search the changed files for curly quotes, hover underlines, and `#top` links; fix any found. Confirm every new file starts with the SPDX header.

## Dependencies and Execution Order

- Phase 2 first: T001 before T002; T003 and T004 can run in parallel with each other and with T002 once T001 exists.
- US1 (T005-T008) needs Phase 2. T007 and T008 can be written in parallel once T005 and T006 are in.
- US2 (T009-T011) needs T005; T010 and T011 can run in parallel after T009.
- US3 (T012-T015) needs T005; T014 and T015 can run in parallel after T012 and T013.
- US2 and US3 are independent of each other and can be done in either order.
- Phase 6 last. T016 can be written any time after Phase 2.

## Implementation Strategy

- MVP is Phase 2 plus US1: the request is delivered and the confirmation waits for the 200. That alone makes the
  form real.
- Then US2 (the visible release), then US3 (the failure path). Each is a small change to `handleSubmit` and its
  tests, so they can ship separately if needed.
- Do not commit until the owner has viewed the result (the owner commits with "commit this"). The commit subject
  ends with `Closes #102.`
