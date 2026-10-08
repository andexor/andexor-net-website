# Quickstart: Contact Legal Links In New Tab

1. `bun run build && bun run test:e2e -- tests/e2e/contact-legal-new-tab.spec.ts tests/e2e/contact-popup-links.spec.ts
   tests/e2e/contact-popup-a11y.spec.ts tests/e2e/keyboard-navigation.spec.ts tests/e2e/contact-notice-text.spec.ts
   tests/e2e/footer-links.spec.ts`: the popup links open a new tab with the right page, the popup stays open and filled
   in, the names are "Privacy, opens in new tab" and "Terms, opens in new tab", the icons are hidden and fit the line,
   and the footer links are unchanged.
2. `bun run test`: the unit tests pass, unchanged.
3. Open `/`, click Contact Us, type in a field, and click Privacy then Terms: each opens in a new tab and the popup keeps
   its text. Read the two links in the inspector's accessibility panel: one name each, and the icons are not exposed.
4. Look at the note at 360px and 1440px wide: the icons sit on the text's line, the line is no taller, and nothing
   wraps apart from its icon.
5. Check the footer's Privacy and Terms: same tab, no icon.
6. `bun run lint` and `bun run format:check` are clean. Port 3000 must be free for the e2e run, and must be freed again
   if the run is interrupted.
