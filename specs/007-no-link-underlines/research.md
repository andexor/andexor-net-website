# Research: No Underlines on Any Link

## Decision 1: Colors, not underlines, separate body links from text

- **Decision**: In content pages and cards, body text `--slate-50` and links `--blue-400`.
- **Rationale**: Test run on 2026-09-30: removing the underline alone fails axe
  `link-in-text-block` (WCAG 1.4.1) on the "Page not found" page in all five tested projects
  (chromium, webkit, firefox, iphone, android). Link (`--blue-300`) and body (`--slate-300`) are
  1.42:1 apart; 3:1 is required. Calculated pairs:

  | Pair | Contrast | Needed |
  |------|----------|--------|
  | `--blue-400` link vs `--slate-50` body | 3.40 | 3 |
  | `--blue-400` link vs card `#111F33` | 4.65 | 4.5 |
  | `--blue-400` link vs page `#0A1322` | 5.22 | 4.5 |
  | `--slate-50` body vs card / page | 15.8 / 17.8 | 4.5 |

- **Alternatives considered**:
  - Darker body text: rejected, it drops below 4.5:1 against the dark background (an earlier
    suggestion of mine that the numbers ruled out).
  - Keep underline on body links only: valid and changes nothing visually. The owner chose to change
    colors instead.
  - Bold or another non-color cue: axe's rule accepts underline, border, or 3:1 color difference,
    and bold is not a reliable pass.
  - `--slate-100` body text: 3.25:1, works but leaves less margin; `--slate-50` has one.

## Decision 2: Scope the override to `.an-prose` and `.an-tile`

- **Decision**: Set the two custom properties on those two selectors.
- **Rationale**: These are the only places links sit inside body text. A global change would
  alter the home page and footer, which the owner wants unchanged.
- **Alternatives considered**: Change the `--text-body` and `--text-link` tokens globally
  (rejected: affects the footer, buttons, and home page).

## Decision 3: Hover color `--blue-300`

- **Decision**: `--blue-300` in both scopes.
- **Rationale**: `--text-heading` equals the new body text color, so hover would blend into the
  text. `--blue-300` is the previous link color, already in the palette, and clearly different
  from `--blue-400`.
- **Alternatives considered**: `--gold-400` (brand accent; stronger, but changes the brand feel of
  links, so it is left to the owner).

## Decision 4: Guard the rule with tests

- **Decision**: Extend the existing unit test that scans stylesheets so a link rule with an
  underline fails at rest as well as on hover, and add an e2e spec that reads computed styles.
- **Rationale**: The rule "no underline" is only useful if it stays true. The e2e check also
  covers Markdown pages added later (FR-006).
- **Alternatives considered**: Rely on the axe tests alone (they do not check underlines).

## Decision 5: Amend the constitution as MINOR 1.3.0

- **Decision**: Principle VI drops "Underlines at rest on inline body links are allowed" and says
  no link is underlined at rest, on hover, or on focus.
- **Rationale**: The rule is materially expanded (semantic versioning in the Governance section).
- **Alternatives considered**: PATCH 1.2.3 (understates a real rule change).

## Unknowns

None remaining.
