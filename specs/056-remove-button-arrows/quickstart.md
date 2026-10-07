# Quickstart: Remove Button Arrows

1. Run `bun run test:e2e -- button-no-arrow ok-button`. Before the change the new test and the updated OK test fail; after,
   they pass.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`. The Contact Us button in the call-to-action band shows only its label, centered. Click it: the Send button
   shows only its label, centered, and still matches Contact Us in fill, ring, font, and height.
4. Send the form: the OK button on the confirmation screen still looks like Send.
5. Press Tab and Enter on both buttons: they work as before.
6. Resize to 360, 768, and 1280 pixels: nothing overlaps or is cut off.
7. `grep -rn "ArrowRight" src` finds nothing.
