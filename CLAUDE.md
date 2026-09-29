# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is the Andexor Network, Inc. company website. As of now it contains no
application code — only the [GitHub Spec Kit](https://github.com/github/spec-kit) (`specify-cli`
v1.0.12) scaffolding for Spec-Driven Development (SDD). The current branch
(`1-build-initial-home-page`) is the first feature branch, created by Spec Kit for building the
initial home page, but no `specs/` directory or source tree exists yet.

## Spec-Driven Development workflow

This project is driven by Spec Kit's slash-command workflow rather than ad-hoc coding. Work
proceeds through these skills, in order, each producing artifacts consumed by the next:

1. `speckit-constitution` — establish/update the project's governing principles in
   `.specify/memory/constitution.md`. **This file is currently an unfilled template**
   (placeholders like `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`) — it should be filled in before
   principles are assumed to apply.
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

## Markdown content pages

Pages are authored as Markdown in `content/` (path = route, e.g. `content/about.md` -> `/about`)
and rendered to static HTML at build time by the catch-all route `src/app/[...slug]/page.tsx`,
using `src/lib/content.ts` (unified/remark/rehype) and styled by `src/styles/content.css`. The
user adds and edits these files themselves; do not convert them to hand-written `.tsx` pages.
Authoring rules are in `content/README.md`. Content pages are intentionally not linked from the
home page or footer until the user says a page is ready.

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
