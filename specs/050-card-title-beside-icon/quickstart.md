# Quickstart: Card Title Beside Icon

1. Run `bun run test:e2e -- card-title-beside-icon`. Before the change the test fails; after, it passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`. In each of the eight cards the title is to the right of the icon with a gap, centered against it, and
   left-aligned. "Web Hosting" takes one line; "Process Re-engineering" may take two. The description and bullets follow
   below the row.
4. Resize to 360, 768, and 1280 pixels: no horizontal scrolling, no overlap, no title cut off.
5. Tab through the cards: focus ring and hover look as before, and no link is underlined.
