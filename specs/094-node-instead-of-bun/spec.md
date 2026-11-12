# Feature Specification: Node.js and npm Instead of Bun

**Feature Branch**: `120-add-security-headers` (current branch; not created by this spec)

**Created**: 2026-11-12

**Status**: Implemented (2026-11-12). The Docker parts (User Story 2, FR-005, SC-002) were superseded the same day by
[spec 095](../095-remove-docker/spec.md), which removed Docker. Written with the change, not after it, but the work was done in one pass, so the
plan and tasks record what was done rather than what was proposed.

**Input**: User description: "Update all scripts to use Node instead of Bun. We probably need a spec and an amendment
to the constitution, CLAUDE.md, setup.md, and whatever else. Keep all scripts and documentation updated and in sync.
There may be scripts we do not need anymore, like install-bun.sh and install-cf.sh."

**Issue**: [#120](https://github.com/andexor/andexor-net-website/issues/120), the issue of the current branch (`120-add-security-headers`). Commits for this change end their subject with `Closes #120.`

## Summary

The site was built with Bun: Bun installed packages, ran the build scripts, ran the Playwright server, and was the
runtime of the Docker image. Since the site moved to Cloudflare Workers, Wrangler and the Cloudflare CLI have needed
Node.js anyway, so the project ran two runtimes. This feature makes Node.js with npm the only one. Nothing a visitor
sees changes: the built site is the same.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Every command runs with npm and Node (Priority: P1)

The owner clones the repository on a machine that has Node.js and no Bun, installs the packages, and builds, tests,
previews, and deploys the site using only `npm`, `npx`, and `node`.

**Why this priority**: This is the whole change. Everything else follows from it.

**Independent Test**: On a machine with Node.js and no Bun, run `npm ci`, `npm run lint`, `npm test`,
`npm run build`, and `npm run test:e2e`. All succeed.

**Acceptance Scenarios**:

1. **Given** a clean checkout and Node.js, **When** `npm ci` runs, **Then** the packages install from
   `package-lock.json`, and `sharp` is the empty stub in `stubs/sharp`.
2. **Given** the installed packages, **When** `npm run build` runs, **Then** it writes the same readable `out/` as
   before, including each page's structured data.
3. **Given** the built site, **When** the Playwright tests run, **Then** they pass against `node server.ts`.

---

### User Story 2 - The Docker image runs on Node and still stops on the first Ctrl+C (Priority: P1)

`build.sh` builds the image and `run.sh` runs it. The image has Node.js and no Bun, and it stops on the first SIGINT
and on `docker stop`, as the constitution requires (Principle VII).

**Independent Test**: Build the image, start it, request the home page, a content page, and a missing page, send one
SIGINT, and confirm the log line `Received SIGINT, shutting down`, an exit with status 0, and that `docker ps -a`
lists no leftover container.

**Acceptance Scenarios**:

1. **Given** the running container, **When** the home page, a content page, a static file, and a missing address are
   requested, **Then** the answers are 200, 200, 200 with the right content type, and 404 with the site's not-found
   page.
2. **Given** the running container, **When** one SIGINT arrives, **Then** the server stops accepting connections,
   logs the shutdown, and exits with status 0, and with `--rm` the container is removed.

---

### User Story 3 - The scripts and the documents agree (Priority: P2)

A person reading the constitution, `CLAUDE.md`, `setup.md`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, a script
comment, or a shell script finds the same commands everywhere, and no document tells them to install or run Bun.

**Independent Test**: Search the repository, outside `specs/` and the lockfile and license report, for Bun commands
and files (`bun`, `bunx`, `bun.lock`, `install-bun`, `Bun.`). The only matches are the sentences that say Bun is no
longer used.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST use npm for package management, with `package-lock.json` committed and `bun.lock`
  removed. The Dockerfile MUST install with `npm ci`.
- **FR-002**: TypeScript scripts (`scripts/`) MUST run with `tsx`, started by the `npm` scripts in `package.json`
  and by the shell scripts, using `tsconfig.scripts.json`.
- **FR-003**: No script or source file MAY use a Bun global (`Bun.`), `import.meta.dir`, or a top-level `await`.
- **FR-004**: `server.ts` MUST serve `out/` with `node:http`, set a Content-Type from the file extension, answer HEAD,
  refuse other methods with 405, never serve a path outside `out/`, serve `404.html` with status 404, and keep the
  graceful shutdown rules of Principle VII. It MUST import nothing but `node:` modules, so Node runs it directly.
- **FR-005**: The Dockerfile MUST use `node:slim` images for both stages, and the runtime stage MUST contain no
  `node_modules`.
- **FR-006**: The sharp stub MUST still replace `sharp` everywhere, so no LGPL binary is installed. The stub is a root
  dependency that `overrides` points to with `$sharp`, because npm resolves a `file:` override relative to the package
  that asks for it.
- **FR-007**: Dependency install scripts MUST stay as they were under Bun: `@higgsfield/cli` and `workerd` run theirs,
  and `esbuild` does not (`allowScripts` in `package.json`).
- **FR-008**: `install-bun.sh` and `install-cf.sh` MUST be removed. `cf` is installed with `npm install -g cf@latest`.
- **FR-009**: The constitution MUST be amended (version 2.0.0), and `CLAUDE.md`, `setup.md`, `README.md`,
  `CONTRIBUTING.md`, `SECURITY.md`, and the comments in scripts and tests MUST name the npm commands.
- **FR-010**: Specs 001 to 093 MUST NOT be rewritten. They record what was done with the toolchain of the time.

### Edge Cases

- A script that needs the React component `JsonLD.tsx` fails with "React is not defined" under the root tsconfig,
  whose `"jsx": "preserve"` is for Next.js. The scripts' own tsconfig sets `"jsx": "react-jsx"`.
- Node prints a notice that `server.ts` has no module type. The server is run with
  `--disable-warning=MODULE_TYPELESS_PACKAGE_JSON`, and `"type": "module"` is NOT added to `package.json`, because
  `__dirname` is used by `next.config.ts`, `vitest.config.ts`, and several tests.
- Keep-alive connections would hold a closing server open, so shutdown also closes idle connections, and the
  five-second forced exit stays as the fallback.

## Success Criteria *(mandatory)*

- **SC-001**: `npm ci`, `npm run lint`, `npm test`, `npm run build`, and the Chromium Playwright tests pass.
- **SC-002**: The Docker image builds with `build.sh`'s `docker build` command, serves the site, and stops on one
  SIGINT with exit status 0 and no leftover container.
- **SC-003**: A search for Bun in the repository outside the excluded places finds only sentences that say Bun is not
  used.
- **SC-004**: `reports/license-report.md` is regenerated by `./setup.sh` and shows no copyleft license.

## Assumptions and Decisions

- Node.js 26 is used (`nvm install 26` in `setup.md`, `node:26-slim` in the Dockerfile). `engines` in `package.json`
  names 22.18.0, the oldest release that runs TypeScript files without a flag.
- `tsx` is added as a development dependency (Principle I): the scripts import code that uses the `@/` path alias and
  a `.tsx` file, which Node's own TypeScript support cannot load. `server.ts` needs neither, so the Docker image has no
  `tsx`.
- `package-lock.json` was generated fresh, so packages within their `^` ranges may be newer than `bun.lock` had them.
  Lint, the unit tests, the build, and the Chromium end-to-end tests pass with them.
- The older specs keep their Bun commands (FR-010). `quickstart.md` here maps each old command to its new one.
- The device-code login of `cf` hung under Bun. It has not been tried under Node, so `--no-device` stays in
  `setup.md`.
