# Quickstart: Cookiebot

1. `bun run build`
2. Check every built page starts its head with the element in
   [contracts/head-element.md](contracts/head-element.md):
   `grep -L '<head><script id="Cookiebot"' out/*.html` prints nothing.
3. `bun run test:e2e -- cookiebot readable-output` (port 3000 must be free): the new test passes and no page logs
   hydration errors.
4. Optional, by eye: `docker`-based `./run.sh`, open http://localhost:3000 in a private window; the banner shows. Open a
   second page after choosing; it does not show again.
