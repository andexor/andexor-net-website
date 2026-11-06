# Research: Organization Structured Data on the Home Page

## 1. Where the block goes in the head

**Decision**: Add the block in the post-build formatter (`scripts/format-html.ts`, the step that already writes the Cookiebot preconnect, Cookiebot script, and whitespace scripts into `<head>`), and only for `out/index.html`.

**Rationale**: The request is for the head, only on the home page. A `<script>` rendered from `src/app/page.tsx` (a client component) or from `src/app/layout.tsx` lands in the body or renders on every page. React 19 hoists `<title>`, `<meta>`, and `<link>` into the head, but not an inline `<script>`. The static export has no server-side route per page, so a layout cannot tell the home page apart without client code. The formatter already sees each built file by name.

**Alternatives considered**:
- *Render `<JsonLD />` in `page.tsx`*: simplest, but the block lands in the body, which misses the request. Rejected.
- *Next.js `metadata` / `other` field*: it writes meta tags, not a `<script>`. Rejected.
- *A client component that appends the script to `document.head`*: runs after hydration, so crawlers that do not run JavaScript miss it, and it adds client code. Rejected.

## 2. Keep the `JsonLD` component

**Decision**: Render it at build time with `renderToStaticMarkup(createElement(JsonLD, { data: organization }))` from `react-dom/server`.

**Rationale**: The owner named this component. Rendering it keeps one place that writes the tag and its escaping of `<`. Verified under Bun on this repository: the output is one line, 1198 characters, starts with `<script type="application/ld+json">`, and has no newline. The data has no `<`, so the escape is not exercised by the data; the component keeps it for future data.

**Alternatives considered**:
- *Build the string by hand in the formatter*: duplicates the escaping. Rejected.
- *Delete `JsonLD.tsx`*: the owner asked for the component. Rejected.

## 3. Insertion order in the head

**Decision**: Insert the block after the Cookiebot script and before the whitespace script, as the formatter already orders its head scripts.

**Rationale**: The request says "just after the Cookiebot script" for the first version, and the constitution requires the consent script to be first. Placing the block after Cookiebot satisfies both. A `type="application/ld+json"` block is not executed, so it does not interact with Cookiebot's automatic blocking. The later whitespace script and the focus and dialog scripts are unaffected.

**Alternatives considered**: After all injected scripts, just before the page's own head content. Works, but moves it away from the Cookiebot script the owner named. Rejected.

## 4. Hydration

**Decision**: No change to React. The block is present in the HTML before React runs, the same way the Cookiebot preconnect and scripts already are.

**Rationale**: Those head additions already coexist with React's hydration of the document, including the whitespace script that exists specifically to avoid hydration errors (spec 038). A static `application/ld+json` block with no visible text is no different in kind. The check is still made: quickstart step 5 loads the page in a browser and reads the console.

**Risk**: The formatter's DOM check (`assertSameDom`) compares the page before and after formatting. The block is added after formatting and must be stripped before comparison, as the Cookiebot scripts are. Without that, the build fails.

## 5. Tests

**Decision**: Test behavior only, per constitution Principle V.
- Built home page: one JSON-LD block in the head, directly after the Cookiebot script; its parsed content deep-equals `organization.json`.
- Other built pages: no JSON-LD block.
- Formatter unit test: the block is added to a page when asked, and `formatHtml` still passes the DOM check.

**Rationale**: These rules are the feature's requirements (spec FR-001 to FR-003). No test checks the wording of the values, since the constitution forbids copy tests.

## 6. Unresolved items

None. The consent banner's behavior with a JSON-LD block is checked in quickstart step 5, not assumed.
