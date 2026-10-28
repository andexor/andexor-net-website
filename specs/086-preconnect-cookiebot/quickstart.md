# Quickstart: Preconnect to the Cookiebot CDN

1. `bun run build`. It must succeed (the same-DOM check passes).
2. `grep -c 'rel="preconnect" href="https://consentcdn.cookiebot.com"' out/index.html out/privacy-policy.html out/404.html`
   gives 1 for each, and the link appears before `<script id="Cookiebot"`.
3. `bun run test` and `bun run test:e2e` pass (no hydration errors, banner still works).
4. Serve `out/` (`bun run test:e2e` setup or `./build.sh && ./run.sh`), open the home page in a private window: the
   banner appears and can be answered, and the console shows no errors.
5. Run Lighthouse (performance) on the home page: "Preconnect to required origins" no longer lists
   `https://consentcdn.cookiebot.com`, and LCP is lower over several runs.
