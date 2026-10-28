# Feature Specification: Submit the Contact Us Form

**Feature Branch**: `102-contact-form-submit`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Update the Contact Us form so that when a user hits the Send button, data is submitted to /api/contact. There is a web service in a separate code repo that should handle the form submission. Make sure that the Send button returns from the depressed state to the normal state before the form is submitted, so that the button appears to be fully responsive to the user. Once the form is successfully submitted and a 200 response is received, let the UI move on to display the "Request received" screen." Follow-up: "Use the fully-qualified URL for the form submission: https://andexor.net/api/contact"

Builds on spec 001 (the Contact Us popup, its form, and the "Request received" confirmation). Spec 001 FR-018 left
delivery of a contact request out of scope and had the popup show the confirmation without sending anything. This
feature replaces that: the request is now delivered to a web service, and the confirmation is shown only after the
service has accepted it. Spec 001 FR-023 (Send is disabled after activation and enabled again whenever the popup
opens) still applies and now does real work.

## What the site does today

- The visitor fills in the Contact Us form (Name, Email, Phone, Website, How can we help you?) and presses Send.
- Nothing is sent anywhere. The popup switches to the "Request received" screen at once (spec 001 FR-018).
- Send is disabled the moment it is activated (spec 001 FR-023). Pressing Send moves the button 2px right and 2px
  down (its pressed state); the pressed look is dropped as soon as the button is disabled. Because the confirmation
  replaces the form immediately, the visitor rarely sees the button return to its normal position: the form is
  simply gone.
- A web service that accepts contact requests exists in a separate repository. It will answer at `https://andexor.net/api/contact`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A contact request is delivered (Priority: P1)

A visitor fills in the Contact Us form and presses Send. The site sends the request to the contact service. When the
service confirms it has accepted the request, the popup shows the "Request received" screen.

**Why this priority**: This is the point of the form. Until now a visitor's request went nowhere.

**Independent Test**: Open the popup, fill in the required fields, press Send, and confirm that one request carrying
the form's data reaches `https://andexor.net/api/contact`, and that "Request received" is shown only after the service answers with
success.

**Acceptance Scenarios**:

1. **Given** the popup is open with a valid form, **When** the visitor presses Send, **Then** one request carrying
   the visitor's entries (name, email, phone, website, how we can help, and the page that opened the popup) is sent
   to `https://andexor.net/api/contact`.
2. **Given** a request has been sent, **When** the service answers with success (status 200), **Then** the popup
   switches to the "Request received" screen, exactly as it looks today, with OK focused (spec 036).
3. **Given** a request has been sent, **When** the service has not yet answered, **Then** the form stays in view,
   Send stays disabled, and the confirmation is not shown.
4. **Given** the form has a required field empty, **When** the visitor presses Send, **Then** no request is sent and
   the form's own validation message is shown, as today (spec 001 FR-010).
5. **Given** "Request received" is shown, **When** the visitor closes the popup and opens it again, **Then** the
   empty form is shown with Send enabled (spec 001 FR-013 and FR-023), and no second request is sent for the
   earlier submission.

---

### User Story 2 - Send looks fully responsive (Priority: P2)

A visitor presses Send and sees the button go down and come back up, the way every other button on the site
behaves, before anything else happens.

**Why this priority**: The owner asked for this specifically. A button that is pressed and then vanishes under a
new screen feels broken, even when it worked.

**Independent Test**: Press Send with a mouse, with touch, and with the keyboard (Enter and Space) and confirm that
the button is shown in its normal, unpressed state after the press and before the request leaves. In automated
tests this is observable as the order of events: the button is back in its normal state before the request is
sent, and the form is still on screen at that moment.

**Acceptance Scenarios**:

1. **Given** the visitor presses and releases Send, **When** the press ends, **Then** the button is drawn in its
   normal position and look before the request is sent, and the request is not sent until that has happened.
2. **Given** the visitor presses Send with the keyboard and holds the key, **When** the key is released, **Then**
   the button returns to its normal state, and the request is sent after that, not while the key is held.
3. **Given** the request has been sent and Send is disabled, **When** the visitor presses on the disabled button,
   **Then** it does not move (the pressed look applies only to an enabled button, as today).

