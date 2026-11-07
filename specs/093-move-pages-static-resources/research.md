# Research: Move Pages and Static Resources

**Feature**: specs/093-move-pages-static-resources | **Date**: 2026-11-07

Every open point in the plan's Technical Context is settled here. Nothing is left as NEEDS CLARIFICATION.

## R1. Where the redirects come from

**Decision**: a `public/_redirects` file. Next.js copies `public/` into `out/` at build time (the existing
`public/_headers` already travels this way), and Cloudflare Workers Static Assets reads `_redirects` from the assets
directory, does not serve it, and applies its rules before headers and before looking an asset up.

**Rationale**: the Worker has no code (`wrangler.jsonc` has no `main`) and CLAUDE.md says it must not gain any. The
redirect file is the one mechanism that keeps the Worker code-free, lives in the repository, and deploys with the
site. The format is `[source] [destination] [code?]`, one rule per line, with `*` splats and `:splat` in the
destination. Limits are 2,000 static and 100 dynamic rules; this feature needs 17.

**Alternatives considered**:

- Worker code answering redirects: adds a `main` and a code path to a site that deliberately has none. Rejected.
- Cloudflare Bulk Redirects or Redirect Rules in the dashboard: not versioned with the site, invisible to tests and
  to the next contributor. Rejected.
- `redirects()` in `next.config.ts`: ignored by `output: "export"`. Rejected.
- Meta-refresh pages at the old addresses: not a 301, and search engines treat them as weaker signals. Rejected.

## R2. Redirect status codes

**Decision**: `301` for every moved page and every moved resource folder. `302` for `/services` and `/company`
going to `/`.

**Rationale**: the issue asks for 301 on moved addresses, and 301 is what moves search standing. The two section
addresses are placeholders "right now" (the issue's words): when a `content/services/index.md` is written, the
redirect is removed and the address serves a page. Browsers cache a 301 indefinitely, so a visitor who once typed
`/services` would keep landing on `/` after the landing page exists. A 302 is not cached that way. The spec leaves
the status of the two section redirects open, so this is the plan's call; the owner can change the two rules to 301
in one line each if they prefer.

**Alternatives considered**: 301 for all 17 rules (simpler to state, but bakes in the placeholder); 308 (same
caching as 301, and no benefit for GET).

## R3. The rule set

**Decision**: 17 rules, in this order: 12 page rules, 3 splat rules for the resource folders, 2 section rules.

```text
/web-development         /services/web-development         301
... (one per page, see data-model.md)
/fonts/*                 /static/fonts/:splat              301
/images/*                /static/images/:splat             301
/logo/*                  /static/logo/:splat               301
/services                /                                 302
/company                 /                                 302
```

**Rationale**: one rule per moved page is explicit and testable; a splat per resource folder covers every file,
including ones added later under the old name by mistake. The file carries the license header as `#` comments, as
`_headers` does.

## R4. Trailing slashes

**Decision**: no rule for `/web-development/` or any other trailing-slash variant of an old address.

**Rationale**: the issue says not to add trailing-slash support. New addresses with a trailing slash are already
handled by the host (`html_handling: auto-trailing-slash` redirects `/services/web-development/` to the page). Old
addresses with a trailing slash fall through to the 404 page, as they do today for any unknown address.

## R5. Source layout and what already works

**Decision**: `git mv` the eight service pages to `content/services/`, the four company pages to `content/company/`,
and the three resource folders to `public/static/`. No code is written for routing, the sitemap, or the server.

**Rationale**, verified by reading the code:

- `src/lib/content.ts` walks folders and makes `content/services/web-development.md` the page at
  `/services/web-development`; a `folder/index.md` is `/folder`. The authoring guide already documents this shape.
- `scripts/generate-sitemap.ts` joins the slug segments, so the sitemap lists `/services/...` and `/company/...`
  with no old address, and `lastmod` follows the moved file through git.
- `scripts/copy-crawler-files.ts` copies `content/robots.txt` and `content/sitemap.xml` to the root of `out/`, which
  is where they stay.
- `server.ts` tries `out/<path>.html` and finds `out/services/web-development.html`. For `/services`, a directory
  with no page, Bun's file API reports a directory as not existing (checked with Bun 1.4.4: `exists()` is false and
  a Response over a directory throws), so the server falls through to the 404 page, which is the spec's allowed
  local behavior.
