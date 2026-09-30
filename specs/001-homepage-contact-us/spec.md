# Feature Specification: Homepage and Contact Us Popup

**Feature Branch**: `001-homepage-contact-us`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "Build a website based on the Homepage and Contact Us popup templates in the "Andexor Network Design System" from Claude Design. Don't worry about where the links point to right now. We will update them later."

## Amendments

### 2026-09-29 (retrospective, see `specs/002-content-pages-card-template/spec.md`)

- Appearance is now always dark (FR-016, SC-007, the dark-scheme edge case, and the toggle
  assumption are superseded).
- The Web Development service card and footer link lead to `/web-development` (FR-017 amended).

### 2026-09-30 (see `specs/003-logo-wordmark/spec.md`)

- The logo wordmark is now the single line "Andexor Network", sized to the mark. The second line
  ("Network, Inc.") and the mark-only `compact` variant are removed.
- The hero's brand row uses the shared logo lockup at the larger design-system size. It is no
  longer a link; the footer logo still scrolls to the top of the home page. (Superseded by the
  2026-09-30 entry below for spec 008.)

### 2026-09-30 (see `specs/008-no-top-links/spec.md`)

- The footer logo is no longer a link and does not scroll to the top. No link anywhere goes to
  `#top`.

### 2026-09-30 (see `specs/010-footer-page-links/spec.md`)

- The footer links Web Hosting, Technical SEO, Agentic Systems, Cost Reduction, Lead Generation,
  Growth Marketing, Process Re-engineering, and About Us to their pages (FR-017 amended).
  Contact, Privacy, and Terms remain placeholders. The footer labels "AI Systems" and "About" are
  now "Agentic Systems" and "About Us".

### 2026-09-30 (see `specs/011-service-card-links/spec.md`)

- The four service cards link to their pages (`/web-development`, `/technical-seo`,
  `/agentic-systems`, `/growth-marketing`), the same addresses as the footer entries of the same
  name. FR-017 no longer applies to service cards. The footer has more entries than there are
  cards, by design.

### 2026-09-30 (see `specs/014-footer-contact-us/spec.md`)

- The footer's "Contact" is now "Contact Us" and opens the contact popup, on every page that shows the
  footer (home, content pages, "Page not found"). The popup is rendered once, in the root layout, and
  the home page's buttons and the footer all open it (FR-007 amended). Closing it returns focus to the
  control that opened it. Privacy and Terms remain placeholders.

### 2026-09-30 (see `specs/015-escape-closes-contact/spec.md`)

- Pressing Esc also closes the contact popup, wherever focus is (FR-012 amended). It does nothing
  when the popup is closed, and while the "Primary need" list is expanded the first Esc closes only
  the list.

## Clarifications

### Session 2026-09-28

- Q: What page-load performance target should the homepage be held to? → A: Largest Contentful Paint under 2.5 seconds on a typical broadband connection.
- Q: Which browsers and devices must the site officially support and be tested against? → A: Current versions of major desktop and mobile browsers, with Chrome and Safari as high-priority targets and other current browsers (Firefox, Edge) as lower priority; no legacy browser support. Devices: any iPhone, iPad, or Android device released in the last 5 years.
- Q: Should the site require a real, self-hosted deployment target (specific hosting provider or domain constraints) for this feature? → A: Out of scope; hosting/deployment is a separate concern to be addressed in its own future spec.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn what Andexor Network offers (Priority: P1)

A prospective customer lands on the homepage and, without any interaction beyond scrolling,
understands who Andexor Network is, what services it offers, and how it can help their
business.

**Why this priority**: This is the first and most fundamental value the site must deliver — if
a visitor can't understand the offering, nothing else on the site matters. It is also the
majority of the homepage's content (hero, services, footer).

