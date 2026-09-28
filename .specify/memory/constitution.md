<!--
Sync Impact Report
- Version change: [TEMPLATE] → 1.0.0 (initial ratification)
- Modified principles: n/a (first concrete adoption from placeholder template)
- Added principles:
  - I. Simplicity & YAGNI (NON-NEGOTIABLE)
  - II. Modern Component-Based Stack
  - III. Accessibility & Performance Standards
  - IV. Design & Content Consistency
  - V. Test-First Quality Gates
- Added sections: Technology Constraints, Development Workflow, Governance
- Removed sections: none (template scaffold replaced with concrete content)
- Deferred/TODO items: none
- Templates requiring follow-up: none tracked automatically by this command; verify
  .specify/templates/plan-template.md, spec-template.md, and tasks-template.md stay consistent
  with these principles on next use.
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
reuse existing shared components before introducing new one-off styles or components.

Rationale: A company website's credibility depends on looking and behaving like one coherent
product; inconsistency across pages undermines trust and increases long-term maintenance cost.

### V. Test-First Quality Gates
Automated checks (at minimum: build/type checks and any tests defined for a feature) MUST pass
before a feature is considered complete. Where a feature's spec defines testable acceptance
criteria, corresponding tests MUST exist and MUST be written before or alongside the
implementation they verify, not deferred to a later cleanup pass.

Rationale: Without a test suite as a safety net, a marketing site accumulates silent regressions
(broken links, broken forms, layout breaks) that go unnoticed until a visitor hits them.

## Technology Constraints

- Framework: a modern component-based JavaScript framework (React/Next.js family), as selected
  and recorded in the implementation plan for the first feature and carried forward.
- No backend/database complexity MUST be introduced unless a spec explicitly requires
  server-side logic beyond static content and simple form handling.
- Third-party services (analytics, forms, CMS, etc.) MUST be justified in the relevant spec or
  plan before being added as a dependency.

## Development Workflow

- This project follows the Spec Kit Spec-Driven Development workflow documented in
  `CLAUDE.md`: constitution → specify → clarify → plan → tasks → analyze/checklist → implement.
- Every feature MUST originate from a spec (`/speckit-specify`) before implementation begins;
  ad hoc, spec-less changes to site structure or content are discouraged outside of trivial
  fixes (typos, broken links).
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

**Version**: 1.0.0 | **Ratified**: 2026-09-28 | **Last Amended**: 2026-09-28
