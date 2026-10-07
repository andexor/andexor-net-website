# Quickstart: Technical and Business Card Bands

1. Run `bun run test:e2e -- homepage-content` and `bun run test -- services`. Before the change the new order and link
   checks fail; after, they pass.
2. Run `bun run build`, `bun run test:e2e`, `bun run test`, and `bun run format:check`. All pass.
3. Open `/`. Below the hero there are two sections: technical (Web Development, Web Hosting, Technical SEO, Agentic
   Systems), then business (Cost Reduction, Lead Generation, Growth Marketing, Process Re-engineering). Each has its own
   heading and sub-heading in the old style.
4. Click each card: it opens the page the footer entry of the same name opens.
5. Resize to 360, 768, and 1280 pixels: no horizontal scrolling, and each band wraps within itself.
6. Check hover (gold ring), press (2px move), and Tab focus on a new card: same as an old one.
7. `grep -n "underline" src/styles/*.css` shows no hover underline.