**Independent Test**: Load the homepage with no interaction. Confirm the visitor can identify
the company name, the value proposition, the four service disciplines, and how to get in touch,
purely by reading and scrolling the page.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** the page loads, **Then** they see the
   company name and headline value proposition ("Enterprise-grade services at small business
   prices") above the fold.
2. **Given** a visitor scrolls past the hero, **When** they reach the services section, **Then**
   they see exactly four service offerings (Web Development, Technical SEO, Agentic Systems, Growth
   Marketing), each with a title, description, and supporting bullet points.
3. **Given** a visitor scrolls to the bottom of the page, **When** they reach the footer,
   **Then** they see company navigation grouped by category (technical services, business
   services, company), social media links, and a copyright notice.
4. **Given** a visitor is on any viewport width from 320px to 1920px wide, **When** they view the
   homepage, **Then** all sections remain readable and correctly laid out (no overlapping or
   cut-off content), consistent with SC-004.

---

### User Story 2 - Request contact from anywhere on the homepage (Priority: P1)

A prospective customer decides they want to talk to Andexor Network and opens a Contact Request
form from any "Contact Us" call to action on the page, submits their information, and receives
confirmation that their Contact Request was received.

**Why this priority**: Generating Contact Requests is the homepage's core business purpose.
Every other section exists to lead a visitor to this action.

**Independent Test**: Click any "Contact Us" button on the page, fill in the required fields,
submit, and confirm a "Request received" confirmation is shown. Can be tested independently of
the rest of the homepage content.

**Acceptance Scenarios**:

1. **Given** a visitor is anywhere on the homepage, **When** they click a "Contact Us" button
   (hero or CTA band), **Then** a contact popup opens showing a form with fields for full name,
   work email, company website, and primary need.
2. **Given** the contact popup is open, **When** the visitor submits the form without filling in
   a required field, **Then** the browser prevents submission and indicates which field needs
   attention.
3. **Given** the contact popup is open with all required fields completed, **When** the visitor
   submits the form, **Then** the popup switches to a "Request received" confirmation state
   without navigating away from the page.
4. **Given** the confirmation state is shown, **When** the visitor clicks "Done", **Then** the
   popup closes.
5. **Given** the popup is open, **When** the visitor clicks outside the popup panel (the
   background scrim) or the close (×) control, **Then** the popup closes without submitting.
6. **Given** the popup was previously closed after a submission, **When** the visitor opens it
   again, **Then** it shows the empty form state again, not the prior confirmation.

---

### User Story 3 - Choose a specific service interest when requesting contact (Priority: P2)

A prospective customer who already knows which service they're interested in selects it from a
list when requesting contact, so their Contact Request is pre-qualified.

**Why this priority**: Improves lead quality once the core Contact Request flow (User Story 2)
works, but the contact flow is still fully functional and valuable without it (a generic Contact
Request can still be submitted).

**Independent Test**: Open the contact popup, open the "primary need" selector, and confirm all
service options are listed and grouped, and that a selection is retained when submitting.

**Acceptance Scenarios**:

1. **Given** the contact popup form is open, **When** the visitor opens the "primary need"
   selector, **Then** they see options grouped into "Technical Services" (Web Development, Web
   Hosting, Technical SEO, Agentic Systems) and "Business Services" (Cost Reduction, Lead Generation,
   Growth Marketing, Process Re-engineering), plus a "Something else" option.
2. **Given** no option has been chosen yet, **When** the visitor views the selector, **Then** it
   shows a "Select a service…" placeholder and submission is blocked until a choice is made.

---

### Edge Cases

- What happens if a visitor's browser or OS is set to a dark color scheme? ~~The site MUST adapt
  its appearance automatically; there is no manual light/dark toggle.~~ **Superseded by
  002:** the site always renders the dark palette and there is no toggle.
- What happens if a visitor navigates primarily by keyboard? Every interactive element (buttons,
  form fields, selector, close control) MUST be reachable and operable via keyboard, with a
  visible focus indicator.
- What happens if the visitor's viewport is very narrow (e.g. a small phone) or very wide (e.g. a
  large desktop monitor)? Layouts MUST reflow (stacking columns, wrapping content) rather than
  clipping or requiring horizontal scrolling.
- What happens if the visitor opens the contact popup, closes it without submitting, and reopens
  it? The form MUST be shown empty (or at least reset to the form state), not the confirmation
  state.
- What happens if a footer, navigation, or service card link doesn't yet point to a real
  destination? Per this feature's scope, links may be placeholders; they are not required to
  resolve to real pages yet. Activating such a placeholder link MUST be a no-op (it MUST NOT
  navigate away, error, or otherwise change the page) until a real destination is assigned in a
  follow-up change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage MUST present, in order, a hero section, a services section, a call
  to action band, and a footer.
- **FR-002**: The hero section MUST display the Andexor Network brand (logo and name) and a
  headline communicating the value proposition, plus a supporting subheading.
- **FR-003**: The hero section MUST include a "Contact Us" call to action that opens the contact
  popup.
- **FR-004**: The services section MUST present exactly four service offerings — Web
  Development, Technical SEO, Agentic Systems, and Growth Marketing — each with a title, a short
  description, and a list of supporting bullet points.
