# Implementation Plan: "Business Services" Capitalization

**Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/013-business-services-caps/spec.md`

## Summary

The Contact Us "Primary need" list gets its group headings from `PRIMARY_NEED_GROUPS` in
`src/components/contact/primary-need-options.ts`, where the second group is labeled "Business
services". The fix is one string there, plus the same replacement in the design-system copy, the
specs, and one test comment, so a case-sensitive search finds nothing. The existing unit test does
not guard the wording (it compares the rendered labels to `PRIMARY_NEED_GROUPS` itself), so a new
test asserts the rendered group headings against literal text (FR-004). No new files in `src/`, no
new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change

**Constraints**: option values, labels, and order unchanged (FR-002); only the exact phrase
"Business services" changes; the all-caps footer headings and lowercase running text stay

**Scale/Scope**: 1 source string, 1 test edit, 3 design-copy files, 5 spec files (001 and 012), 1
test comment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. One string changed, one small test. No helper or constant. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Group label text only; the select is still a native `<select>` with `<optgroup>`s. |
| IV. Design & content consistency | Pass. It makes the two group headings, the footer, and the page eyebrows agree. |
| V. Test-first | Pass. The new test is written first and fails until the string changes. |
| VI. Always-dark, no link underlines | Not affected. |
| VII. Graceful shutdown | Not affected; the usual Docker check still applies. |
| VIII. Markdown-authored pages | Not affected. The pages already read "Business Services". |
| License header | No new source files. |

No violations; Complexity Tracking is empty. No constitution change.

## Project Structure

### Documentation (this feature)

```text
specs/013-business-services-caps/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── group-labels.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/components/contact/primary-need-options.ts   # edit: label "Business Services"

tests/unit/primary-need-select.test.tsx          # edit: comment; new test for literal group headings

design/README.md                                 # edit: wording
design/ui_kits/marketing-site/ContactUs.jsx.txt  # edit: optgroup label
design/_ds_bundle.js                             # edit: label string

specs/001-homepage-contact-us/{spec,tasks,data-model,quickstart}.md   # edit: wording
specs/012-technical-services-caps/spec.md        # edit: out-of-scope mentions
```

**Structure Decision**: Existing single Next.js project; only the files above change.

## Design Decisions

- **Literal-text test.** The new test renders the popup and asserts the `optgroup` labels equal
  `["Technical Services", "Business Services"]`, written out in the test, not read from
  `PRIMARY_NEED_GROUPS`. That is what makes FR-004 real. It covers spec 012's group label too, so
  it needs 012 built first (or in the same pass).
- **Same string, not a shared constant.** The label is used once in `primary-need-options.ts`.
- **Search-based check for SC-001.** "Nothing left anywhere" is verified by a one-time
  case-sensitive `grep` in the tasks, not by a permanent test that scans the project (it would also
  scan its own text and the specs).
- **Order with 012.** Both specs edit `primary-need-options.ts`, on different lines. Build 012
  first, then 013, or both in one pass.

## Complexity Tracking

None.
