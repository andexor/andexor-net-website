# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is the Andexor Network, Inc. company website: a Next.js static site with a home
page and Contact Us popup (`specs/001-homepage-contact-us/`) and Markdown content pages with a
card layout, currently the Web Development page (`specs/002-content-pages-card-template/`, an
as-built spec written after the fact). Spec Kit (`specify-cli` v1.0.12) scaffolding drives
Spec-Driven Development (SDD).

## Spec-Driven Development workflow

This project is driven by Spec Kit's slash-command workflow rather than ad-hoc coding. Order: constitution,
specify, clarify (before plan unless the user skips it), plan, tasks, analyze and checklist (optional), implement
(or taskstoissues instead), converge. Read `.specify/memory/constitution.md` (currently v1.4.0) before specifying
or planning; it holds the always-dark, no-link-underline, no-#top-link, graceful-shutdown, Markdown-content,
toolchain, license-header, and spec-policy rules.

Feature branches and directories are numbered sequentially (`feature_numbering: sequential` in
`.specify/init-options.json`); helper logic for branch/dir resolution lives in
`.specify/scripts/bash/` (`create-new-feature.sh`, `setup-plan.sh`, `setup-tasks.sh`,
`check-prerequisites.sh`, `resolve-template.sh`, `common.sh`). These scripts locate the repo root
by walking upward for a `.specify/` directory, so Spec Kit commands work from any subdirectory.

Templates for each artifact type (spec, plan, tasks, checklist, constitution) live in
`.specify/templates/`.

## Design System

Follow design/README.md and design/DESIGN.md for all UI. Use the CSS variables in design/tokens. Obey the brand and copy rules in design/README.md.

## Always dark

The site always renders the dark palette, whatever the visitor's OS light/dark setting is. This
is set in `src/styles/tokens/colors.css` (the dark alias values are unconditional, with
`color-scheme: dark`) and deliberately differs from `design/tokens/colors.css`, which follows the
OS setting. Don't add `prefers-color-scheme` light/dark switching back, and keep this override if
the design tokens are re-copied. There is no light theme to design or test.

## No links to #top

Never link to `#top` (or any address whose fragment is `top`, such as `/#top` or `/page#top`),
anywhere. The footer logo and the home page hero logo are plain branding, not links; only the header
logo on content pages links, and it goes to `/`. Do not add a "back to top" link or scroll-to-top
control. `tests/unit/no-top-links.test.ts` fails if any `src/` code or `content/` Markdown links to
`#top`. The `id="top"` on page wrappers is not a link and may stay. If an older spec, contract, or
design document says a logo scrolls to the top, correct it when you find it. Do not ask the owner
again.

## No underline on links

Never underline a link, at rest, on hover, or on focus (`a { text-decoration: underline }`,
`a:hover { text-decoration: underline }`, or similar). Hover underline causes a rendering flicker,
and links look best without underlines, like the footer links. Signal hover with a color change and
keyboard focus with the ring. A link that is not underlined at rest must NEVER gain an underline on
hover, whatever a design-system document, framework default, or example says. If a design-system or
framework stylesheet or document (for example `design/DESIGN.md`, "Hover" paragraph) ships or
describes an underline rule, remove or correct it when you find it. Do not ask the owner again. Because there is no underline, links in body text must stand out by color: inside
`.an-prose` and `.an-tile`, body text is `--slate-50` and links are `--blue-400` (hover
`--blue-300`), which passes the WCAG 2.1 AA link-versus-text check. Keep this rule when adding pages or components.

## Straight quotes only

