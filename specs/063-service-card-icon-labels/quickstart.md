# Quickstart: Service Card Icon Labels

1. `bun run build && bun run test:e2e -- tests/e2e/service-card-icon-labels.spec.ts
   tests/e2e/card-title-beside-icon.spec.ts tests/e2e/card-bullet-check-icon.spec.ts tests/e2e/homepage-content.spec.ts`:
   each title icon carries its label as an `aria-label`, is `role="img"` and not hidden, the bullet icons stay hidden,
   and the layout specs still pass.
2. `bun run test:e2e` (full): the accessibility specs report no new violations.
3. `bun run test`: the unit tests pass, unchanged.
4. Open `/` and read each card's icon in the inspector's accessibility panel: one image with the label from the spec's
   table, and nothing looks different on screen.
5. `bun run lint` and `bun run format:check` are clean.
