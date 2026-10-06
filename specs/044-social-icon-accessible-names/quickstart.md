# Quickstart: Social Icon Accessible Names

1. `bun run build`
2. In the built `out/index.html`, each social `<svg>` has `aria-label` of `LinkedIn`, `X`, or `GitHub`, no
   `aria-hidden="true"`, and no `alt`; each social `<a>` has no `aria-label`.
3. `bunx playwright test tests/e2e/social-icon-names.spec.ts tests/e2e/homepage-content.spec.ts tests/e2e/homepage-a11y.spec.ts tests/e2e/content-page-a11y.spec.ts --project=chromium` passes.
4. `bun run test` and the full e2e run pass; the footer looks the same as before.
5. Optional: read the footer with a screen reader. Each link is announced once, as "LinkedIn, link", "X, link", and
   "GitHub, link".
