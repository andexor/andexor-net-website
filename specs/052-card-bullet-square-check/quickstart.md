# Quickstart: Card Bullet Square Check

1. Run `bun run test:e2e -- card-bullet-check-icon`. After updating the test and before the change it fails; after the
   change it passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`. Every bullet in the eight cards starts with a square-check, 15 by 15 pixels, in the lighter gold
   (`--gold-300`), only the check mark visible (the square layer is clear), and the card shows through behind it. Bullet text, wrapping, and card heights look the same as before.
4. Resize to 360, 768, and 1280 pixels: no horizontal scrolling, no overlap.
5. `grep -rn "fa-check\|faCheck" src` finds nothing.
