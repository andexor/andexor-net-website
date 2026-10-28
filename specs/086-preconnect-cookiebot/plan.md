# Implementation Plan: Preconnect to the Cookiebot CDN

**Branch**: `100-preconnect-cookiebot` | **Date**: 2026-10-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/086-preconnect-cookiebot/spec.md`

## Summary

Add `<link rel="preconnect" href="https://consentcdn.cookiebot.com" crossorigin>` to every built page, in front of the
Cookiebot consent script. The build step that already writes the Cookiebot script into each page's head
(`scripts/format-html.ts`) writes it too, so every page, including pages added later, gets it. The same-DOM check
ignores the new element the way it ignores the other injected elements.

## Technical Context

**Language/Version**: TypeScript (Bun build scripts)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Existing unit and e2e suites must still pass (same-DOM check, no hydration errors). One small unit check in
`tests/unit/build-output.test.ts` that built pages contain the hint (behavior, not wording).

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Performance Goals**: Lighthouse no longer reports a missing preconnect to `https://consentcdn.cookiebot.com`; LCP
improves by up to about 100 ms in the lab.

**Constraints**: Cookiebot script stays first script with unchanged attributes; hydration stays clean (spec 082); no line
of built HTML starts with `>`; straight quotes; license headers; Prettier formatting.

**Scale/Scope**: one constant and one replace in `scripts/format-html.ts`, one test, one documentation sentence

## Constitution Check

- Static export, Bun, no server code: pass.
- Markdown content pages: untouched.
- No `#top` links, no link underlines, always dark, straight quotes: pass; no visible markup or styles change.
- Performance standards (principle III): pass, this is a performance improvement.
- Tests for behavior only: pass; the check asserts presence of the hint, not copy.
- Spec first, issue-driven: this spec; the issue is #100.

Re-check after design: no change, still pass.

## Project Structure

### Documentation (this feature)

```text
specs/086-preconnect-cookiebot/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
└── checklists/requirements.md
```

No data model or contracts: no data and no new interface.

### Source Code (repository root)

```text
scripts/format-html.ts              # COOKIEBOT_PRECONNECT constant; written before COOKIEBOT_SCRIPT; ignored by assertSameDom
tests/unit/build-output.test.ts     # built pages contain the preconnect link
CLAUDE.md                           # build-step bullet mentions the preconnect link
```

## Design

- `COOKIEBOT_PRECONNECT = '<link rel="preconnect" href="https://consentcdn.cookiebot.com" crossorigin="">'`, exported
  next to `COOKIEBOT_SCRIPT`, with a comment citing spec 086.
- Step 6 of the formatter writes `<head>${COOKIEBOT_PRECONNECT}${COOKIEBOT_SCRIPT}${WHITESPACE_SCRIPT}...`, glued to the
  next tag like the scripts, so it adds no whitespace.
- `assertSameDom` removes `COOKIEBOT_PRECONNECT` along with the other injected pieces before comparing.
- Only `consentcdn.cookiebot.com` gets a hint. `consent.cookiebot.com` serves the first script, which the browser
  requests immediately, so a hint there gains nothing.
