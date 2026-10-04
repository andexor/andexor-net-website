# Quickstart: Homepage and Contact Us Popup

Validates the feature end-to-end against the acceptance scenarios in `spec.md`.

## Prerequisites

- [Bun](https://bun.sh) installed locally (no Node.js required).
- Repo dependencies installed (`bun install` from the project root, once the Next.js app scaffold
  from this feature's tasks exists).

## Run locally

```bash
bun run dev
```

Open the printed local URL in a browser.

## Run via Docker

Use the repo's standard build/run/debug scripts (image name `andexor/<repo-dir-name>:1`, per
`build.sh`):

```bash
./build.sh   # docker build, replacing any prior image with the same tag
./run.sh     # docker run --rm -p 3000:3000, runs server.ts
./debug.sh   # same image, but opens /bin/bash instead of running the app
```

Open `http://localhost:3000`.

## Manual validation (maps to spec Acceptance Scenarios)

1. **Homepage content (User Story 1)**
   - Load the page. Confirm the hero shows the Andexor Network brand and headline
     "Enterprise services for small business" above the fold.
   - Scroll to Services: confirm exactly four cards (Web Development, Technical SEO, AI
     Systems, Growth Marketing), each with title, description, and bullets.
   - Scroll to the footer: confirm three link groups (technical services, business services,
     company) and a copyright line.
   - Resize the viewport from ~320px to ~1920px wide: confirm no overlapping/cut-off content at
     any width.

2. **Contact flow (User Story 2)**
   - Click "Contact Us" in the hero. Confirm the popup opens with the form.
   - Click "Contact Us" in the CTA band instead. Confirm the same popup opens.
   - Try submitting with fields empty: confirm the browser blocks submission and highlights a
     required field.
   - Fill in full name, work email, company website, and a primary need; submit. Confirm the
     popup switches to the "Request received" confirmation without navigating away from the
     page, and that the whole flow (open popup to submit) takes under 60 seconds (SC-002) and
     the confirmation appears within 10 seconds of clicking "Send" (SC-003).
   - Click "OK". Confirm the popup closes.
   - Reopen the popup (any Contact Us button). Confirm it shows the empty form, not the prior
     confirmation.
   - Open the popup again and click the background scrim, then reopen and click the × control.
     Confirm both close the popup without submitting.

3. **Service selection (User Story 3)**
   - Open the popup and open the "Primary need" selector. Confirm it shows "Select a
     service…" as a placeholder, grouped options ("Technical Services": Web Development, Web
     Hosting, Technical SEO, Agentic Systems; "Business Services": Cost Reduction, Lead Generation,
     Growth Marketing, Process Re-engineering), and a trailing "Something else" option.
   - Confirm submission is blocked while the placeholder is still selected.

4. **Keyboard-only pass (SC-006, FR-015)**
   - Using only Tab/Shift+Tab/Enter/Space/Escape (no mouse), reach and activate: a "Contact Us"
     button, every form field, the primary need selector, the submit button, and the popup close
     control. Confirm a visible focus indicator at every stop.

5. **Dark mode (SC-007, FR-016)**
   - Switch the OS/browser to a dark color scheme preference and reload. Confirm the site's
     colors adapt automatically with no in-app toggle present.

## Automated checks (once implemented per tasks.md)

```bash
bun test              # Vitest + React Testing Library: form validation, popup state reset
bun run test:e2e      # Playwright: full acceptance scenarios above, across Chrome/Safari/Firefox
bun run lint
bun run build         # production build succeeds
./build.sh             # production image builds successfully
```

Playwright's project matrix should include Chromium and WebKit (Chrome/Safari — high priority per
FR-019) and Firefox (lower priority). Accessibility assertions (axe) run as part of the e2e
suite.

## Expected outcome

All manual steps above succeed, all automated checks pass, and the production build completes
without errors — satisfying User Stories 1–3 and Success Criteria SC-001 through SC-008.
