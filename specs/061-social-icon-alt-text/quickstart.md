# Quickstart: Social Icon Descriptions

1. `bun run build && bun run test:e2e -- tests/e2e/social-icon-names.spec.ts tests/e2e/homepage-content.spec.ts
   tests/e2e/social-icon-size.spec.ts tests/e2e/social-link-colors.spec.ts`: the footer links are found by the full
   descriptions, the svg carries the `aria-label`, and the size and color specs still pass.
2. `bun run test`: the unit tests pass, unchanged.
3. Open `/` and `/web-development` and read the three footer icons in the inspector's accessibility panel. Each has one
   name, as in the spec's table, and nothing looks different on screen.
4. `bun run lint` and `bun run format:check` are clean.
