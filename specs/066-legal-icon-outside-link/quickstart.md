# Quickstart: Legal Icon Outside Link

1. `bun run build && bun run test:e2e -- tests/e2e/contact-legal-new-tab.spec.ts tests/e2e/contact-popup-links.spec.ts
   tests/e2e/contact-popup-a11y.spec.ts tests/e2e/keyboard-navigation.spec.ts tests/e2e/contact-notice-text.spec.ts
   tests/e2e/footer-links.spec.ts --project=chromium`: each link holds only its text, each icon is the next element after
   its link, the icons are hidden and fit the line, and the links still open new tabs with their names.
2. `bun run test`: the unit tests pass, unchanged.
3. Open `/`, click Contact Us, and look at the note: "Privacy [icon] | Terms [icon]", the icons white, small, on the text's
   line, and clicking an icon does nothing. Tab through: the focus ring wraps only the link text.
4. `bun run lint` and `bun run format:check` are clean. Port 3000 must be free for the e2e run, and must be freed again
   if the run is interrupted.
