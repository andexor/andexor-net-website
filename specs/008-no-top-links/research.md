# Research: No Links to "#top"

## Decision 1: Remove the footer link by omitting `href`

- **Decision**: The footer renders `<Logo light />`; the component's existing no-`href` branch draws
  a plain block.
- **Rationale**: The branch already exists and is tested (hero). No new code path.
- **Alternatives considered**: Wrap the footer logo in a non-interactive `<span>` (same result,
  more markup); add a `link={false}` prop (a second way to say "no href").

## Decision 2: Guard with a source-scanning unit test plus an e2e link listing

- **Decision**: `tests/unit/no-top-links.test.ts` reads `src/**/*.{ts,tsx}` and `content/**/*.md`
  and fails on any link to `#top`. `tests/e2e/no-top-links.spec.ts` lists all links on `/`,
  `/web-development`, and `/nope`.
- **Rationale**: FR-004 says the rule must hold for pages and components added later. A source scan
  catches a link before anyone visits the page; the e2e check proves the rendered result.
- **Alternatives considered**: An ESLint rule (more tooling for one pattern); e2e only (misses
  unvisited pages).

## Decision 3: Keep `id="top"`

- **Decision**: Leave the `id` attributes on `ContentPage` and `Hero`.
- **Rationale**: They are not links, and tests use them as scopes. Removing them would need test
  changes for no user benefit.
- **Alternatives considered**: Remove them (cleanup nobody asked for).

## Decision 4: Record the rule in Principle IV and `CLAUDE.md`, as MINOR 1.4.0

- **Decision**: Add "no link goes to `#top`" to Principle IV, a short `CLAUDE.md` section, and bump
  the constitution to 1.4.0.
- **Rationale**: The owner wants a standing rule they never have to repeat (as with underlines).
  A new prohibition is materially new guidance, so MINOR.
- **Alternatives considered**: `CLAUDE.md` only (the constitution governs; an unrecorded rule can be
  forgotten); PATCH (understates a new rule).

## Unknowns

None remaining.