Never use curly, smart, or typographic quotes, in any file and in any form: not the characters, and not HTML
character references to them. Use only the straight apostrophe (') and the straight double quote ("). This covers
source, content, documentation, specs, tests, commit messages, and everything an AI assistant writes. The one
exception is third-party text the owner has said not to alter, `CODE_OF_CONDUCT.md` and `CODE_OF_CONDUCT.adoc`: leave
those exactly as they are, and they are not checked. The built pages also write apostrophes and quotes as plain
characters (We'll, not the escape React writes); `scripts/format-html.ts` does that. `tests/unit/straight-quotes.test.ts`
fails, naming the file and line, when a curly quote appears. When writing a file, never type a backslash-u escape for
a quote: it can turn into the real character. Use straight quotes, or numeric code points in code. The owner has
asked for this firmly, more than once. Do not ask again.

## Toolchain

The site is built with Next.js using Static Site Generation (SSG, `output: "export"`) — no
server-side rendering, ISR, or API routes. Use Bun (not Node.js/npm/yarn) for package
management, running scripts, and as the production runtime. Build and run the app inside Docker
via the root `Dockerfile` (2 stages: Bun installs deps and runs `next build` to produce the
static `out/` directory, then a minimal Bun runtime image serves that output via `server.ts` — a
small `Bun.serve` static file server, not a Next.js server process). See
`specs/001-homepage-contact-us/research.md` and `plan.md` for the rationale.

Local Docker workflow uses three standard scripts (the user's convention across their apps —
don't invent alternate `docker build`/`docker run` invocations):
- `build.sh` — builds the image, tagged `andexor/<repo-dir-basename>:<VERSION>` (currently
  `andexor/andexor-net-website:1`); removes any existing image with that tag first.
- `run.sh` — `docker run --rm -p 3000:3000 <image>`, runs the app normally.
- `debug.sh` — same image and port mapping, but runs `/bin/bash` instead of the app, for
  poking around inside the container.

The project is Apache-2.0 (`license` in `package.json`, which is deliberately not marked
`"private"` so tools report the license correctly). No copyleft dependencies: the optional `sharp`
dependency of Next.js (LGPL libvips) is replaced by the empty stub in `stubs/sharp` through
`overrides` in `package.json`. The Dockerfile copies `stubs/` before `bun install
--frozen-lockfile`, so keep that line. Update the license report by running `./setup.sh`, which
appends a dated section to `reports/license-report.md` (append-only, never overwrite it, so
do not add another script that writes the report) and fails if a GPL, LGPL, or AGPL license
is found. Nothing is excluded from the report.

Playwright e2e tests (`bun run test:e2e`) build the site and serve `out/` with `server.ts`
(production mode), not `next dev`, because dev cannot serve the static-export 404 page. Port 3000
must be free, or Playwright will reuse whatever is listening there.

## Markdown content pages

Pages are authored as Markdown in `content/` (path = route, e.g. `content/about.md` -> `/about`)
and rendered to static HTML at build time by the catch-all route `src/app/[...slug]/page.tsx`,
using `src/lib/content.ts` (unified/remark/rehype) and styled by `src/styles/content.css`. The
user adds and edits these files themselves; do not convert them to hand-written `.tsx` pages.
Authoring rules are in `content/README.md`. Content pages are intentionally not linked from the
home page or footer until the user says a page is ready.

## Sizing FontAwesome icons

FontAwesome's stylesheet (imported unmodified in `src/app/layout.tsx`) gives every icon `height: 1em` and
`width: 1.25em` through the one-class rule `.svg-inline--fa`. Never copy, patch, or replace that stylesheet: it would
drift from the package. To size an icon from the element around it, add an override rule in `src/styles/marketing.css`
named from the `<svg>`'s two classes joined with a dot (`class="svg-inline--fa fa-square-github"` gives
`.svg-inline--fa.fa-square-github`) that sets `height: inherit` and `width: inherit`. Two classes outrank FontAwesome's
one, so no `!important` is needed. Add or change the rule whenever an icon is added or swapped. The footer's social
icons are the example (spec 043); `tests/e2e/social-icon-size.spec.ts` fails if one has no rule.

## Contributing and setup

Read `CONTRIBUTING.md` and `setup.md` (companions to the constitution, with `SECURITY.md`,
`CODE_OF_CONDUCT.md`, `DCO`, `LICENSE`, and `NOTICE`). The rules that affect day-to-day work:

- Work is issue-driven: a GitHub issue written as a user story (Description, Acceptance Criteria,
  optional Technical Details), the spec updated before the change. A branch per issue is a suggestion, not a rule; small
  related changes may share a branch, so don't create a new branch unless asked.
- Commit with `git commit -s`, and end the subject with `Closes #N.` (or `Fixes #N.` for a bug
  fix), for example `Updated copy for Web Development. Closes #9.`
- Open a PR only when asked. Reviewer `andexor/write`, assigned to the user.
- Prerequisites come from the scripts in `setup.md`. Bun, Docker, and Spec Kit are installed with
  `install-bun.sh`, `install-docker.sh`, and `install-spec-kit.sh`. Playwright needs
  `bunx playwright install-deps webkit`, though WebKit still hangs on the owner's machine.
- Development targets Linux, preferably the latest Ubuntu LTS.
- AI-generated code and text are reviewed before acceptance: no tests that pass but prove
  nothing, and no machine-sounding prose.
- Report security issues per `SECURITY.md`, never in public issues or PRs.

## Formatting

All code written for this site is formatted with Prettier: 4 spaces per indent level, no tabs, lines under 120
characters where possible (`.prettierrc.json`). Use `bun run format` and `bun run format:check`. This applies to the
source (`.ts`, `.tsx`, `.js`, `.mjs`, `.css`) and to the built site in `out/`. `design/`, `content/`, `specs/`,
and Markdown are not formatted. Anchor `.prettierignore` patterns with a leading `/`: an unanchored `content/` also
skips `src/components/content/`.

`bun run build` runs `next build` and then `scripts/format-site.ts`, which:

- Formats every built HTML page, the site stylesheet, and the site's own script chunk. The vendor chunks (React,
  Next.js, polyfills) stay minified.
- Relies on `next.config.ts`, which puts all `src/` code in one `site-*.js` chunk and tells Next's minifier to skip it.
- Adds one small inline script first in each page's `<head>`. React rejects the whitespace that pretty-printed HTML
  adds between elements (hydration error #418), so the script strips it before hydration. The formatter fails the build
  if the formatted page would not have the same DOM as the original (`scripts/format-html.ts`).

Rules to keep in mind:

- The framework's data for each page, a dozen or more small inline scripts at the end of the body, is combined into one
  script and moved to `out/_next/static/data/<hash>.js` (`scripts/combine-scripts.ts`, spec 041). The file is
  formatted, named by the hash of its content, and referred to by one plain script element at the end of the body, with
  a preload hint first in the head (it costs about 30 ms on a slow connection, without the hint about 60 ms). The
  build runs the original scripts and the new one in a sandbox and fails, naming the page, if the data differs. The
  head's inline scripts (the whitespace script and the font loader) stay inline and first, and the framework's script
  files are not touched. The site's links are ordinary links, so every click loads a page fully with its own data file.
- Markdown-generated HTML is rendered with `dangerouslySetInnerHTML`. Give such an element `data-raw-html=""`: the
  formatter formats its content with whitespace-safe settings, and the script leaves it alone, because a newline
  between inline elements there is a visible space.
- Do not put a newline in React-rendered text, and do not rely on leading whitespace in a text node. The formatter
  cannot tell it from its own indentation, and the build fails with the file and token when it finds one.
- No line of built HTML starts with `>`. Do not switch the formatter to a mode that does that.

## License header

Every generated source code file (`.ts`/`.tsx`/`.js`/`.css`, `Dockerfile`, shell scripts, etc.)
MUST start with this header, using that language's comment syntax:

```
SPDX-License-Identifier: Apache-2.0
Copyright 2026 Andexor Network, Inc.
Author: Ed Jenkins <ed@andexor.net>
```

Documentation/spec files (Markdown) are not source code and do not need this header. For a
Dockerfile, the header goes after the `# syntax=...` parser directive on line 1 (that directive
must remain the very first line).