- Next.js puts the framework's files under `/_next/static/`, which does not collide with `/static/`.

## R6. Caching rules

**Decision**: in `public/_headers`, rename `/fonts/*` to `/static/fonts/*` (one year, immutable), `/images/*` to
`/static/images/*` and `/logo/*` to `/static/logo/*` (30 days, revalidated). Root icon, manifest, browserconfig, and
`/_next/static/*` rules are unchanged. The comment that names the font files' source locations stays correct
(`src/styles/fonts.css`, `src/app/layout.tsx`).

**Rationale**: the spec asks for the same lifetime per prefix and no rule for an old prefix. Redirects run before
headers, so an old-prefix request never reaches a header rule anyway.

## R7. How the move is verified

**Decision**:

- A unit test reads `public/_redirects` and checks: every published content slug whose old root address was moved
  has a `301` rule to `/services/<slug>` or `/company/<slug>` and that destination is a published page; each of
  `/fonts/*`, `/images/*`, `/logo/*` has a `301` splat rule to the matching `/static/` folder, which exists; the two
  section rules go to `/`; no rule's destination is an old address.
- The existing built-output test (`tests/unit/build-output.test.ts`, runs when `out/` exists) gains one check: no
  built page or site stylesheet contains `"/fonts/`, `"/images/`, `"/logo/`, or an `href` to an old page address.
  This is the spec's FR-005 as a behavior check over what the site emits.
- Existing unit and end-to-end tests change only the addresses they visit or expect
  (`content-links.test.tsx`, `services.test.tsx`, `contact-popup.test.tsx`, `not-found.test.tsx`, and about
  twenty Playwright specs).
- No test requires a redirect from `server.ts` or from `wrangler dev`. `wrangler dev` does honor `_redirects` for
  static assets, so the quickstart offers it as an optional hand check.
- Production is checked by hand with `curl -I` after the owner deploys. The plan does not run `wrangler deploy`.

**Rationale**: Principle V allows tests for stated behavior and forbids tests for copy, sizes, or a checker. The
redirect-list test and the no-old-prefix test are the two behaviors the spec states; the header lifetimes and the
documents are read, not tested.

**Alternatives considered**: a Playwright test that starts `wrangler dev` to assert 301s. Rejected: it adds a second
server to the suite, Wrangler runs on Node outside the Bun toolchain, and the issue explicitly says not to worry
about testing redirects outside production.

## R8. Constitution amendment

**Decision**: add a "URL structure" paragraph with the prefix table and the one-sentence rule to Principle VIII,
bump 1.9.0 to 1.10.0 (MINOR), update the sync-impact comment at the top of the file and the footer's "Last Amended"
date.

**Rationale**: Governance classes "materially expanded guidance" as MINOR. Templates in `.specify/templates/` do not
name routes or resource folders, so none needs a follow-up.

## R9. Documents

**Decision**:

- `content/README.md`: the Routes table shows `content/services/web-development.md` to `/services/web-development`,
  `content/company/about-us.md` to `/company/about-us`, and `content/services/index.md` to `/services`; a sentence
  says pages live in `content/services/` or `content/company/` and nothing else sits at the root of `content/` except
  this README and the crawler files; the image example becomes `/static/images/...` and "Images go in
  `public/static/images/`".
- `CLAUDE.md`: the Markdown content pages paragraph says the same, with the route example updated; the two
  incidental references to `/privacy-policy` and `about-us.html` elsewhere in the file are updated so the file does
  not contradict itself.
- `public/.well-known/security.txt`: Contact, Policy, and Acknowledgments become `/company/security-policy`;
  Canonical and the mailto are unchanged.

## R10. Out of scope, confirmed

- The contact service under `/api/` (other repository): unchanged, listed in the prefix table only.
- Section landing pages for `/services` and `/company`: not written.
- `www.andexor.net`, trailing-slash variants, and any address not in the map: unchanged.
