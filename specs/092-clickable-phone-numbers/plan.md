# Implementation Plan: Clickable Phone Numbers

**Branch**: `114-clickable-phone-numbers` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/092-clickable-phone-numbers/spec.md`

## Summary

Make every visible +14043511440 on the site a tap-to-call link (`tel:+14043511440`). The number appears as
plain text in four places in three Markdown content files. The change is to write each occurrence as a Markdown
link, `[+14043511440](tel:+14043511440)`, which the existing pipeline renders as an ordinary anchor. No component,
stylesheet, or dependency changes. The JSON-LD `telephone` values stay as they are (spec Clarifications, session
2026-11-07). One Playwright test checks the behavior: no visible copy of the number sits outside a tel: link.

## Technical Context

**Language/Version**: TypeScript (Next.js 15, React 19) for the test; Markdown for the content

**Primary Dependencies**: None added. Existing: unified/remark/rehype pipeline in `src/lib/content.ts`, Playwright

**Storage**: N/A (static content)

**Testing**: Playwright e2e (`bun run test:e2e`) against the built `out/` via `server.ts`; Vitest unit (`bun run test`) not needed for this feature

**Target Platform**: Static site (`output: "export"`) served by `server.ts` and Cloudflare Workers static assets

**Project Type**: Static marketing website

**Performance Goals**: None beyond the existing build; no new requests or scripts

**Constraints**: Constitution (see Constitution Check); links follow the site's link rules; straight quotes only

**Scale/Scope**: 4 occurrences in 3 files (`content/privacy-policy.md` x2, `content/security-policy.md` x1, `content/terms-of-service.md` x1)

## Constitution Check

*Checked before Phase 0 and again after Phase 1.*

| Principle | Check | Result |
|-----------|-------|--------|
| I. Simplicity & YAGNI | Markdown link only; no component, dependency, or config added | Pass |
| II. Modern stack | No change to framework or rendering strategy (SSG) | Pass |
| III. Accessibility & performance | Link text is the visible number, so the accessible name is the number; focus ring comes from the existing `a:focus-visible` rule; no new script or request | Pass |
| IV. Design & content consistency | Uses the existing `.an-prose a` link style; no new one-off style | Pass |
| V. Test-first quality gates | One behavior test (tel: link, no bare number), written with the change; no copy or count assertions | Pass |
| VI. Always-dark, color-only hover | No underline added; link color and weight come from `content.css` (`.an-prose a`, weight 600, hover color) | Pass |
| VII. Graceful shutdown | Not affected | N/A |
| VIII. Markdown content pages | Edits stay in `content/*.md`; no hand-written page | Pass |
| Technology constraints | No dependency change, so no license-report update; no curly quotes; no `#top` link | Pass |
| Development workflow | Spec, issue #114, and branch exist; spec updated before change | Pass |

No violations, so Complexity Tracking stays empty. Gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/092-clickable-phone-numbers/
├── spec.md              # Feature specification (with Clarifications)
├── plan.md              # This file
├── research.md          # Phase 0: pipeline and link decisions
├── data-model.md        # Phase 1: the phone number value and where it lives
├── quickstart.md        # Phase 1: how to verify the change
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Created later by /speckit-tasks
```

`contracts/` is not created: the feature adds no interface the project exposes to users or other systems. The
phone number is a link target, not an API.

### Source Code (repository root)

```text
content/
├── privacy-policy.md    # 2 occurrences: request instructions, Contact section
├── security-policy.md   # 1 occurrence: Contact section
└── terms-of-service.md  # 1 occurrence: Contact section

tests/e2e/
└── phone-links.spec.ts  # new: visible number on policy pages is inside a tel: link

src/lib/content.ts       # read only: confirms tel: is not given target="_blank"
src/styles/content.css   # read only: .an-prose a supplies color, weight 600, hover, focus
```

**Structure Decision**: Content edits in place, plus one e2e spec beside the existing link tests in `tests/e2e/`.
No new directories in `src/`.

## Complexity Tracking

No constitution violations to justify.
