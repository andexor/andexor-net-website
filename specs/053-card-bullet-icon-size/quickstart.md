# Quickstart: Card Bullet Icon Size

1. Run `bun run test:e2e -- card-bullet-check-icon`. After updating the test and before the change it fails; after the
   change it passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`. Each bullet's icon is 24 by 24 and centered against its text; the bullet text is the same size as the
   description above it. A bullet that wraps keeps its icon centered against both lines.
4. Resize to 360, 768, and 1280 pixels: no horizontal scrolling, no overlap, no text cut off.
5. `grep -n "font-size" src/styles/marketing.css` shows `.an-services__bullet` and `.an-services__card-body` both at
   `14px`.
