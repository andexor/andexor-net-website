<!--
Sync Impact Report
- Version change: 1.3.2 → 1.4.0 (MINOR: Principle IV gains a new prohibition: no link on the site
  may go to `#top`, and the footer and home page hero logos are plain branding, not links. Owner
  decision, specs/008-no-top-links; enforced by tests/unit/no-top-links.test.ts. Templates in
  .specify/templates/ checked: none mention it). Earlier: 1.3.1 → 1.3.2 (PATCH: Principle VIII names the framework not-found page as the
  one hand-written page, since it is not a routable content page and authoring it as Markdown
  would publish a /404 route; owner decision, specs/006-not-found-page-style). Earlier: 1.2.2 →
  1.3.1 (MINOR 1.3.0, then PATCH 1.3.1 to say explicitly that a link not
  underlined at rest never gains an underline on hover, and that conflicting design-system text is
  corrected; design/DESIGN.md line 112 was fixed). 1.3.0 details (MINOR: Principle VI is materially expanded. No link is underlined
  at rest, on hover, or on focus; the earlier allowance for underlined inline body links is
  removed. Owner decision, specs/007-no-link-underlines. Body links stay distinguishable by color
  at WCAG 2.1 AA contrast. Templates in .specify/templates/ checked: none mention link underlines).
  Earlier: 1.2.1 → 1.2.2 (PATCH: one branch per issue is now a suggestion, not a rule,
  to avoid ceremony on small changes). Earlier: 1.1.0 → 1.2.1 (MINOR for 1.2.0, then PATCH 1.2.1 for the license policy: materially expanded Development Workflow and Technology
  Constraints, based on CONTRIBUTING.md, SECURITY.md, setup.md, and NOTICE added 2026-09-29)
- Modified principles: IV (no links to #top); earlier VIII (not-found page exception); earlier VI (no link underlines at all;
  heading unchanged)
- Added principles: none
- Added guidance: issue-first workflow with commit trailer rule, sign-off meaning (Code of
  Conduct and DCO), AI-generated content rules, supported operating systems, dependency audit
  and license report, contributor documents as companions to this constitution
- Removed sections: none
- Deferred/TODO items:
  - CONTRIBUTING.md says documentation is built with PlantUML and AsciiDoctor and asks for UML
    architecture diagrams. This repo's docs are Markdown (Spec Kit) and has no diagrams. Not
    adopted here until the owner confirms how it applies.
  - CONTRIBUTING.md says "at least 80% of tests pass". Not adopted; this constitution already
    requires all automated checks to pass (Principle V).
- Templates requiring follow-up: none
-->

# Andexor Network, Inc. Website Constitution

## Core Principles

### I. Simplicity & YAGNI (NON-NEGOTIABLE)
The site MUST be built with the simplest structure that satisfies current, specified
requirements. Features, abstractions, dependencies, and configuration MUST NOT be added in
anticipation of hypothetical future needs. Every new dependency or architectural layer MUST be
justified by a requirement in an approved spec or plan.

Rationale: This is a marketing/company website, not a platform. Complexity here has an outsized
cost relative to benefit, and the project explicitly prioritizes speed of delivery and
maintainability over speculative extensibility.

### II. Modern Component-Based Stack
The site MUST be implemented using a modern component-based JavaScript framework (e.g.
React/Next.js). Implementation plans MUST record the specific framework, rendering strategy
(static/SSR/SSG), and hosting target chosen, and subsequent features MUST remain consistent with
that choice unless a plan explicitly proposes and justifies a migration.

Rationale: A single, modern, well-supported framework keeps the codebase approachable for future
contributors and avoids fragmenting the site across incompatible technical approaches.

### III. Accessibility & Performance Standards
Every page MUST meet WCAG 2.1 AA accessibility criteria (semantic HTML, keyboard navigability,
sufficient color contrast, meaningful alt text) and MUST be optimized for Core Web Vitals
(loading, interactivity, visual stability). Accessibility and performance checks MUST be part of
a feature's acceptance criteria, not an afterthought addressed after launch.

Rationale: As the public face of the company, the site's reach and credibility depend directly on
being usable by all visitors and performing well on real-world networks and devices.

### IV. Design & Content Consistency
All pages MUST share a consistent design system (shared components, typography, spacing, color
tokens) and consistent content structure (navigation, headings, calls to action). New UI MUST
reuse existing shared components before introducing new one-off styles or components. Appearance
rules in Principle VI apply to every page. No link on the site MAY go to `#top` (an address whose
fragment is `top`, such as `#top`, `/#top`, or `/page#top`). The footer logo and the home page
hero logo are plain branding, not links; only the header logo on content pages links, and it goes
to the home page. `tests/unit/no-top-links.test.ts` enforces this for source and Markdown.

