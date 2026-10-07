# Quickstart: Logo Alt Text

1. `bun run test`: the Logo and popup unit tests expect the alt text "Andexor Network logo", the header link's name is
   "Andexor Network logo Andexor Network", and the guard test passes.
2. `bun run build && bun run test:e2e -- tests/e2e/contact-popup-logo.spec.ts tests/e2e/content-page-a11y.spec.ts
   tests/e2e/brand-wordmark.spec.ts`: the popup logo has the new alt on both screens, and the a11y and brand specs
   still pass.
3. Open `/`, `/web-development`, and `/nope` and the Contact Us popup, and check each logo image's alt text in the
   inspector. Nothing looks different on screen.
4. `bun run lint` and `bun run format:check` are clean.
