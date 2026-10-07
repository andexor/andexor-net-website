# Quickstart: Remove Card Badges

1. Run `bun run test:e2e -- homepage-content`. Before the change the new no-badge test fails; after, it passes.
2. Run `bun run build`, `bun run test`, `bun run test:e2e`, and `bun run format:check`. All pass.
3. Open `/`. None of the eight cards shows a tag in its top right corner. The icon is at the top left. Card heights and
   the positions of titles and bullets look the same as before.
4. Resize to 360, 768, and 1280 pixels: no horizontal scrolling, no overlap.
5. In the browser tools, search the page for `an-badge`: no matches.
6. `grep -rn "tag\|badgeTone" src/components/marketing/` shows no use of the removed fields.
