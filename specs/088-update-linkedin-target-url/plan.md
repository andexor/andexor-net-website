# Implementation Plan: Point the Footer LinkedIn Icon at the Company Page

**Branch**: `104-update-linkedin-target-url` | **Date**: 2026-11-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/088-update-linkedin-target-url/spec.md`

## Summary

Change the `href` of the LinkedIn entry in the footer's `SOCIAL_LINKS` list from `https://www.linkedin.com/in/ejenkins/`
to `https://www.linkedin.com/company/andexor/`. Nothing else changes.

## Technical Context

**Language/Version**: TypeScript, React (Next.js static export)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Existing e2e footer checks (`homepage-content.spec.ts`, `social-icon-names.spec.ts`, `social-icon-size.spec.ts`)
must still pass. No new test: the address is data, and a test of it would only repeat the constant.

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Constraints**: straight quotes; license headers; Prettier formatting; no link underline.

**Scale/Scope**: one string in `src/components/marketing/Footer.tsx`

## Constitution Check

- Static export, Bun, no server code: pass.
- Markdown content pages: untouched (`content/about-us.md` keeps the founder's personal link on purpose).
- No `#top` links, no link underlines, always dark, straight quotes: pass; no markup or styles change.
- Tests for behavior only, none for copy or constants: pass.
- Spec first, issue-driven: this spec; the issue is #104.

Re-check after design: no change, still pass.

## Project Structure

### Documentation (this feature)

```text
specs/088-update-linkedin-target-url/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
└── checklists/requirements.md
```

No data model or contracts: no data and no new interface.

### Source Code (repository root)

```text
src/components/marketing/Footer.tsx   # SOCIAL_LINKS linkedin href
```

## Design

- Replace the `href` value only. The `label`, `key`, and icon stay, so the accessible name, the size rule in
  `src/styles/marketing.css`, and the new-tab behavior are unchanged.
- Earlier specs (042, 044, 061) record the old address as history and are not edited.
