# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is the Andexor Network, Inc. company website: a Next.js static site with a home
page and Contact Us popup (`specs/001-homepage-contact-us/`) and Markdown content pages with a
card layout, currently the Web Development page (`specs/002-content-pages-card-template/`, an
as-built spec written after the fact). Spec Kit (`specify-cli` v1.0.12) scaffolding drives
Spec-Driven Development (SDD).

## Spec-Driven Development workflow

This project is driven by Spec Kit's slash-command workflow rather than ad-hoc coding. Work
proceeds through these skills, in order, each producing artifacts consumed by the next:

1. `speckit-constitution` — establish/update the project's governing principles in
   `.specify/memory/constitution.md` (currently v1.4.0, eight principles). Read it before
   specifying or planning; it holds the always-dark, no-link-underline, no-#top-link, graceful-shutdown,
   Markdown-content, toolchain, license-header, and spec-policy rules.
2. `speckit-specify` — turn a natural-language feature description into a spec, creating a new
   numbered feature branch/directory (e.g. `specs/001-build-initial-home-page/`).
3. `speckit-clarify` — resolve underspecified areas in the spec via targeted questions (run before
   `speckit-plan` unless the user explicitly skips it).
4. `speckit-plan` — generate the implementation plan and design artifacts from the spec.
5. `speckit-tasks` — generate a dependency-ordered `tasks.md` from the plan.
6. `speckit-analyze` — non-destructive cross-artifact consistency check across spec/plan/tasks
   (optional, run before implementation).
7. `speckit-checklist` — generate a custom requirements-quality checklist for the feature
   (optional).
8. `speckit-implement` — execute `tasks.md` to actually build the feature.
9. `speckit-taskstoissues` — alternative to direct implementation: convert `tasks.md` into ordered
   GitHub issues.
10. `speckit-converge` — after implementation, diff the codebase against spec/plan/tasks and append
    any remaining unbuilt work as new tasks.

Feature branches and directories are numbered sequentially (`feature_numbering: sequential` in
`.specify/init-options.json`); helper logic for branch/dir resolution lives in
`.specify/scripts/bash/` (`create-new-feature.sh`, `setup-plan.sh`, `setup-tasks.sh`,
`check-prerequisites.sh`, `resolve-template.sh`, `common.sh`). These scripts locate the repo root
by walking upward for a `.specify/` directory, so Spec Kit commands work from any subdirectory.

Templates for each artifact type (spec, plan, tasks, checklist, constitution) live in
`.specify/templates/`.

## Re-running / updating Spec Kit itself

`install-spec-kit.sh` records how Spec Kit was installed and initialized:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.0.12
specify init --here --force --non-interactive --script sh --integration claude
```

It also appends `.claude/` to `.gitignore`. Note: as of this writing there is no root
`.gitignore` file yet, so `.claude/` is currently untracked-but-not-ignored — re-running the
install script (or manually creating `.gitignore`) is expected to fix that.

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
