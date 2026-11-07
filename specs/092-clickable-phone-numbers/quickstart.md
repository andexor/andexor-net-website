# Quickstart: Verify Clickable Phone Numbers

Run these from the repository root after the content edits and the test are in place.

## Prerequisites

- Bun installed, dependencies installed (`bun install --frozen-lockfile`)
- Port 3000 free (the e2e run serves the built site there)

## 1. Find any plain-text occurrence left in content

```bash
grep -rn "+14043511440" content/ | grep -v "tel:+14043511440"
```

Expected: no output. Every occurrence in `content/` is inside a `tel:` link.

## 2. Build the site

```bash
bun run build
```

Expected: the build finishes and formats `out/` without errors.

## 3. Run the phone link test

```bash
bun run test:e2e -- tests/e2e/phone-links.spec.ts
```

Expected: the test passes on each policy page. If it fails, it names the page and the text outside a link.

## 4. Check the link by hand

Serve the built site and open the Privacy Policy:

```bash
bun server.ts
```

Open `http://localhost:3000/privacy-policy` and check:

- The number in the request paragraph and in the Contact section is underlined on neither rest nor hover.
- Hovering changes the color only.
- Tabbing to the number shows the focus ring.
- Activating it on a phone opens the dialer (not checkable on a desktop; check the link's `href` in the developer
  tools shows `tel:+14043511440`).

Stop the server with `Ctrl+C`; it exits on the first press.

## 5. Full checks

```bash
bun run test
bun run format:check
bun run test:e2e
```

Expected: all pass. The JSON-LD files are not changed, so the structured data check is unaffected.
