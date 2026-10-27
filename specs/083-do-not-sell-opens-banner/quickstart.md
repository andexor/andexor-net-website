# Quickstart: Do Not Sell Opens the Cookie Banner

Prerequisites: `bun install`; port 3000 free (Cookiebot only allows ports 3000 and 8787, spec 082).

1. `bun run build`. Open `out/index.html` and find the footer: `<!-- For GDPR -->` directly before the Privacy Settings
   link and `<!-- For CCPA -->` directly before the Do Not Sell link. Repeat for `out/privacy-policy.html` and
   `out/404.html`.
2. Run the built site: `bun server.ts`, open `http://localhost:3000/`, clear cookies for `localhost`, reload. The banner
   shows. Answer it, scroll to the footer, click Do Not Sell or Share My Personal Information. The banner opens again, the
   address stays `/`, and the page does not jump. Press Tab to the link and Enter: same result. Do the same from
   `/privacy-policy`.
3. In the same session check the console: no React error #418 on a first visit to `/` and `/privacy-policy`.
4. `bun run test` and `bun run test:e2e -- footer-links cookie-declaration`. Stop the server with Ctrl+C.

Expected: the links behave identically, the comments are in the built pages, and the visible footer is unchanged.
