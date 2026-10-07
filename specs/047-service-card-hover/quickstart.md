# Quickstart: Service Card Hover

1. Run `bun run test:e2e -- service-card-hover`. Before the CSS change it fails (the card lifts and the border changes);
   after, it passes.
2. Run `bun run build`, `bun run test:e2e`, and `bun run test`. All pass.
3. Open `/` and move the pointer over a service card: a thin gold ring appears, the card does not move, and the border
   color does not change. Hold the mouse button down: it moves a little right and down. Move away: it returns. Click
   it: it still opens its page.
4. Check `grep -n -A5 "an-card--hover:hover" src/styles/components.css` shows no `border-color` and no `transform`.