Rationale: A company website's credibility depends on looking and behaving like one coherent
product; inconsistency across pages undermines trust and increases long-term maintenance cost.

### V. Test-First Quality Gates
Automated checks (at minimum: build/type checks and any tests defined for a feature) MUST pass
before a feature is considered complete. Where a feature's spec defines testable acceptance
criteria, corresponding tests MUST exist and MUST be written before or alongside the
implementation they verify, not deferred to a later cleanup pass.

Rationale: Without a test suite as a safety net, a marketing site accumulates silent regressions
(broken links, broken forms, layout breaks) that go unnoticed until a visitor hits them.

### VI. Always-Dark Appearance and Color-Only Hover
The site MUST always render the dark palette, whatever the visitor's operating system light or
dark setting is. It MUST NOT offer a theme toggle, and no light theme is designed or tested. The
always-dark tokens in `src/styles/tokens/colors.css` deliberately differ from the design
system's `design/tokens/colors.css` and MUST be kept if the design tokens are re-copied. Links
MUST NOT be underlined at rest, on hover, or on focus, in any stylesheet including design-system
base styles. A link that is not underlined at rest MUST NEVER gain an underline on hover or on
focus, even when a design-system document, framework default, or example says "links underline";
this rule wins over all of them, and any such text MUST be corrected when found. Hover MUST be
signaled by a color change and keyboard focus by a visible ring. Links
inside body text MUST stay distinguishable from the surrounding text by color, at the contrast
WCAG 2.1 AA requires, without relying on an underline.

Rationale: One look for every visitor keeps the brand consistent, hover underlines cause a
visible rendering flicker, and footer-style links without underlines look cleaner than mixed
styles. Removing the underline only passes accessibility if body links differ enough in color
from the text.

### VII. Graceful Container Shutdown
Any app run in a Docker container MUST stop on the first `Ctrl+C` (SIGINT) and on `docker stop`
(SIGTERM), and with `--rm` the container MUST be removed. The app itself MUST install handlers
for both signals, stop accepting new connections, let requests in progress finish, and exit with
status 0. It MUST ignore repeated signals during shutdown and MUST force an exit after about five
seconds as a fallback. This MUST NOT be worked around in `run.sh` or `debug.sh`. A Docker setup is
not done until it is verified by sending one SIGINT and confirming the shutdown log line and that
`docker ps -a` shows no leftover container.

Rationale: The app is PID 1 in its container, and Linux ignores SIGINT and SIGTERM for PID 1
unless the process handles them.

### VIII. Markdown-Authored Content Pages
Pages other than the home page MUST be authored as Markdown files under `content/`, where the path
is the route, and rendered to static HTML at build time. They MUST NOT be converted to
hand-written page components. The one exception is the framework's not-found page
(`src/app/not-found.tsx`), which is not a routable content page: it is answered for any unknown
address, so it stays a component, and it renders through the shared page shell. A content page
MUST NOT be linked from the home page or footer until the site owner says it is ready. Authoring
rules live in `content/README.md`.

Rationale: The owner writes and edits page copy directly, and unlinked pages keep unfinished work
out of customers' view.

## Technology Constraints

- Framework: Next.js (React) using Static Site Generation (`output: "export"`). Server-side
  rendering, ISR, and API routes MUST NOT be used.
- Runtime and tooling: Bun, not Node.js, npm, or yarn, for package management, scripts, and the
  production runtime. The built static `out/` directory is served by a small `Bun.serve` static
  file server (`server.ts`), built and run through the root `Dockerfile`.
- Docker workflow: `build.sh`, `run.sh`, and `debug.sh`, with images tagged
  `andexor/<repo-dir-basename>:<VERSION>`. Alternate `docker build` or `docker run` invocations
  MUST NOT be invented.
- License header: every generated source file (`.ts`, `.tsx`, `.js`, `.css`, `Dockerfile`, shell
  scripts, and similar) MUST start with the SPDX header (`SPDX-License-Identifier: Apache-2.0`,
  `Copyright 2026 Andexor Network, Inc.`, `Author: Ed Jenkins <ed@andexor.net>`) in that
  language's comment syntax. In a `Dockerfile` it follows the `# syntax=` directive, which stays
  on line 1. Markdown files are exempt.
- No backend/database complexity MUST be introduced unless a spec explicitly requires
  server-side logic beyond static content and simple form handling.
- Third-party services (analytics, forms, CMS, etc.) MUST be justified in the relevant spec or
  plan before being added as a dependency.
