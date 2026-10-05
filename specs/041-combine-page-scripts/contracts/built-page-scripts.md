# Contract: Scripts in a Built Page

## What a visitor's browser gets, per page

1. Head, in this order: the whitespace script (inline), the preload hint for the data file, the other head content and
   the framework's script files (addresses), and the font loader (inline). The head's inline scripts are unchanged.
2. Body: the page, then the framework's `webpack` script file, then **one** script element for the data:
   `<script src="/_next/static/data/<hash>.js"></script>`, with no `async` or `defer`.
3. No inline data script anywhere.

## The data file

- Path: `out/_next/static/data/<hash>.js`, served as JavaScript.
- Content: the page's former data scripts, in their original order, formatted with 4 spaces.
- Name: content hash, so identical pages share a file and a changed page gets a new name.
- It contains no curly quote or reference to one.

## Build checks (each fails the build, naming the page)

- The data check: the original scripts and the combined script or the file leave the same data queue.
- The structure check: the page after this step and the formatted page have the same structure.
- A page whose body does not end in a run of inline data scripts is left unchanged, and the build prints a note.

## Go or no-go (FR-006)

Each step is kept only if all of these pass: unit tests, the built-output tests, the browser tests (no console errors on
four page types, several loads each; the Contact flow; a page reached through a link), and the slow-connection check.
If step 2 fails any of them it is dropped and step 1 stays.
