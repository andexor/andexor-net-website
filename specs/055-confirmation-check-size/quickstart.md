# Quickstart: Confirmation Check Size

1. Run `bun run test:e2e -- contact-confirmation-icon`. After updating the test and before the change it fails; after the
   change it passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`, click Contact Us, fill in the form with valid details, and send. On the Request received screen the round
   light green badge holds a larger dark green check mark, centered, with nothing else drawn and clear space between the
   mark and the circle's edge. The heading, text, and OK button are where they were.
4. Press Tab: focus moves only between OK and Close. Press Escape or OK: the popup closes.
5. Resize to 360, 768, and 1280 pixels: nothing overlaps or scrolls sideways.
6. Look at the service cards: the bullet icons are still 24 pixels.