- Supported operating systems (from `CONTRIBUTING.md`): open-source Linux for development,
  testing, and production, preferably the latest Ubuntu LTS. Alpine SHOULD also work when that
  takes very little effort. Docker images SHOULD use the `scratch` base image when possible; the
  Bun runtime image is the justified exception for this site. macOS is discouraged. Windows is
  prohibited unless building a native app that requires it.
- Setup: prerequisites are installed with the scripts described in `setup.md` (`install-bun.sh`,
  `install-docker.sh`, `install-spec-kit.sh`, and Playwright system dependencies).
- Dependency audit: the license report is produced by running `./setup.sh`, which appends a dated
  section to `reports/license-report.md` using `license-checker-rseidelsohn`. The report is
  append-only and MUST NOT be overwritten, so `./setup.sh` is the only way to update it. Dependencies added
  without a requirement in a spec or plan MUST be justified (Principle I).
- Licenses: the project is Apache-2.0 (`package.json`, `LICENSE`, `NOTICE`) and is NOT marked
  `"private"`, so tools report its license correctly. Nothing is excluded from the license report.
  Dependencies MUST NOT use strong copyleft licenses (GPL, AGPL, LGPL); `./setup.sh` fails, and
  leaves the report unchanged, when one is found. Weak file-level copyleft (MPL-2.0) is
  accepted for development-only tools that are never shipped, such as `axe-core`. The optional
  `sharp` dependency of Next.js, whose libvips binaries are LGPL, is replaced by an empty local
  stub (`stubs/sharp`, wired through `overrides` in `package.json`). This is safe because the site
  is a static export with unoptimized images; the stub MUST be revisited if image optimization is
  ever needed.

## Development Workflow

- This project follows the Spec Kit Spec-Driven Development workflow documented in
  `CLAUDE.md`: constitution → specify → clarify → plan → tasks → analyze/checklist → implement.
- Every new feature and every radical redesign MUST originate from a spec
  (`/speckit-specify`) before implementation begins.
- Small tweaks to live pages (copy edits, minor styling, typos, broken links) MAY skip spec
  updates. Anything that adds a page template, changes site-wide behavior, or reverses a
  requirement in an existing spec MUST NOT skip the spec.
- If work is done outside Spec Kit, a retrospective (as-built) spec MUST be written afterward.
- Work is issue-driven, as described in `CONTRIBUTING.md`. Each change starts with a GitHub issue
  written as a user story, with a Description heading, an Acceptance Criteria heading, and
  optionally a Technical Details heading. A separate branch per issue is a suggestion, not a
  requirement: related small changes MAY share a branch, and each commit still references its
  issue. The spec is updated
  before the change when one exists.
- Commits MUST use `git commit -s`. The sign-off certifies acceptance of the Contributor Covenant
  3.0 Code of Conduct, the Developer Certificate of Origin 1.1 (`DCO`), and the Apache License
  2.0 (`LICENSE`, `NOTICE`). Commit messages MUST end their subject with `Closes #N.` (or
  `Fixes #N.` for a bug fix) so GitHub links and closes the issue.
- Every pull request has `andexor/write` as reviewer, is assigned to the user, and is opened
  only after the user says to.
- AI-generated content MUST be reviewed before it is accepted: code MUST be readable, tests MUST
  support the spec and MUST have real value (a test that passes but proves nothing is not
  accepted), edge cases MUST be considered, and AI-written prose that sounds machine-generated
  MUST be rewritten by hand.
- Security issues are reported and handled as described in `SECURITY.md`, never through public
  issues or pull requests.
- Every plan and task list MUST be checked for compliance with these principles before
  implementation starts; a principle violation MUST be justified in the plan's Complexity
  Tracking (or equivalent) section or the plan MUST be revised.

## Governance

This constitution supersedes other informal practices for this repository. Amendments require:

1. A documented rationale for the change (what principle/section changes and why).
2. An explicit version bump following semantic versioning:
   - MAJOR: backward-incompatible principle removals or redefinitions.
   - MINOR: new principle or materially expanded guidance added.
   - PATCH: clarifications, wording, or non-semantic fixes.
3. Review of dependent templates (`.specify/templates/*.md`) for consistency with the amendment.

All specs, plans, and task lists MUST be verifiable against this constitution; any deviation
MUST be explicitly justified in the relevant artifact rather than silently introduced. Use
`CLAUDE.md` for day-to-day workflow guidance; this document governs project principles.
`CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `DCO`, `LICENSE`, `NOTICE`, and `setup.md`
are companion documents for contributors; where they conflict with this constitution, this
constitution wins until one of them is amended.

**Version**: 1.4.0 | **Ratified**: 2026-09-28 | **Last Amended**: 2026-09-30