- **FR-005**: The call to action band MUST restate an invitation to talk and include a "Contact
  Us" call to action that opens the contact popup.
- **FR-006**: The footer MUST present company navigation grouped into technical services,
  business services, and company categories, plus a copyright line, secondary links (e.g.
  privacy, terms), and social media links (e.g. LinkedIn, Twitter/X, GitHub). Per FR-017, these
  may point to placeholder destinations for this feature.
- **FR-007**: Every "Contact Us" call to action on the page, including the footer's "Contact Us"
  (spec 014), MUST open the same contact popup.
- **FR-008**: The contact popup MUST present a form requesting: full name, work email, company
  website, and primary need — with full name, work email, and company website required before
  submission.
- **FR-009**: The primary need field MUST let the visitor either pick from the predefined list
  of service options (grouped by technical/business services) or indicate "something else".
- **FR-010**: The system MUST NOT allow the contact form to be submitted while a required field
  is empty or invalid, and MUST indicate to the visitor which field needs attention.
- **FR-011**: Upon successful submission, the system MUST replace the form with a confirmation
  state acknowledging the request was received, without leaving the current page.
- **FR-012**: The visitor MUST be able to close the contact popup at any time via the close (×)
  control, by clicking outside the popup panel (the scrim), by pressing Esc (spec 015), or — while
  the confirmation state is shown — the "Done" button, without losing their place on the page.
- **FR-013**: Reopening the contact popup after a prior close or submission MUST show the empty
  form state, not a stale confirmation.
- **FR-014**: The site MUST remain usable and legible across viewport widths from 320px to
  1920px wide (per SC-004), reflowing layout as needed.
- **FR-015**: All interactive elements MUST be operable via keyboard alone and MUST show a
  visible focus indicator when focused. For the primary need field, a native `<select>` element's
  own browser-provided keyboard behavior satisfies this requirement; no custom
  dropdown/keyboard handling is required.
- **FR-016**: ~~The site's visual appearance (light/dark) MUST follow the visitor's operating
  system preference automatically; the system MUST NOT provide a manual theme toggle.~~
  **Superseded by 002 FR-024:** the site MUST always render the dark palette regardless of the
  visitor's system setting, and MUST NOT provide a manual theme toggle.
- **FR-017**: (Amended by 002 FR-023: the Web Development service card and footer link now lead
  to `/web-development`; amended again by 010: the other service pages and About Us are linked from
  the footer, while Contact, Privacy, Terms, and the social links remain placeholders; amended by
  011: the four service cards link to their pages.) Navigation, footer, and service card links MAY point to placeholder destinations
  for this feature; resolving them to final destinations is out of scope and will be addressed
  in a follow-up change. Activating a placeholder link MUST be a no-op (no navigation, no error).
- **FR-018**: Actual delivery of submitted Contact Requests to a real destination (e.g. a CRM
  or inbox) is out of scope for this feature; the popup MUST demonstrate the full Contact Request
  and confirmation experience without requiring a live backend integration.
- **FR-019**: The site MUST work correctly on the latest stable release (as of the time of
  testing) of major desktop and mobile browsers, with Chrome and Safari as high-priority targets
  (thoroughly tested) and other such browsers (e.g. Firefox, Edge) as lower priority (expected to
  work, not exhaustively verified); versions other than the latest stable release are out of
  scope.
- **FR-020**: The site MUST work correctly on iPhone, iPad, and Android devices released within
  a rolling 5-year window measured back from the time of testing.
- **FR-021**: The contact popup's close control MUST have an accessible name (e.g. "Close")
  exposed to assistive technology, not rely on its visual "×" glyph alone.
- **FR-022**: The work email field MUST hint to mobile devices, wherever the platform supports
  it, that an email-optimized virtual keyboard layout should be shown (e.g. one with an easily
  accessible `@` key); this is a data-entry convenience only and MUST NOT add any additional
  validation beyond what FR-010 already requires.
- **FR-023**: Upon activating "Send" on a valid form, the system MUST disable the submit control
  to prevent duplicate submissions; no separate double-click/rapid-activation handling is
  required beyond this. Whenever the contact popup is opened or reopened, the submit control
  MUST be enabled — consistent with FR-013's reset to the blank form state, and regardless of
  whether the popup markup is recreated per open or kept mounted and toggled visible. (For this
  feature, disabling the button while "submission" completes is effectively a no-op given
  FR-018's client-side-only behavior; it is specified now so the control is functional once a
  real backend integration exists.)
