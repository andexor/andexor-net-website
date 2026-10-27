# Research: Cookiebot

## 1. Where the element is added

- **Decision**: In `scripts/format-html.ts`, step 6, next to the whitespace script, so the result is
  `<head><script id="Cookiebot" ...></script><script>whitespace...</script>...`.
- **Rationale**: Built pages start `<head>` with the data-script preload link (added by `combine-scripts.ts`), the
  whitespace script, then Next's charset and viewport tags, so the layout's children can never be first. Step 6 already
  inserts "first in head" and is the last step to do so, which makes it the one place where "first" stays true.
- **Alternatives considered**: `layout.tsx` `<script>` (lands after the meta tags, and React may hoist or reorder it);
  `next/script` with `beforeInteractive` (Next places it after its own tags, and the site otherwise uses no
  `next/script`); a Cloudflare Worker rewrite (the site has no Worker code and runs the same from Docker).

## 2. Hydration

- **Decision**: Rely on React 19 tolerating extra elements in `<head>` that it did not render.
- **Rationale**: The whitespace script is already such an element and hydrates without error (spec 038 tests). The
  readable-output hydration test runs on four page types and will catch a regression.
- **Alternatives considered**: render it in React too (would duplicate it; FR "not twice").

## 3. The DOM gate

- **Decision**: Remove `COOKIEBOT_SCRIPT` along with `WHITESPACE_SCRIPT` before comparing the original and formatted
  page (`format-html.ts` line 237), since the original has no such element.
- **Rationale**: The gate proves formatting did not change the page; the added element is not formatting.

## 4. Attributes

- **Decision**: Use the element as given, `type="text/javascript"` included, no `async`/`defer`, but without `data-blockingmode`.
- **Rationale**: The owner supplied the element with `data-blockingmode="auto"`. The attribute was removed after launch (Cookiebot then uses its default, manual mode) because
  automatic mode delayed the page's data script and stopped hydration (spec.md, Changes after launch).
  Reversed by spec 082: automatic mode is on again, with the data scripts inline.

## 5. Which pages

- **Decision**: All of them, from the one formatter loop over `out/*.html`, including `404.html`.
- **Rationale**: FR-001 and FR-003.
