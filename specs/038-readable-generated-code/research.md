# Research: Readable Generated Code

All findings come from prototypes built in a scratch copy of the repo (Next 15.5.26, Prettier 3.9.9, Bun). Nothing in the
real tree was changed.

## 1. Which tool pretty-prints?

- **Decision**: Prettier, already a devDependency (`^3.4.0`, installed 3.9.9) with a `.prettierrc.json`. Change that
  file to `tabWidth: 4`, `printWidth: 120`, and keep `useTabs: false`. No new dependency.
- **Rationale**: One formatter for HTML, CSS, JS, TS, and TSX. Principle I (no new dependency without need).
- **Alternatives**: Biome (new dependency, weaker HTML support), js-beautify (new dependency, no TS), hand-rolled
  formatter for all languages (maintenance cost).
- **Gotchas found**:
  - There is no `node` on the machine; run Prettier with `bun node_modules/prettier/bin/prettier.cjs` or
    `bunx --bun prettier`.
  - Prettier silently skips anything matched by `.gitignore`, and `out/` is ignored. Formatting the build output needs
    `--ignore-path` pointing at an empty file, or the run does nothing and still exits 0. The pass must check that
    files actually changed.

## 2. Can the site's own script code be separate and unminified?

- **Decision**: Yes, with a small `webpack` hook in `next.config.ts`:
  1. A `splitChunks` cache group (`name: "site"`, `test: /[\\/]src[\\/]/`, `chunks: "all"`, `enforce: true`) pulls every
     module under `src/` into one file, `static/chunks/site-<hash>.js`.
  2. A tiny inline webpack plugin runs at `processAssets` stage `-1000` and sets `info.minimized = true` on assets named
     `static/chunks/site-*`. Next's own minifier skips assets already marked minimized, so only that file is left
     readable. React, Next.js, and lucide-react stay minified in their own chunks.
- **Verified**: the prototype build produced `site-*.js` (44 KB unminified, 82 lines containing `an-` class names, none
  of the other chunks contain site code), and the site hydrated with no console errors.
- **Rationale**: Meets the clarified requirement (separate, readable, unminified) with about 25 lines of config and no
  new dependency. It does not touch Next internals beyond a documented asset flag.
- **Alternatives**: turning minification off for everything (adds about 700 KB of vendor JS, hurts Core Web Vitals);
  minifying vendor files in a post-build step (needs a minifier and gains nothing); Turbopack (production build still
  uses webpack in this Next version, and Turbopack has no equivalent hook).
- **Note**: the entry stubs (`app/page-*.js`, `app/layout-*.js`) are webpack glue and lucide icon modules, not site code.
  They stay minified third-party/generated code. The unminified `site` chunk is slightly larger than the minified
  equivalent; the plan accepts this (see Assumptions in the spec).

## 3. Is pretty-printing the built CSS and JS safe?

- **Decision**: Run Prettier over `out/_next/static/**/*.js` and `out/_next/static/css/*.css` after `next build`.
- **Verified**: all three prototype pages (`/`, `/web-development`, `/nope`) load with a clean console after this pass.
  The built CSS is entirely site CSS (no third-party stylesheet), so the whole file is formatted. Only the `site-*.js`
  chunk is formatted for JS; vendor chunks are left minified (FR-006 allows it, and formatting 700 KB of vendor code
  is wasted work and bytes).
- **Rationale**: CSS and JS whitespace never reaches the DOM.

## 4. Is pretty-printing the built HTML safe?

**Plain Prettier output breaks hydration; Prettier plus a small whitespace-stripping script does not.**

### Why plain Prettier breaks the page

React does not normalize whitespace. To hydrate, it walks the real DOM in step with the tree it rendered, and each
rendered element must meet the matching element next. Reading `canHydrateInstance` in `react-dom-client.development.js`:
when React expects an element and the next node is a whitespace text node, it reports no match. React then logs error
#418 and discards the server HTML. Any line break between two elements becomes a whitespace text node, and re-wrapping
a paragraph changes its text. No React or Next option relaxes this. The content pages only passed in early tests
because their bodies come from `dangerouslySetInnerHTML`, which React does not hydrate.

### Options rejected

- DOM-exact formatting (line breaks only inside tags, Prettier `strict` mode): hydrates, but puts `>` and the next tag at
  awkward line positions. The owner rejected it.
- Leave the HTML unformatted: violates FR-001.
- Remove React from the browser: a separate, larger decision, to be its own spec (see the end of this section).

### Decision: format normally, strip the added whitespace before hydration

The original build output contains no whitespace-only text node and no text node containing a newline (outside
`<script>`, `<style>`, `<noscript>`), so any whitespace with a newline in a text node was added by the formatter and
can be removed safely.

`scripts/format-site.ts` formats each HTML file like this:

1. Swap each `<noscript>...</noscript>` for a placeholder element (React compares its text, so it must stay byte for
   byte). Replace every space and newline inside a text node with a private-use placeholder character, so Prettier
   cannot re-wrap paragraphs.
