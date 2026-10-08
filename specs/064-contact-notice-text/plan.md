# Implementation Plan: Contact Notice Text

**Branch**: `29-add-or-edit-alt-text-for-images` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/064-contact-notice-text/spec.md`

## Summary

In `ContactPopup.tsx`, delete "No obligation. " from the start of the note under the form, so it begins "We never share
your personal information." A new e2e spec checks the note's text. The three design copies that quote the old note
(`design/README.md`, the UI kit's `ContactUs.jsx.txt`, and the compiled `design/_ds_bundle.js`) get the new wording.
Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (new `tests/e2e/contact-notice-text.spec.ts`; the existing contact popup and a11y specs
unchanged)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting for `src/` and `tests/` (not `design/`);
straight quotes; license header on the new test file.

**Scale/Scope**: One source line, one new test file, three design reference files with one sentence each.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One sentence is removed. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Less text; the links are unchanged. axe must still pass. |
| IV. Design & content consistency | Pass. The design documents are updated to match, so they do not disagree with the site. |
| V. Test-first | Pass. The new test is written first and seen to fail before the source changes. |
| VI. Always-dark, no hover underline | Pass. No CSS change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/064-contact-notice-text/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/requirements.md
```

No `contracts/`: the feature adds no interface.

### Source Code (repository root)

```text
src/components/contact/ContactPopup.tsx                  # note text starts "We never share ..."
tests/e2e/contact-notice-text.spec.ts                    # new: the note's text, no "No obligation"
design/README.md                                         # line 82: new wording
design/ui_kits/marketing-site/ContactUs.jsx.txt          # line 60: new wording
design/_ds_bundle.js                                     # line 1256: new wording
```

**Structure Decision**: single Next.js project; one new test file.

## Complexity Tracking

None.
