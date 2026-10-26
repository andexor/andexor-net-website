# Implementation Plan: Footer Text Size

**Branch**: `87-implement-cookiebot` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/079-footer-text-size/spec.md`

## Summary

Make the footer's copyright line and the "Do Not Sell or Share My Personal Information" link below it 16px, the size of
the footer's column links. Two `font-size` values in `src/styles/marketing.css` change from 13px to 16px
(`.an-footer__copyright` and `.an-footer__legal-link`). No markup, text, color, or link change.

## Technical Context

**Language/Version**: CSS, in the existing stylesheet

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: the existing Playwright no-sideways-scroll and footer checks; no new test (pixel sizes are not tested)

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Performance Goals**: none

**Constraints**: no sideways scroll at 360px (SC-002); no link underline; always dark; straight quotes

**Scale/Scope**: two CSS declarations

## Constitution Check

- Static export, Bun, no server code: pass.
- Design system: pass; 16px is the size the footer's column links already use (`.an-footer__col-link`).
- No link underlines, no `#top` links, straight quotes, always dark: pass; nothing about them changes.
- Tests for behavior, not copy or pixel sizes: pass; no test is added or changed.
- Readable Prettier output: pass; CSS only.
- Spec first, issue-driven: spec exists; issue is #87, as on the branch.

Post-design re-check: pass, no violations; Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/079-footer-text-size/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md            (from /speckit-tasks)
```

`data-model.md` and `contracts/` are not needed: no data and no interface change.

### Source Code (repository root)

```text
src/styles/marketing.css   (.an-footer__copyright and .an-footer__legal-link: font-size 13px -> 16px)
```

**Structure Decision**: edit the two existing rules in place.
