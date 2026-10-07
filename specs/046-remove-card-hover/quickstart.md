# Quickstart: Remove Card Hover

1. Run `bun run test:e2e -- card-no-hover`. Before the CSS change it fails (the card lifts); after, it passes.
2. Run `bun run build` and `bun run test:e2e`, then `bun run test` for the unit tests. All pass.
3. Open `/web-development` and `/about-us`, move the pointer over cards: nothing moves, no shadow or border change.
4. Hover a link inside a card: it still turns lighter blue.
5. Check `grep -n "an-tile:hover" src/styles/cards.css` finds nothing.