---

### User Story 3 - A failed send does not lose the visitor's entries (Priority: P3)

The service is unreachable, slow, or answers with an error. The visitor is told the request could not be sent and
can try again without retyping anything.

**Why this priority**: The owner described only the success path. A reasonable failure path is needed so a visitor
is never left with a disabled button and no explanation, but it is secondary to delivering the request.

**Independent Test**: Make the service answer with an error, with a status other than 200, or not at all, press
Send, and confirm the form stays with its entries, a short message says the request could not be sent, and Send is
enabled again so the visitor can retry.

**Acceptance Scenarios**:

1. **Given** the service answers with any status other than 200, **When** the answer arrives, **Then** the form
   stays in view with the visitor's entries intact, a short message tells the visitor the request could not be sent
   and asks them to try again, Send is enabled again, and the confirmation is not shown.
2. **Given** the request cannot be sent at all (no network, the service is down), **When** the failure is known,
   **Then** the same thing happens as in scenario 1.
3. **Given** the service has not answered within the waiting limit (see Assumptions), **When** the limit passes,
   **Then** the same thing happens as in scenario 1.
4. **Given** the failure message is shown, **When** the visitor presses Send again, **Then** a new request is sent,
   the message is removed while the request is in flight, and success shows "Request received" as usual.
5. **Given** the failure message is shown, **When** the visitor closes the popup and opens it again, **Then** the
   empty form is shown without the message.

---

### Edge Cases

- The visitor presses Send twice quickly: only one request is sent, because Send is disabled on the first
  activation (spec 001 FR-023).
- The visitor closes the popup (Close, Esc, or the scrim) while a request is in flight: the popup closes as today.
  A late answer from the service must not reopen the popup or show the confirmation later. Whether the request was
  delivered is up to the service; the site does not try to cancel it.
- The visitor navigates away while a request is in flight: nothing on the site breaks, and no error is shown on
  the next page.
- The optional fields (Phone, Website, How can we help you?) are empty: they are sent empty, not left out, so the
  service always sees the same set of fields.
- The service's success answer carries a body the site does not understand: the site ignores the body. Status 200
  is the only thing it reads.
- The form is used on a content page or the Page not found page: the page that opened the popup is sent with the
  request (spec 071), the same as from the home page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When Send is activated on a valid form, the site MUST send one request to the fully-qualified
  address `https://andexor.net/api/contact`, never a relative path, carrying the visitor's entries: name, email, phone, website, how we can help, and the path of
  the page that opened the popup (spec 071). Optional fields MUST be sent empty rather than omitted.
- **FR-002**: The popup MUST show the "Request received" screen only after the service has answered with status
  200. The confirmation screen itself MUST NOT change (spec 001 FR-011, spec 036 focus on OK).
- **FR-003**: Before the request is sent, the Send button MUST be shown in its normal, unpressed state. The request
  MUST NOT be sent while the button is in its pressed state (mouse button or key held), and the form MUST still be
  on screen when the button is drawn normal. This applies to mouse, touch, and keyboard activation.
- **FR-004**: While the request is in flight, Send MUST stay disabled (spec 001 FR-023) and the form MUST stay in
  view. A disabled Send MUST NOT show the pressed look.
- **FR-005**: When the request fails (any status other than 200, a request that could not be sent, or no answer
  within the waiting limit), the site MUST keep the form and the visitor's entries, show a short message that the
  request could not be sent and asks the visitor to try again, and enable Send again. The message MUST be announced
  to assistive technology. Its wording is not tested.
- **FR-006**: Pressing Send after a failure MUST send a new request, remove the failure message while that request
  is in flight, and then behave as FR-002 or FR-005 says.
- **FR-007**: Opening or reopening the popup MUST show the empty form with Send enabled and no failure message
  (spec 001 FR-013 and FR-023), and MUST NOT resend an earlier submission.
- **FR-008**: Closing the popup while a request is in flight MUST close it as today. A late answer MUST NOT reopen
  the popup, show the confirmation, or show an error afterwards.
