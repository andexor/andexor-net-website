# Quickstart: Cookie Declaration

1. `bun run build`
2. Check the built pages: `grep -L 'id="CookieDeclaration"' out/index.html out/web-development.html` prints nothing, and
   the element is after the copyright paragraph and before the social row
   ([contracts/footer-element.md](contracts/footer-element.md)).
3. `bun run test:e2e -- cookie-declaration readable-output cookiebot` (port 3000 must be free).
4. Real-Cookiebot check, hydration and layout: serve `out/` with `bun run server.ts`, then load `https://andexor.net/`
   in a Playwright browser whose context routes `https://andexor.net/**` to `http://localhost:3000`, ten times in fresh
   contexts. Each load shows the `h1`, logs no page errors, and shows the declaration inside the footer's first column.
   Repeat at 360, 768, and 1280 pixel widths and confirm the page does not scroll sideways.
5. After deploy, once on the live site: delete the consent cookie, reload, close the banner, and confirm the page stays up
   and the footer shows the declaration.
