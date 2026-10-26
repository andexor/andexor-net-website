# Implementation Plan: Link Color

**Branch**: `87-implement-cookiebot` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/080-link-color/spec.md`

## Summary

Make `--blue-300` the one link color, taken from `--text-link`, on every page. The darker `--blue-400` comes from local
overrides of `--text-link` in `.an-prose` and `.an-tile` and from a literal `--blue-400` on the not-found intro links;
removing them leaves the site-wide `--text-link: var(--blue-300)` already in `src/styles/tokens/colors.css`. Links in
running text get `font-weight: 600` as the cue that is not color, since `--blue-300` is only 2.02:1 from the body text
(tested: axe is clean on eight built pages with the weight and fails `link-in-text-block` without it). The footer
copyright line, column links, and Do Not Sell or Share link, and the Contact Us popup's Privacy and Terms links, switch
to `--text-link`. One shared hover token, `--text-link-hover: var(--blue-200)`, replaces the mix of hover colors.

## Technical Context

**Language/Version**: CSS, in the existing style sheets

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: the existing axe accessibility tests (`homepage-a11y`, `content-page-a11y`, `contact-popup-a11y`); no new
test (spec FR-007: no tests for colors). A throwaway axe script over the built pages is used as an extra check.

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Performance Goals**: none

**Constraints**: no link underline at rest, on hover, or on focus; focus ring unchanged; always dark; straight quotes;
`--blue-300` is 8.82:1 on the page, 7.86:1 on cards, and 8.18:1 on the footer (all above 4.5:1)

**Scale/Scope**: edits to `colors.css` (one token), `content.css`, `cards.css`, `marketing.css`

## Constitution Check

- Static export, Bun, no server code: pass.
- Design tokens: pass; the colors come from `--text-link` and one new token, `--text-link-hover`, in the always-dark
  alias block of `src/styles/tokens/colors.css`. `design/tokens/` is not touched (it follows the OS setting and differs
  from the site on purpose).
- No link underlines, no `#top` links, straight quotes, always dark: pass; the only added cue is weight.
- Tests for behavior, not colors: pass; no test is added or changed.
- Accessibility (WCAG 2.1 AA): pass by test; see research.md.
- Readable Prettier output: pass; CSS only.
- Spec first, issue-driven: spec exists; issue is #87, as on the branch.

Post-design re-check: pass, no violations; Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/080-link-color/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md            (from /speckit-tasks)
```

`data-model.md` and `contracts/` are not needed: no data and no interface change.

### Source Code (repository root)

```text
src/styles/tokens/colors.css  (add --text-link-hover: var(--blue-200) to the always-dark block)
src/styles/content.css        (.an-prose: drop the --text-link override; links get weight 600; hover uses the token;
                               update the comment that explains the old 3:1 reasoning)
src/styles/cards.css          (.an-tile and the not-found intro links: same; the intro links use --text-link)
src/styles/marketing.css      (footer copyright, column links, Do Not Sell link: --text-link, hover token;
                               popup note links: --text-link, weight 600, hover token; new-tab icon color follows)
```

**Structure Decision**: edit the existing rules in place; no new files.
