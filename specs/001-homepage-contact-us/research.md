# Research: Homepage and Contact Us Popup

All items below were resolved without open questions; none required external research beyond the
project's own constitution and the supplied design system bundle (`design/`).

## Framework choice

- **Decision**: Next.js (App Router, TypeScript, static export — no API routes needed for this
  feature; see "Rendering strategy" below).
- **Rationale**: The constitution's "Modern Component-Based Stack" principle mandates the
  React/Next.js family. The design system's own handoff notes (`design/README.md`) recommend
  "Next.js or Astro with plain CSS custom properties" specifically because all design tokens are
  already CSS variables. Next.js is chosen over Astro because the design system's reference
  implementation is React (JSX component files with matching `.types.ts` prop contracts),
  minimizing translation effort.
- **Alternatives considered**: Astro (rejected: would require re-deriving React component
  structure into Astro's component model with no reuse benefit); plain Vite + React SPA
  (rejected: Next.js gives static/SSG output and routing conventions for near-zero extra cost,
  and is the more common "modern component-based" choice referenced by the constitution).

## Rendering strategy

- **Decision**: Static Site Generation (SSG) via Next.js's static export (`output: "export"`).
  All content (hero, services, footer copy; the Contact Us popup markup) is known at build time
  and rendered to plain HTML/CSS/JS with no per-request server rendering, no API routes, and no
  ISR/revalidation.
- **Rationale**: Explicit project decision. It also fits the feature cleanly: there is no
  server-side data (no backend, no persistence — FR-018) and no per-visitor personalization, so
  SSR/ISR would add complexity with no benefit (Simplicity & YAGNI). Static export also
  simplifies the Docker runtime stage to serving files rather than running a Node/Bun server
  process, and gives the best achievable Largest Contentful Paint (SC-005) since there is no
  server render step on the request path.
- **Alternatives considered**: Server-side rendering / default Next.js server output (rejected:
  no dynamic per-request data exists to justify it, and it would require the runtime container
  to run a full Next.js server instead of serving static files); Incremental Static
  Regeneration (rejected: nothing on this page changes between deploys, so revalidation has no
  use case here).

## Styling approach

- **Decision**: Copy `design/tokens/*.css`, `design/styles.css`, and `design/components/
  components.css` into the app's global styles largely as-is (per `design/README.md`: "The
  token CSS ... can be copied directly into production"). Component-level styling uses these
  CSS custom properties, not a CSS-in-JS or utility framework.
- **Rationale**: Avoids introducing a new styling dependency (Simplicity & YAGNI) and matches
  the design system's own guidance for production use.
- **Alternatives considered**: Tailwind CSS (rejected: would require re-expressing all tokens
  in a different system for no benefit, and isn't what the design system ships); CSS-in-JS
  (rejected: unnecessary runtime cost for a static marketing page).

## Fonts and icons

- **Decision**: Self-host Play, Roboto, and Source Code Pro (per `design/README.md`: "Google
  Fonts; self-host for production"). Use `lucide-react` for icons (per README: "install
  `lucide-react` in production"). Font loading waits up to 3 seconds for each custom font before
  painting text in it (FR-024); if a font isn't ready within that window, text renders in a
  fallback font for the rest of that page view with no later swap once the custom font arrives.
- **Rationale**: Matches explicit design system guidance; avoids a runtime dependency on
  Google's CDN for a production site. The bounded-wait/no-later-swap strategy (FR-024) was
  chosen deliberately over a standard `font-display: swap` because Play and Roboto's metrics
  differ enough from system fallback fonts (especially at the hero headline's size/tracking)
  that a swap would cause a visible, janky reflow — explicit project decision, made after
  discussing the trade-off between avoiding that reflow and a small risk to the LCP target
  (SC-005) in a degraded scenario.
- **Alternatives considered**: `font-display: swap` (rejected: causes a visible text
  reflow/layout shift once the custom font loads, given the metric mismatch with fallback
  fonts); `font-display: optional` with its default ~100ms decision window (rejected: too short
  to reliably capture the font on a slow connection, defeating the point of self-hosting for
  reliability); unbounded wait with no timeout (rejected: risks an indefinitely blank page if a
  font request stalls or fails); loading fonts/icons from CDN at runtime (rejected: README
  explicitly calls out self-hosting for production; also reduces third-party dependencies).

## Form submission handling

- **Decision**: The contact form's "submit" transitions the popup to the confirmation state
  entirely client-side (React state), per FR-018 and the design reference
  (`ContactUs.jsx.txt`: `onSubmit={e => { e.preventDefault(); setSent(true); }}`). No network
  call is made in this feature.
- **Rationale**: Spec explicitly scopes real delivery (CRM/inbox integration) out of this
  feature (FR-018, confirmed in clarification session). Implementing a real backend now would
  violate Simplicity & YAGNI ahead of that requirement existing.
- **Alternatives considered**: Wiring a placeholder API route now (rejected: no requirement
  drives it yet; would need to be redone once a real destination is chosen).

## Testing approach

- **Decision**: Component/unit tests with Vitest + React Testing Library (form validation,
  popup open/close/reset behavior, service card content). End-to-end acceptance tests with
  Playwright covering the User Story acceptance scenarios (homepage content visible, contact
  flow end-to-end, keyboard-only navigation, viewport reflow) and automated accessibility checks
  (axe) integrated into the Playwright run.
- **Rationale**: Constitution principle V (Test-First Quality Gates) requires acceptance
  criteria to have corresponding tests written alongside implementation. Playwright covers
  real-browser behavior (needed for focus/keyboard and responsive checks); Vitest + RTL covers
  fast component-level logic (form validation, state reset).
- **Alternatives considered**: Cypress (rejected: Playwright has first-class multi-browser
  support matching the clarified browser matrix — Chromium/Chrome, WebKit/Safari, Firefox —
  without paid add-ons); manual-only testing (rejected: violates constitution principle V).

## Package manager, build tool, and runtime

- **Decision**: Bun for package management, running `next build`, and as the production runtime
  (via Next.js's standalone output, `bun run server.js`). Node.js is not used at any stage.
- **Rationale**: Explicit project decision (not derived from the design system or constitution).
- **Alternatives considered**: N/A — directed choice, not evaluated against alternatives here.

## Containerization

- **Decision**: A 2-stage Dockerfile: a build stage (installs dependencies with `bun install
  --frozen-lockfile`, runs `bun run build`, producing the static export in `out/`) and a minimal
  runtime stage that copies only `out/` plus a small Bun static-file server script (`server.ts`)
  and runs it under `oven/bun:1-slim` as a non-root user.
- **Rationale**: Explicit project decision, refined once SSG was chosen: since the site is fully
  static, the runtime stage doesn't need `next start`, a Next.js server process, or the
  `output: "standalone"` server bundle at all — it only needs to serve pre-built files. A tiny
  Bun HTTP server (`Bun.serve` + `Bun.file`) is enough, keeping the runtime image minimal and
  avoiding Node.js entirely per the project's Bun-only decision. A 2-stage build still keeps
  build-only tooling (dev dependencies, source, full `node_modules`) out of the shipped image.
- **Alternatives considered**: Serving via `next start`/standalone server (rejected: unnecessary
  once output is fully static — there is no server-side work left to do); a general-purpose
  static file server like nginx or Caddy (rejected: would reintroduce a non-Bun runtime
  component for no functional benefit, contradicting the Bun-only decision); single-stage image
  (rejected: ships unnecessary build tooling and source in the runtime image).

## Performance/browser/device targets (from spec clarifications)

- **Decision**: Target LCP < 2.5s on a typical broadband connection; Chrome and Safari
  (desktop + mobile) as high-priority tested browsers, Firefox/Edge as lower-priority "expected
  to work"; devices: iPhone, iPad, Android released in the last 5 years; no legacy browser
  support.
- **Rationale**: Directly from spec Success Criteria (SC-005) and Functional Requirements
  (FR-019, FR-020), resolved during `/speckit-clarify`.
- **Alternatives considered**: N/A — values were decided in the spec clarification session, not
  re-derived here.
