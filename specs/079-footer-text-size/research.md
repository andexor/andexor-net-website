# Research: Footer Text Size

## Decision: 16px on both rules, no shared variable

**Rationale**: `.an-footer__col-link` is already `font-size: 16px`. The request is to match it, and two literal values
in neighboring rules are the simplest change.

**Alternatives considered**: a CSS variable for the footer text size (more indirection than two values justify); one
combined selector for the two lines (they have different margins and colors, so the rules stay separate).

## Decision: check the footer at 360px by hand and with the existing e2e checks

**Rationale**: the footer is one column below 720px. The link text is the longest line in the footer's left cell, and at
16px it is wider than at 13px, so it could wrap or overflow at phone width. The existing tests catch sideways scroll,
and wrapping is acceptable as long as nothing is cut off.

**Alternatives considered**: a new pixel-size test (rejected by the project's testing rules).
