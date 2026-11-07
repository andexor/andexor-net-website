# Contract: Head of the Built Home Page

The built home page (`out/index.html`) is read by search engines, social previews, and the consent banner. This contract fixes the order of the scripts and links in its head.

## Order

The head starts with these items, in this order, before any other head content:

1. The Cookiebot preconnect link (spec 086)
2. The Cookiebot consent script (spec 076). It is the first script in the head.
3. The Organization JSON-LD block (this feature)
4. The Person JSON-LD block (spec 091)
5. The whitespace script, the focus script, and the dialog script (specs 038, 082, and related)

Items 1 to 5 are added by `scripts/format-html.ts`. The page's own head content follows, as Next.js wrote it.

## JSON-LD blocks

- Element: `<script type="application/ld+json">`, one for each block, in the order above.
- No `src`, no `async`, no `defer`. They are data, not code.
- Organization block: the record in `src/lib/schema/organization.json`, on one line.
- Person block (spec 091): the record in `src/lib/schema/ed.json`, on one line.
- Parsing each with `JSON.parse` returns an object equal to its record.

## Other pages

No built page other than `out/index.html` contains an `application/ld+json` element added by this feature or by spec 091.

## Stability

Changing the order above, or the type of the block, is a change to this contract and to the spec it belongs to.
