# Quickstart: Card Bullet Check Icon

1. Run `bun run test:e2e -- card-bullet-check-icon`. Before the change the test fails; after, it passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`. Every bullet in the eight cards starts with the FontAwesome check, 15 by 15 pixels, gold, with a lighter
   gold second layer. Bullet text, wrapping, and card heights look the same as before.
4. Resize to 360, 768, and 1280 pixels: no horizontal scrolling, no overlap.
5. `grep -n lucide src/components/marketing/Services.tsx` finds nothing.
