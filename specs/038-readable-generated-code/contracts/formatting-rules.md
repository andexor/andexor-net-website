# Contract: Formatting Rules and Checks

These are the observable promises of this feature, in the order a reviewer or a test checks them.

## Prettier settings (`.prettierrc.json`)

```json
{
    "semi": true,
    "singleQuote": false,
    "trailingComma": "all",
    "printWidth": 120,
    "tabWidth": 4,
    "useTabs": false
}
```

## Built output (after `bun run build`)

1. Every `out/**/*.html` file is not minified, has no tab characters, and indentation in multiples of 4 spaces, no
   line starts with `>`, and after the whitespace script runs, its DOM (tags, comments, text outside scripts) is
   identical to the unformatted build's DOM.
2. `out/_next/static/chunks/site-*.js` exists, is not minified (readable identifiers such as `ContactProvider`), and is the only chunk that
   contains site code (for example `an-hero`).
3. No other chunk contains site code.
4. The built site CSS file is not minified, and each declaration is on its own line.
5. Loading the home page, a content page, and the not-found page in a browser, several times each, logs no console
   errors (a hydration mismatch shows up as React error #418).
6. Every line over 120 characters is one that cannot be broken without changing the page: a URL, a data string, a
   flight-data payload, or a run of paragraph text.
7a. Each built HTML page has one whitespace-stripping script, first in `<head>` (FR-012).

## Source

7. `bun run format:check` passes: every in-scope file matches Prettier's output.
8. A file with a tab, a 2-space indent, or a minified body makes `bun run test` fail, and the message names the file.

## Failure messages

`formatting.test.ts` failures name the file and the rule broken, for example
`src/styles/cards.css: indentation is not a multiple of 4 (line 12)`.
