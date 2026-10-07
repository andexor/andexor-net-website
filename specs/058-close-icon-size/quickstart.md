# Quickstart: Close Icon Size

1. Run `bun run test:e2e -- contact-close-icon`. After updating the test and before the change it fails; after the change it
   passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/` and click Contact Us. The Close button at the top right of the header is the same 38 pixel glossy black square,
   and its white X mark is larger and centered.
4. Send the form with valid details: the Request received screen shows the same larger X on the same button.
5. Hover, press, and Tab to Close: the same looks as before, with the gold focus ring, and the X is not clipped. Click Close or
   press Escape: the popup closes.
6. Resize to 360, 768, and 1280 pixels: the header keeps its height, nothing overlaps or scrolls sideways.
