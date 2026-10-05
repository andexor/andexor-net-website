# Research: Combine Page Scripts

Everything here comes from prototypes on copies of the built site (the repository was not changed). The owner's gate is
"only if it breaks nothing", so both steps were built and tested before planning.

## 1. What the scripts are

A built page has 13 inline scripts at the end of its body, in one unbroken run right before the closing body tag,
after the framework's `webpack` script file:

- one that starts the framework's data queue (`(self.__next_f = self.__next_f || []).push([0])`);
- twelve `self.__next_f.push([...])` calls that carry the page's data for React (the "data scripts").

Nothing but whitespace sits between them. The head has two other inline scripts (the whitespace script from spec 038 and
the font loader) and seven script files referenced by address; those stay as they are (spec Assumptions). The `.txt`
files in `out/` (for example `about-us.txt`) carry the same data for the framework's client-side navigation. This site does not use it (its links are ordinary links, so every click loads a page fully), and the files are not touched.

## 2. Step 1: combine into one inline script

- **Prototype**: join the 13 bodies, in order, into one inline script element.
- **Result** (Chromium and Firefox): no console errors on four page types, four loads each; the Contact popup opens;
  a link from the home page to Web Development loads a working page. The page is 0.6 KB smaller.
- **Speed** (Chromium, 1.6 Mbps and 150 ms latency, time until the Contact button works, median of 5, three runs):
  today 3195, 3204, and 3198 ms; combined 3222, 3220, and 3193 ms. Between 5 ms faster and 27 ms slower, which is
  within run-to-run noise.
- **Decision**: do it. It is safe and visible.

## 3. Step 2: move the combined script to an external file

- **Prototype**: write the combined script to `_next/static/data/<hash>.js` and put one plain script element
  (no `async` or `defer`) with that address where the inline one was. A plain script at the end of the body runs in
  order and before the page finishes loading, so the data is there as the page needs it.
- **Result** (Chromium and Firefox): same as step 1, no errors, popup and navigation work. The home page's HTML drops from
  42.5 KB to 30.9 KB.
- **Speed**: 3254, 3266, and 3245 ms, about 47 to 62 ms slower than today: one more request must finish before the page
  can hydrate.
- **Fix tested**: a preload hint in the head, right after the whitespace script, for the data file
  (`<link rel="preload" as="script" href="...">`). Medians 3231 and 3241 ms (against 3204 and 3208 ms for today in the same runs), about 27 to 33 ms slower than today. Zero errors with the extra
  head element (React ignores extra hint elements in the head, as it does the whitespace script).
- **Decision**: do it, with the preload hint. It meets FR-007 (at most one extra file, no noticeable slowdown).
- **Fallback** (FR-006): if any check fails, drop step 2 and keep step 1.

## 4. File naming and reproducibility

- Each page has different data (the data includes the framework's build id, which Next makes random for every build), so
  there is one file per page, 11 in all, and the names change on every build. That is correct: the name is the content
  hash, so a visitor never gets stale data.
- **FR-010 cannot be met in its strict form**: the build is not reproducible byte for byte even today (the build id also
  appears in each page and in the framework's manifests). The spec's wording is relaxed to "a name always matches its
  content". A fixed build id would make the names stable, but it would also make Next's manifest URLs stable while their
  content changes, which risks visitors getting stale manifests from a cache, so it is not done.

## 5. How to prove the data is unchanged

- The spec 038 build check compares page structure, not the data inside scripts.
- **Decision**: add a data check that runs the original 13 scripts, and then the combined script or the external file,
  in a sandbox (`node:vm`, with `self` as an empty object) and compares what ends up in the data queue. Equal queues
  mean the same data in the same order. The build fails, naming the page, if they differ.
- The structure check then compares the page after this step with the formatted page, as it does now, so a step that
  loses a script or element is caught either way.

## 6. Where it runs in the build

- `scripts/format-site.ts` already walks every built page. New order for each page: move the data scripts
  (`scripts/combine-scripts.ts`), then `formatHtml` as today on the result. The external file is formatted with Prettier
  (JavaScript, 4 spaces), like the site's own script chunk.
- `scripts/site-files.ts` gets a group for `out/_next/static/data/*.js` (built data file): formatted, never flagged as
  third-party, included in the formatting tests and in the straight quotes check.
- The Dockerfile, `server.ts`, and the other scripts do not change: the static server already serves any file under
  `out/` with the right content type (the prototype relied on this).

## 7. Tests

- Unit: the combining function (order kept, only the trailing run of inline scripts, head and `src` scripts untouched,
  pages without data scripts left alone and reported), the external step (hash name, preload hint, file content), the
  data check (passes for equal data, fails and names the page when a piece is dropped, reordered, or altered).
- Built output (unit, when `out/` exists): each page has one script element for data and none of the old pieces; the
  data file exists and is formatted; no inline data left.
- Browser: the existing "Readable output" hydration test (four page types, several loads, no console errors), the Contact
  flow, and one new check that the Contact button works within a generous budget (5 seconds) on a slow connection in
  Chromium; the measured median is about 3.2 seconds.

## 8. Rejected

- Merging the head scripts or the framework's script files into the data file: out of scope, and the head scripts must
  run first.
- A fixed build id for stable names (stale manifest risk, above).
- `async` or `defer` on the data script: it must run in order before hydration, and `defer` would run it after the page
  finishes parsing.
- Inlining by hand the `.txt` payloads: not needed.
