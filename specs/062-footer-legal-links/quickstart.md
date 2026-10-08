# Quickstart: Privacy and Terms Links

1. `bun run build && bun run test:e2e -- tests/e2e/footer-links.spec.ts tests/e2e/contact-popup-links.spec.ts
   tests/e2e/contact-popup-a11y.spec.ts tests/e2e/keyboard-navigation.spec.ts`: footer and popup links reach
   `/privacy` and `/terms`, and the popup's focus order and accessibility checks still pass.
2. `bun run test`: the unit tests pass (including the `#top` and straight-quote checks).
3. Open `/`, click "Privacy" then "Terms" in the footer, then open Contact Us and do the same from the popup. Nothing
   looks different, and no link is underlined.
4. `grep -rn '#privacy\|#terms' src` finds nothing. `bun run lint` and `bun run format:check` are clean.
