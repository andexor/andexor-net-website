# Quickstart: Link Color

## Prerequisites

Port 3000 free. `bun install` done.

## Check the build

```sh
bun run format:check
bun run test
bun run test:e2e -- tests/e2e/homepage-a11y.spec.ts tests/e2e/content-page-a11y.spec.ts tests/e2e/contact-popup-a11y.spec.ts --project=chromium
```

Expected: all pass.

## Extra axe check on the built pages

Serve `out/` with `bun server.ts` and run axe (WCAG 2.1 A and AA) in a throwaway Playwright script, in a new browser
context, on `/`, `/privacy`, `/terms`, `/security`, `/cookies`, `/web-development`, `/about-us`, and `/nope`. Expected: no
violations.

## Check the rules in the style sheets

```sh
grep -n "blue-400" src/styles/*.css
grep -n "text-decoration: underline" src/styles/*.css
```

Expected: no `--blue-400` remains as a link color or `--text-link` override, and no hover underline.

## Check by hand

Open a content page, the home page footer, the not-found page, and the Contact Us popup. Links share one color. Links in
body text are heavier than the text around them. Hover turns every link the same lighter blue. No underline anywhere.