2. Run Prettier: `htmlWhitespaceSensitivity: "ignore"`, `bracketSameLine: true`, 4-space indent, width 120.
3. Restore the placeholders and the `<noscript>` blocks.
4. Insert a small inline script as the first thing in `<head>`, glued to the next tag with no whitespace after it. It
   registers a `MutationObserver` on the document that, for every added text node outside `pre`, `textarea`, `script`,
   `style`, and `noscript`, removes whitespace-only nodes that contain a newline and trims leading and trailing
   whitespace-with-a-newline from other text nodes. It also sweeps nodes that already exist when it runs. About 700
   bytes, no dependencies.
5. **Safety gate**: apply the same stripping to the formatted file's parsed token stream (tags, comments, text outside
   scripts) and compare it with the original's. If they differ anywhere, the build fails, naming the file and the first
   difference. It also fails if the original contains a whitespace-only text node or a text node with a newline, which
   would make the stripping rule unsafe.

Inline `<script>` bodies are formatted by Prettier too (verified safe).

### Prototype results

- With React's scripts blocked, the browser's DOM for the formatted page was identical to the unformatted page's DOM.
- No hydration error on `/`, `/web-development`, and the not-found page in Chromium; the home page was clean in 5 of 5
  reloads, and Firefox was clean in 3 of 3. WebKit hangs on the owner's machine and was not tested.
- No line starts with `>`. 16 lines on the home page run past 120 characters, all paragraph text or one data string
  (spec edge case).
- Cost: about 700 bytes of inline script, a few milliseconds of DOM work at load.

### Risks and how the plan handles them

- **Race**: hydration could start before the observer strips a node. Not seen in about 10 loads. The e2e test reloads
  each of the three pages several times and fails on any console error; the DOM gate does not cover this, so it is the
  guard.
- **Fragility**: relies on the original having no meaningful newline whitespace. The gate's last check fails the build if
  that stops being true.
- **Dependency on hydration**: if React is later removed from the browser (below), delete the script and the gate and
  format the HTML freely.

### Related future decision (not part of this spec)

Next ships React to every page. Removing it, so static pages are plain HTML, is possible (post-build stripping of React's
scripts, the Pages Router per-page no-JS flag, or moving to Astro) but changes the constitution and the contact popup.
Owner's note: a future chatbot should probably be a self-contained script, not tied to site-wide React. That would be
its own spec.

## 5. The inline scripts in every page

- Two kinds exist: React flight data (`self.__next_f.push([1,"..."])`, generated, 13 per page) and the hand-written font
  loader in `src/app/layout.tsx` (`FONT_LOADER_SCRIPT`, the site's own code).
- **Decision**: Prettier-format all inline `<script>` bodies in place (verified hydration-safe). The whitespace-stripping script from section 4 is added alongside it. Keep the font loader
  inline: it must run before first paint to pick the font class, and an external file adds a blocking request. Its source
  string is rewritten in 4-space style so the HTML shows it formatted. Flight-data lines are one long string by nature
  and are allowed over 120 characters (spec edge case).

## 6. Where does the formatting run, and how is it enforced?

- **Decision**:
  - `package.json`: `"build": "next build && bun scripts/format-site.ts"`, plus `"format"` (write) and
    `"format:check"` (Prettier `--check` on source files). The Dockerfile and Playwright's `webServer` already run
    `bun run build`, so no change to `build.sh`, `run.sh`, `debug.sh`, or the Docker flow.
  - A Vitest test, `tests/unit/formatting.test.ts`, reads the repo's custom source files and (when `out/` exists) the
    built custom files, and fails with the file name on tabs, indentation that is not a multiple of 4 spaces, a
    minified custom file, or a custom/third-party mix. It is a check of rules, not a count of files or lines
    (no-counting-checks rule in memory).
  - A Playwright test, `tests/e2e/readable-output.spec.ts`, loads the home page, a content page, and the not-found page
    and fails on any console error, which is how a hydration mismatch shows up. The existing e2e suite stays the
    visual and behavior regression gate for FR-007.
- **Rationale**: One check per layer, reusing existing suites. Source files get `format:check` in CI-like local use;
  `bun run build` is the single entry point for output.
- **Alternatives**: a git pre-commit hook (hooks are not versioned here, easy to bypass), ESLint stylistic rules
  (duplicates Prettier).

## 7. TypeScript and TSX source (FR-011)

- **Decision**: `prettier --write` over `src`, `tests`, `server.ts`, and root config files with the new settings, in one
  mechanical commit separate from the behavior changes, so the whitespace diff does not hide real changes. License
  headers stay first (Prettier does not move comments).
- **Not formatted**: `design/` (vendored design system, already excluded from ESLint), `out/`, `node_modules/`, `.next/`,
  `specs/`, `content/`, `reports/`, lock files, and all Markdown. A `.prettierignore` lists them. `design/` is copied
  source for the design system, not code written for this site. Its CSS tokens are copied into `src/styles/tokens`,
  which is formatted.

## 8. Line length

- **Decision**: `printWidth: 120` for all languages. Prettier does not break long strings, URLs, or class lists in
  attributes, which are the allowed exceptions. Markdown is untouched.
- **Check**: the formatting test does not assert a percentage or any count of lines. The quickstart lists the lines over
  120 characters in the built output so a reviewer can confirm each is an allowed kind (one unbreakable value).
