# Feature Specification: Remove Docker

**Feature Branch**: `120-add-security-headers` (current branch; not created by this spec)

**Created**: 2026-11-12

**Status**: Implemented (2026-11-12).

**Input**: User description: "Since we are not using Docker images with Cloudflare, I think we do not need the
Dockerfile anymore, which means we also do not need build.sh, debug.sh, or run.sh. We should remove all of them. Then
we could rename preview.sh to be the new run.sh for local testing."

**Issue**: [#120](https://github.com/andexor/andexor-net-website/issues/120), the issue of the current branch
(`120-add-security-headers`).

## Summary

The Docker image was how the site was run before it moved to Cloudflare Workers. Production now serves `out/` from
Cloudflare, so nothing builds or runs the image. This feature removes the Dockerfile and the scripts that existed only
for it, keeps one local check, and retires the constitution rule that only governed containers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One command builds and previews the site locally (Priority: P1)

The owner runs `./run.sh` and gets the built site served the way Cloudflare will serve it, at http://localhost:8787.

**Independent Test**: Run `./run.sh`. The site builds, `wrangler dev` starts, and `http://localhost:8787/` and a content
page answer 200.

**Acceptance Scenarios**:

1. **Given** the repository, **When** `./run.sh` runs, **Then** it runs `npm update`, `npm run build`, and then
   `npm run preview`.
2. **Given** the repository, **When** the root is listed, **Then** there is no `Dockerfile`, `.dockerignore`,
   `build.sh`, `debug.sh`, or `preview.sh`.

### User Story 2 - The documents agree (Priority: P2)

**Independent Test**: Search the repository outside `specs/` for `Dockerfile`, `build.sh`, `debug.sh`, `preview.sh`,
`docker build`, and `docker run`. The only matches are sentences that say Docker is gone.

## Requirements *(mandatory)*

- **FR-001**: `Dockerfile`, `.dockerignore`, `build.sh`, and `debug.sh` MUST be removed.
- **FR-001a**: `install-docker.sh` and the Docker section of `setup.md` MUST be removed.
- **FR-002**: `preview.sh` MUST be renamed `run.sh`, and MUST run `npm update && npm run build && npm run preview`, so
  that package updates are tried locally before a deploy. `deploy.sh` MUST NOT update packages.
- **FR-003**: `server.ts` MUST stay, because the Playwright tests serve `out/` with it. Its comments MUST no longer say
  it serves a Docker container, and it keeps its signal handling.
- **FR-004**: The constitution MUST be amended (version 3.0.0). Principle VII, Graceful Container Shutdown, is retired
  with its number kept. The Docker workflow bullet, the Dockerfile license header note, and the Docker image notes are
  removed.
- **FR-005**: `CLAUDE.md`, `README.md`, `content/README.md`, `SECURITY.md`, `setup.md`, and the comments in
  `server.ts`, `playwright.config.ts`, and `scripts/generate-sitemap.ts` MUST agree.
- **FR-006**: Specs 001 to 094 MUST NOT be rewritten.

## Success Criteria

- **SC-001**: `npm run lint`, `npm test`, and `npm run build` pass, and the Playwright tests pass against
  `node server.ts`.
- **SC-002**: `./run.sh` serves the site at http://localhost:8787.

## Assumptions and Decisions

- `install-docker.sh` and the Docker section of `setup.md` are removed too. The owner asked for this after the first
  pass, because this project does not need Docker.
- `build.sh` was the only thing that ran `npm run sitemap` (it needs git history, which an image build lacks). Nothing
  runs it now. The owner asked for `deploy.sh` to run `npm run sitemap` before it builds, so the deployed sitemap is
  current; that changes `content/sitemap.xml`, which is then committed.
- Principle VII is retired, not deleted, so "Principle VIII" (URL structure) and the other references to principles
  stay correct.
- The `docker_script_convention` of the owner's other apps is not affected. This repository stops following it.
