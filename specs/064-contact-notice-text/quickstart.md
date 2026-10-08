# Quickstart: Contact Notice Text

1. `bun run build && bun run test:e2e -- tests/e2e/contact-notice-text.spec.ts`: the note reads "We never share your
   personal information. Privacy | Terms" with no leading space, and "No obligation" is nowhere on the page.
2. `bun run test:e2e -- contact`: the existing contact popup and a11y specs still pass.
3. `bun run test`: the unit tests pass, unchanged.
4. Open `/`, click Contact Us, and read the note under the form: it starts with "We never share", looks the same as
   before, and the Privacy and Terms links work.
5. `grep -rn "No obligation" src tests design content` finds nothing. `bun run lint` and `bun run format:check` are clean.
