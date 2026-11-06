# Quickstart: Validate the Home Page Organization Data

Run these from the repository root. Port 3000 must be free for the browser check.

## 1. Run the unit tests

```bash
bun run test
```

Expected: the formatter test and the built-site test pass. The built-site test reads `out/`, so run step 2 first if `out/` is missing.

## 2. Build the site

```bash
bun run build
```

Expected: the build succeeds. The output includes the formatter summary line. The build fails only if the formatter's DOM check fails.

## 3. Inspect the built head

```bash
grep -o '<head>.*' out/index.html | head -c 600
```

Expected order: the preconnect link, the Cookiebot script, the `application/ld+json` script, then the whitespace script. The JSON-LD line starts with `<script type="application/ld+json">` and contains `"@type":"Organization"`.

```bash
grep -c 'application/ld+json' out/index.html out/about-us.html
```

Expected: `1` for `out/index.html`, `0` for the other page.

## 4. Check the block parses

```bash
bun -e 'const html = await Bun.file("out/index.html").text(); const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); const org = (await import("./src/lib/schema/organization.json")).default; console.log(JSON.stringify(JSON.parse(m[1])) === JSON.stringify(org) ? "match" : "differs")'
```

Expected: `match`. Also paste the block into a schema.org structured data validator. Expected: no errors.

## 5. Check the page in a browser

```bash
bun server.ts
```

`server.ts` serves `out/` on port 3000 (production mode, as in Docker).

Open `http://localhost:3000` in a browser with no saved cookie choice, then with a saved choice.

- The page renders with the hero, services, CTA band, and footer.
- The browser console shows no hydration error (React error #418 or similar).
- The Cookiebot banner appears for a first-time visitor.
- No text from the JSON-LD block is visible.

Stop the server with `^C`; it must exit at once. Make sure port 3000 is free afterward.

## Done

All five steps pass, and the unit tests cover the home-page-only and placement rules.
