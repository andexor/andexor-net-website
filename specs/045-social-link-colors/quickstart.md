# Quickstart: Social Link Colors

1. `bun run build`
2. `./build.sh` then `./run.sh`, open http://localhost:3000, and scroll to the footer.
3. Look at the three social icons: soft blue at rest; lighter blue when the pointer is over one; deeper blue while the
   mouse button is held down on one (it also moves 2px right and down, from spec 043). No underline in any state.
4. `bunx playwright test tests/e2e/social-link-colors.spec.ts tests/e2e/link-style.spec.ts tests/e2e/homepage-a11y.spec.ts --project=chromium` passes.
5. `bun run test`, `bun run format:check`, and the full Chromium e2e run pass.
