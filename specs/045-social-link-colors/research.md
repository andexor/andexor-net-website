# Research: Social Link Colors

## Decision 1: Change the existing rules, add one declaration

- **Decision**: in `.an-footer__social-link` set `color: var(--blue-300)`; in `:hover` set `color: var(--blue-200)`; in
  the existing `:active` rule add `color: var(--blue-400)`.
- **Rationale**: spec 043 already has all three rules, with `color: var(--blue-200)` at rest and `var(--blue-100)` on
  hover. `:active` has no color today. Editing them is the smallest change, and no new rule or token is needed.
- **Alternatives considered**: a new set of rules for colors only (rejected: duplicates selectors); CSS variables for the
  three colors (rejected: nothing else uses them).

## Decision 2: Order and specificity

- **Finding**: `:hover` and `:active` have the same specificity and `:active` is written after `:hover`, so a pressed
  link with the pointer over it shows the press color, as the spec requires. Keyboard focus (`:focus-visible`) sets no
  color, so focus shows the resting color.
- **Decision**: keep that order. The test presses a hovered link and checks the press color.
- **Alternatives considered**: raise specificity (rejected: not needed).

## Decision 3: Contrast

- **Finding**: the icon is a filled square with the logo cut out, so what matters is the glyph color against the
  button's gradient behind the cut-out. Contrast ratios against the gradient's stops (`#3b3b3b` top, `#121212` middle,
  `#000000` bottom): blue-300 5.3 / 8.9 / 10.0; blue-200 7.7 / 12.9 / 14.4; blue-400 3.1 / 5.3 / 5.9.
- **Decision**: all are at or above 3:1 (the WCAG 2.1 minimum for graphics) in every state, so the colors are accepted
  as the owner specified. Blue-400 against the lightest stop (3.1) is the tightest, and it applies only while pressed.
- **Alternatives considered**: none; the colors are the owner's choice.

## Decision 4: Tests

- **Decision**: add `social-link-colors.spec.ts`. It reads the computed `color` of each social link at rest, with
  `hover()`, and with the mouse held down on it (`mouse.down()`), then releases. It resolves the expected colors from the
  tokens on the page (`getComputedStyle(document.documentElement).getPropertyValue("--blue-300")`) so the test names the
  tokens and not literals. Color changes use a 0.15s transition, so the test waits for the value with
  `expect.poll` or `toHaveCSS`.
- **Rationale**: tests read real rendered values and never count links or icons.
