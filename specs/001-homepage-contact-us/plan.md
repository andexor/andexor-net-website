# Implementation Plan: Homepage and Contact Us Popup

**Branch**: `001-homepage-contact-us` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-homepage-contact-us/spec.md`

## Summary

Build the Andexor Network marketing homepage (hero, services, CTA band, footer) and its Contact
Us popup, reproducing the Andexor Network Design System's homepage and Contact Us popup
templates pixel-accurately (`design/README.md`, `design/DESIGN.md`). The contact form is
client-side only for this feature: submitting shows a "Request received" confirmation state, with
no real backend delivery (FR-018) and no destination links wired up yet (FR-017) — both explicit
scope boundaries from the spec. Implemented as a Next.js (React) app styled with the design
system's own CSS tokens, per the constitution's "Modern Component-Based Stack" principle and the
design system's own production guidance. The site is fully statically generated (SSG) at build
time — no server-side rendering or API routes. Package management, building, and the production
runtime all use Bun (not Node.js); build and runtime both execute inside a Docker container that
serves the static build output.

## Technical Context

**Language/Version**: TypeScript; Bun (latest stable release) as the sole JavaScript runtime and
package manager — Node.js is not used at build time or runtime

**Primary Dependencies**: Next.js (App Router), React, `lucide-react` (icons); no state
management or data-fetching library needed (no backend calls in this feature)

**Storage**: N/A — no persistence; contact form values live only in transient component state
(see `data-model.md`)

**Testing**: Vitest + React Testing Library (component/unit), Playwright (end-to-end acceptance
scenarios across Chromium/WebKit/Firefox, with axe-based accessibility checks); all test/build
commands run via `bun run` / `bun test`

**Target Platform**: Web browsers — Chrome and Safari (desktop + mobile) as high-priority tested
targets, Firefox/Edge as lower-priority, no legacy browser support; iPhone/iPad/Android devices
released in the last 5 years (per spec clarifications). Server side: a Docker container running
a minimal Bun static-file server over the SSG build output, built via a 2-stage Dockerfile
(build stage, then a minimal runtime stage) — no Next.js server process at runtime.

**Project Type**: Web (single Next.js frontend app, no separate backend — this feature has no
server-side logic), packaged and run as a Docker container

**Performance Goals**: Largest Contentful Paint under 2.5s on a simulated fast 4G connection
(~1.6 Mbps down, 150ms RTT, standard Lighthouse mobile throttling) (SC-005)

**Constraints**: WCAG 2.1 AA accessibility (constitution III); no backend/database (constitution
Technology Constraints — none required by this feature's spec); dark mode follows OS preference
only, no manual toggle (FR-016); Bun only, no Node.js in build or runtime; build and runtime MUST
run inside Docker via a 2-stage Dockerfile; rendering MUST be static (SSG via Next.js
`output: "export"`) — no SSR, ISR, or API routes

**Scale/Scope**: Single page (4 sections) + 1 modal popup; ~10-15 UI components reused from the
design system's component library

**Hosting Target**: Deferred — per spec Clarifications (Q3) and Assumptions, the hosting/
deployment provider and domain are out of scope for this feature. The Docker image (built via
the root `Dockerfile`) is this feature's deployment artifact; the actual hosting environment is
a separate, future decision.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Simplicity & YAGNI | No backend, no state library, no CMS added, no server process at runtime (static export served as files); form submission is stubbed client-side rather than building unrequired backend integration (FR-018) | PASS |
| II. Modern Component-Based Stack | Next.js/React chosen, matching constitution's mandated framework family and the design system's own reference implementation | PASS |
| III. Accessibility & Performance | Keyboard operability and focus indicators required (FR-015), LCP target set (SC-005), axe checks planned in Playwright suite | PASS |
| IV. Design & Content Consistency | Reuses the design system's exact tokens, components, copy, and layout rather than introducing new styles (per `design/README.md` fidelity notes) | PASS |
| V. Test-First Quality Gates | Vitest/RTL + Playwright tests planned for every acceptance scenario, to be written alongside implementation tasks | PASS |

No violations — Complexity Tracking table not needed.

**Post-Phase 1 re-check**: `data-model.md` and `contracts/ui-contracts.md` introduce no new
dependencies, backend, or state beyond what's covered above (the `onSubmit` extension seam is
optional and unused by this feature). All principles remain PASS after design.

## Project Structure

### Documentation (this feature)

```text
specs/001-homepage-contact-us/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx        # root layout: fonts, global styles import
│   └── page.tsx           # homepage route: composes Hero, Services, CTABand, Footer, ContactPopup
├── components/
│   ├── marketing/          # Hero, Services, CTABand, Footer (page sections)
│   ├── contact/             # ContactPopup (form + confirmation states)
│   └── ui/                  # Button, Input, Card, Badge, Tag, IconButton, Switch, Avatar, Stat, Icon
│                             #   (ported from design/components/*)
└── styles/
    └── tokens/               # copied from design/tokens/*.css, design/styles.css, components.css

public/
├── fonts/                    # self-hosted Play, Roboto, Source Code Pro
└── (logo/favicon assets copied from design/assets/)

tests/
├── unit/                     # Vitest + React Testing Library (ContactPopup state/validation, etc.)
└── e2e/                      # Playwright (acceptance scenarios from spec.md, across browser matrix)

Dockerfile                    # 2-stage: Bun install + `next build` (SSG export to out/), then Bun static file server
server.ts                     # minimal Bun static-file server for `out/`, used only by the Docker runtime stage
build.sh                      # docker build, image tag andexor/<repo-dir-name>:1 (user's standard convention)
run.sh                        # docker run --rm -p 3000:3000, launches server.ts
debug.sh                      # same image, opens /bin/bash instead of running the app
.dockerignore
```

**Structure Decision**: Single Next.js frontend app (no backend package) — this feature has no
server-side logic (FR-018), so a "frontend + backend" split is unwarranted. `src/components/ui/`
holds design-system primitives ported from `design/components/`; `src/components/marketing/` and
`src/components/contact/` hold feature-specific composition, matching `design/ui_kits/
marketing-site/`.

## Complexity Tracking

Not applicable — the Constitution Check above has no violations to justify.
