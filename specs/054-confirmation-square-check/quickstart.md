# Quickstart: Confirmation Square Check

1. Run `bun run test:e2e -- contact-confirmation-icon`. Before the change it fails; after, it passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`, click Contact Us, fill in the form with valid details, and send. On the Request received screen the round
   light green badge holds a dark green check mark, 28 pixels, centered, with no square drawn around it.
4. Press Tab: focus moves only between OK and Close. Press Escape or OK: the popup closes, and reopening shows the empty
   form.
5. Resize to 360, 768, and 1280 pixels: nothing overlaps and the popup does not scroll sideways.
6. Look at the service cards: the bullet icons are still 24 pixels.
