# Research: Single-Line Logo Wordmark

## Decision 1: Two size settings, not one

- **Decision**: `--logo-mark-size` (38px) and `--logo-wordmark-size` (26px), each its own custom
  property on the lockup.
- **Rationale**: The owner clarified that "same size as the logo" meant the visible pixels, not the
  image box, which has transparent padding. Matching boxes made the text look too big. Two
  settings let each be tuned by eye.
- **Alternatives considered**: One shared size (first attempt; looked wrong); measuring the SVG's
  visible bounds in code (fragile, no benefit over a fixed value).

## Decision 2: Fit on narrow screens and in the footer

- **Decision**: Fixed 38px and 26px, no phone shrink, no footer grid change. A measurement test
  confirms the lockup is one line, has no horizontal scroll at 320px, and does not overflow its
  column at any tested width.
- **Rationale**: At 26px the wordmark is about 207px wide, plus the 38px mark and 11px gap, about
  256px, which fits at 320px. The footer's first column grows to fit it.
- **Alternatives considered**: `white-space: nowrap` alone (overflows instead of fitting);
  a smaller fixed size in the footer (breaks "same everywhere").

## Decision 3: Home page hero

- **Decision**: Hero uses the shared component through `size="hero"`, keeping the design
  README's sizes.
- **Rationale**: The design system specifies this brand row and its sizes.
- **Alternatives considered**: Leave the hero's hand-written copy (fails FR-004); equal-size text in
  the hero (visually too large, contradicts the design README).

## Decision 4: Decorative mark

- **Decision**: `alt=""` on the mark.
- **Rationale**: The adjacent visible text already names the brand. With both, screen readers say
  "Andexor Network Andexor Network" (FR-009).
- **Alternatives considered**: `aria-hidden` on the text (hides the name from the link's accessible
  name when the mark is the only other content).

## Decision 5: Remove `compact`

- **Decision**: Delete the `compact` prop. Nothing passes it.
- **Rationale**: YAGNI (constitution I).

## Unknowns

None remaining.

## Decision 6: Page titles drop ", Inc."

- **Decision**: Titles read "Andexor Network" and "<Page> | Andexor Network". ", Inc." stays only in
  the footer copyright line.
- **Rationale**: Owner review of Apple, Google, and Microsoft: none uses ", Inc." in titles or the
  page body.
- **Alternatives considered**: Keep the legal name in titles (rejected by the owner).