- **FR-024**: The system MUST wait up to 3 seconds for the page's custom fonts (Play, Roboto,
  Source Code Pro) to become available before painting text in them. If a given font has not
  loaded within that window, the system MUST render text using a fallback font for the remainder
  of that page view and MUST NOT later switch to the custom font once it finishes loading (no
  visible font swap/reflow is permitted after a fallback has been shown).
- **FR-025**: The homepage and contact popup MUST conform to WCAG 2.1 Level AA, per the project
  constitution's Accessibility & Performance Standards principle — including, but not limited
  to, sufficient color contrast for text and interactive elements, and semantic
  structure/labeling that assistive technology can interpret (in addition to the keyboard and
  focus requirements already specified in FR-015, FR-021, and FR-022).

### Key Entities

- **Contact Request**: A prospective customer's inquiry submitted through the contact popup.
  Attributes: full name, work email, company website, primary need (one of a predefined list of
  services, or "something else"). Not persisted or transmitted anywhere by this feature.
- **Service Offering**: One of the four disciplines Andexor Network presents on the homepage
  (Web Development, Technical SEO, Agentic Systems, Growth Marketing). Attributes: title,
  description, supporting bullet points.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify all four service offerings and the company's
  core value proposition without scrolling past the Services section of the page (the second
  section per FR-001's fixed order: hero, services, CTA band, footer).
- **SC-002**: A visitor can complete and submit the Contact Request form (from opening the popup
  to clicking "Send") in under 60 seconds, using only the keyboard or only a mouse/touch. This is
  a human-paced UX budget, not a system response-time measurement, and intentionally allows
  headroom for visitors with slower motor or reaction time; most visitors are expected to
  complete it well under 60 seconds.
- **SC-003**: After a visitor clicks "Send" on a valid, completed Contact Request form, the
  system visibly transitions to the "Request received" confirmation state within 10 seconds.
  This is a system response-time target, separate from SC-002's human-paced budget. (For this
  feature the transition is entirely client-side per FR-018, so it is expected to be
  near-instantaneous; this target is set now so it can be re-verified, and tightened if needed,
  once a real backend integration exists.)
- **SC-004**: The homepage and contact popup render without visual defects (overlapping text,
  cut-off content, unusable controls) at viewport widths from 320px to 1920px wide.
- **SC-005**: The homepage's Largest Contentful Paint occurs in under 2.5 seconds on a
  simulated fast 4G connection (approximately 1.6 Mbps download, 150ms round-trip time),
  consistent with standard Lighthouse mobile throttling.
- **SC-006**: 100% of interactive elements on the page (links, buttons, form fields, popup
  close control) are reachable and operable using keyboard navigation alone.
- **SC-007**: ~~A visitor whose system is set to dark mode sees an appropriately adapted color
  scheme automatically, with no action required on their part.~~ **Superseded by 002 SC-003:**
  visitors on light and dark systems see an identical dark page.
- **SC-008**: Closing and reopening the contact popup always returns the visitor to a blank
  Contact Request form, verified across repeated open/close/submit cycles.

## Assumptions

- The visual design, copy, layout, and interaction behavior are taken as final ("high fidelity")
  from the Andexor Network Design System homepage and Contact Us popup templates (see
  `design/README.md` and `design/DESIGN.md`); this feature reproduces them rather than
  redesigning them.
- Navigation, footer, and social links are placeholders for this feature; per the user's
  instruction, where they point will be decided and updated in a later change.
- Submitting the contact form only needs to demonstrate the client-side experience (validation
  and confirmation state); wiring it to a real email/CRM/backend destination is a separate,
  future concern.
- There is no manual light/dark mode toggle. ~~Appearance follows the operating system's
  preference only, per the design system.~~ Superseded by 002: the site is always dark.
- The "Tweaks panel" and other design-exploration-only tooling shown in the design system's
  reference files are not part of the production site.
- Hosting and deployment target (provider, domain) are out of scope for this feature and will
  be decided separately; success criteria are evaluated against the built site regardless of
  where it is eventually hosted.
- FR-024's 3-second font-load ceiling is expected to be reached rarely, since fonts are
  self-hosted (same origin) and subset to only the weights used; under normal conditions fonts
  are expected to load well within SC-005's 2.5-second LCP budget. In a degraded scenario where
  the ceiling is actually reached, SC-005 may not be met for that page view — this is an
  accepted trade-off in favor of never showing a visible font swap/reflow (FR-024), not a defect.
