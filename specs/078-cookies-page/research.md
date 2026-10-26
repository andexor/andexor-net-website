# Research: Cookies Page

## 1. How the marker becomes the script element

- **Decision**: A remark plugin, placed after `remarkTableCellLineBreaks` in `markdownProcessor()`, finds `html` nodes
  whose trimmed value is exactly `<!-- cookie-declaration -->`. It replaces the first with a node that remark-rehype turns
  into `<script id="CookieDeclaration" src=".../cd.js" type="text/javascript" async>` (`data.hName` and
  `data.hProperties`). Later markers are removed. Every other raw HTML node is still dropped.
- **Rationale**: The pipeline has no `rehype-raw`, so raw HTML cannot reach the output, and FR-003 says it must stay
  that way. Building the element from the tree keeps the script fixed in code: Markdown can only choose where it goes.
  An HTML comment is invisible in any Markdown viewer that does not know the marker, and the other pages already use
  comments for notes.
- **Alternatives considered**:
  - Allowing raw HTML with `rehype-raw`: lets any page carry any script, against FR-003.
  - A text placeholder such as `{{cookie-declaration}}`: shows up as text in previews and when the plugin fails.
  - A fenced code block with a language name: more to write, and it reads as code in a viewer.

## 2. Why hydration is safe

- **Decision**: Rely on the existing `data-raw-html=""` + `dangerouslySetInnerHTML` rendering of Markdown content in
  `ContentPage`.
- **Rationale**: Same reasoning as spec 077 research item 1: React does not compare or patch such content, and the
  server HTML holds a real script element, which the browser runs as it parses the page. The spec 077 prototype and
  the real-Cookiebot checks (10 of 10 loads hydrated) used this pattern.
- **Alternatives considered**: a client component that adds the script after mount: more code and a late declaration.

## 3. Missing or repeated marker

- **Decision**: The plugin reports through the build: it warns, naming the page, when a second marker is dropped. A
  missing marker on `cookies.md` is reported by a unit test over the real file's rendered output, not by build code.
- **Rationale**: A missing declaration is the failure to avoid (spec edge case), and a test that renders the real file
  catches it without special-casing a file name in the build.
- **Alternatives considered**: failing the build in the plugin: it cannot know the page is meant to have a marker.

## 4. Layout

- **Decision**: The card layout, as Privacy and Terms use, with one card (`## Cookie Declaration`) holding the marker.
  Check the declaration at 360, 768, and 1280 pixels, and add rules in `src/styles/content.css` only if the check shows a
  problem.
- **Rationale**: The plain layout builds with indentation the build's own formatting test rejects, and every other page uses
  cards. Cookiebot's tables scroll inside themselves, so no rule was needed.

## 5. Footer link

- **Decision**: Add `Cookies` to the COMPANY items and `Cookies: "/cookies"` to `ITEM_HREFS`, after Security.
- **Rationale**: The footer builds every link from these two lists, so no new markup or CSS is needed.

## 6. Removing the footer declaration

- **Decision**: Delete `COOKIE_DECLARATION_SCRIPT` and its container from `Footer.tsx`. Rewrite
  `tests/e2e/cookie-declaration.spec.ts` for `/cookies`, and change the `CLAUDE.md` note.
- **Rationale**: Spec FR-004 and SC-005. The spec 077 files stay as history; spec 078 states what replaced them.
