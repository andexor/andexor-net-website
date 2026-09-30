# Contract: Left Edge

## Rule

- The page root reserves scrollbar space: `html { scrollbar-gutter: stable; }` in
  `src/styles/globals.css`.
- No page or component sets its own horizontal offset to compensate for scrolling or page length.
- `design/DESIGN.md` section 4 states the rule.

## Checked by tests

| Check | Where |
|-------|-------|
| With hidden or overlay scrollbars, the left edges are identical, and unchanged at 140px (1600px window) outside desktop Chromium (FR-006) | `tests/e2e/left-edge.spec.ts`, all projects |

## Not covered

- Windows with classic visible scrollbars are not tested (owner decision 2026-09-30; a test was written, confirmed the fix, and was removed).
- Browsers without `scrollbar-gutter` (Safari before 18.2) keep a 7.5px shift on short pages.
