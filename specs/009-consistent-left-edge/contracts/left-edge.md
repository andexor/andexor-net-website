# Contract: Left Edge

## Rule

- The page root reserves scrollbar space: `html { scrollbar-gutter: stable; }` in
  `src/styles/globals.css`.
- No page or component sets its own horizontal offset to compensate for scrolling or page length.
- `design/DESIGN.md` section 4 states the rule.

## Checked by tests

| Check | Where |
|-------|-------|
| With visible scrollbars, the header/hero left edge is identical on `/`, `/web-development`, and `/nope` at 320, 768, 1365, 1440, and 1600px | `tests/e2e/left-edge.spec.ts` (own Chromium; skipped in other projects) |
| The test browser really shows scrollbars (`innerWidth - clientWidth` is greater than 0 on a scrolling page), so the check cannot pass by accident | same file |
| With the default hidden scrollbars, the left edges are also identical (FR-006) | same file, in the normal projects |

## Not covered

- Browsers without `scrollbar-gutter` (Safari before 18.2) keep a 7.5px shift on short pages.
