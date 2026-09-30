# Research: Not-Found Page Style

## Decision 1: Reuse `ContentPage`'s hero with a hero-only layout

- **Decision**: `not-found.tsx` passes a `CardsLayout` with no cards to `ContentPage`.
- **Rationale**: The Web Development hero already gives the requested look. Reuse keeps one
  implementation of the hero, so future hero changes apply to both.
- **Alternatives considered**: Copy the hero markup into `not-found.tsx` (two copies to keep in
  step); write `content/404.md` (would publish a `/404` route and conflicts with Principle VIII's
  intent for real pages); a new hero component (more code for the same result).

## Decision 2: Two optional switches on the existing layout

- **Decision**: `grid?: boolean` on `CardsLayout`, and render the cards block only when
  `cardsHtml` is non-empty.
- **Rationale**: The spec removes the grid and the cards for this one page; the defaults keep every
  other page exactly as it is.
- **Alternatives considered**: A frontmatter `grid: false` option (YAGNI: no Markdown page needs
  it yet; add it when one does); hiding the grid with CSS only (leaves an empty decorative
  element in the page).

## Decision 3: Compact bottom edge when there are no cards

- **Decision**: `.an-cardhero--solo` reduces the hero's bottom padding.
- **Rationale**: The existing padding is there so cards can pull up over the band. With no cards it
  would leave a large empty gap above the footer.
- **Alternatives considered**: Leave the padding (the gap looks unfinished, contradicting the
  spec's edge case).

## Decision 4: Accessible link colors in the hero

- **Decision**: In the solo hero, intro text `--slate-50` and links `--blue-400`, hover
  `--blue-300`.
- **Rationale**: Links have no underline (constitution VI), so they must differ from the text by
  3:1. The hero's usual `--blue-200` text against `--blue-400` is only 2.45:1. `--slate-50` text
  gives 3.40:1, and `--blue-400` against the hero band is about 4.5:1 or better (5.2:1 against the
  page). Same pair as spec 007.
- **Alternatives considered**: White text (3.56:1, also passes but uses a new color); gold links
  (brand feel, but 1.2:1 against blue-200 text and not decided by the owner); putting the
  explanation in a `.an-prose` block (conflicts with the hero layout).

## Decision 5: Keep the Web Development page unchanged

- **Decision**: Every change is behind the new options or the `--solo` class.
- **Rationale**: FR-012 and SC-005.
- **Alternatives considered**: None; a regression test (grid and cards still present on
  `/web-development`) guards it.

## Unknowns

None remaining.