- **FR-009**: A request that is not valid (spec 001 FR-010) MUST NOT be sent.
- **FR-010**: The site remains a static export: the contact service is not part of this repository and this
  feature adds no server-side code, API route, or rendering mode to the site (constitution, Technology
  Constraints). The exact shape of the request the site sends and the answer it expects MUST be written down in a
  contract document in this feature's directory, so the service's repository can be built against it.
- **FR-011**: The site's rules still apply: no link underline at rest, on hover, or on focus, straight quotes
  only, always dark, keyboard and focus behavior unchanged, and no copy, wording, color, or spacing tests. Tests
  for this feature stand in for the service; they MUST NOT depend on the real service being reachable.

### Key Entities

- **Contact Request**: A visitor's inquiry from the Contact Us form, as in spec 001, with these fields: name
  (required), email (required), phone, website, how we can help (at most 250 characters, spec 073), and the path
  of the page that opened the popup (spec 071, not entered by the visitor).
- **Contact Service**: The web service, in a separate repository, that receives a Contact Request at
  `https://andexor.net/api/contact` and answers with status 200 when it has accepted it. What it does with the request afterwards is
  outside this spec.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid submissions result in exactly one request to `https://andexor.net/api/contact` carrying all six fields.
- **SC-002**: After the service answers with success, the "Request received" screen is shown within 1 second; on
  a normal connection, from pressing Send to seeing the confirmation takes under 3 seconds. Spec 001 SC-003's
  10-second ceiling still holds.
- **SC-003**: In every activation of Send (mouse, touch, keyboard), the button is shown in its normal, unpressed
  state before the request is sent, with the form still on screen.
- **SC-004**: When the service fails or does not answer, 100% of visitors keep their entries and can retry without
  retyping, and no visitor is left with a disabled Send and no message.
- **SC-005**: The popup still passes the existing accessibility checks (WCAG 2.1 AA, keyboard-only flow, focus on
  OK after success), and the unit and end-to-end suites pass without the real service.

## Assumptions

- The site always sends to the fully-qualified address `https://andexor.net/api/contact`, as the owner asked,
  wherever the page itself is served from. From the live site that is the same origin. From a local run (the
  Docker container, `bun run preview`, a built `out/` served by `server.ts`) it is a cross-origin request to the
  live service. The service allows requests from `http://localhost:3000` (the Docker container and `server.ts`)
  and `http://localhost:8787` (`bun run preview`), checked on 2026-10-28; from any other origin the browser
  refuses the send and the site shows the failure path (FR-005). The allow list lives in the service's
  repository. The site sends the request without cookies, so the service needs no credentials allowance.
- Routing `https://andexor.net/api/contact` to the service in production, next to the static site's Worker,
  belongs to the service's deployment and is not done in this repository. Until it is routed, the site's static
  hosting answers that path with the Page not found page, which the site treats as a failed send (FR-005).
- The request is sent as a single structured message in the format common for web services, with one field per
  Contact Request field; the plan records the exact format in the contract document (FR-010). The service tells
  the site it has accepted the request with status 200 and nothing else is read from the answer.
- The service handles its own protection against abuse (rate limits, spam checks). The site sends the request as
  it is and adds no verification step. If a check such as a challenge is wanted later, it is a separate feature.
- Failure handling is a reasonable default the owner did not specify: keep the form, say the request could not be
  sent, let the visitor retry. The waiting limit for an answer is 10 seconds, matching spec 001 SC-003; a request
  still unanswered after that is treated as failed.
- "Shown in its normal state before the request is sent" means the button has been drawn unpressed at least once
  after the activation, with the form still on screen. It does not mean an artificial delay long enough to
  notice: the aim is that the visitor sees the button come back up, nothing more.
- Automated tests stand in for the service by answering `https://andexor.net/api/contact` themselves, so no
  test sends a request to the live service. A send from a local run that is not under test reaches the live
  service (if it allows the origin) and creates a real contact request; that is expected and is the owner's
  choice when testing by hand.
- Nothing about the popup's look changes, apart from the failure message when a send fails. The message uses the
  existing form note styling and the shared link rules (CLAUDE.md), with no new colors or components.
