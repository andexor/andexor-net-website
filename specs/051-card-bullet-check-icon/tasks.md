---

description: "Task list for Card Bullet Check Icon"
---

# Tasks: Card Bullet Check Icon

**Input**: Design documents from `/specs/051-card-bullet-check-icon/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of cards or bullets. Playwright
specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/marketing/Services.tsx` the bullet icon is Lucide
  `<Check size={15} aria-hidden="true" className="an-services__bullet-icon" />`, and `Check` is the only
  `lucide-react` import in that file. In `src/styles/marketing.css`, `.an-services__bullet-icon` has
  `color: var(--gold-600)` and `flex: none`, and `.an-services__bullet` is a flex row with `gap: 8px`. Confirm
  `faCheck` is exported by `@awesome.me/kit-0a6c11d394/icons/duotone/solid`. Leave `src/components/contact/ContactPopup.tsx`
  alone (its Lucide `Check` is out of scope)

---

## Phase 2: User Story 1 - Bullets use the FontAwesome check (Priority: P1) MVP

**Goal**: Every bullet in the eight home page service cards starts with the FontAwesome duotone check, 15 by 15 pixels,
in the existing gold, hidden from assistive technology, with text position and card heights unchanged.

**Independent Test**: Open `/`: every bullet starts with the FontAwesome check, the same size and gold as before.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/card-bullet-check-icon.spec.ts` (with the SPDX header, no type annotations). On `/` at
  1440px and at 360px, for each `.an-services__bullet` (loop over what is found, never assert how many), read its `svg`
  and the bullet's text span, and assert: the `svg` has class `fa-check`; its box is 15 by 15 within 0.5px; its
  `aria-hidden` is `true`; its computed `color` equals the resolved `--gold-600` (set `style.color = "var(--gold-600)"` on a temporary element in the page and read its computed color); and the text span's left edge is within 1px of the `svg`'s right edge plus 8px
- [X] T003 Run `bun run test:e2e -- card-bullet-check-icon --project=chromium` and confirm T002 fails

### Implementation

- [X] T004 [US1] In `src/components/marketing/Services.tsx` replace the `import { Check } from "lucide-react";` line with
  `import { faCheck } from "@awesome.me/kit-0a6c11d394/icons/duotone/solid";` (merge it with the existing import from
  that module, keeping the imports sorted as Prettier leaves them), and replace the `<Check ... />` element with
  `<FontAwesomeIcon icon={faCheck} aria-hidden="true" className="an-services__bullet-icon" />`. Keep the element's
  place before the bullet text `<span>`. No `lucide-react` import remains in the file
- [X] T005 [US1] In `src/styles/marketing.css`, next to the other FontAwesome override rules (the block after the
  footer social icon rules, which follows the "Pattern for sizing a FontAwesome icon" comment), add
  `.svg-inline--fa.fa-check { height: 15px; width: 15px; }`. Plain pixels, because the list item has no size to
  inherit. Do not touch `.an-services__bullet-icon`
- [X] T006 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test; confirm they pass

**Checkpoint**: FontAwesome checks on all bullets.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T007 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass. Port 3000 must be free
- [X] T008 Build, serve, and look at `/` at 360, 768, and 1280 pixels: each bullet's check is gold with a lighter gold
  second layer, aligned with the first line of its text, same card heights, no overlap, no horizontal scrolling
- [X] T009 Grep `src/styles/*.css` for `underline`, `src/components/marketing/Services.tsx` for `lucide`, and the
  changed files for typographic quotes; walk through `quickstart.md`. Leave the work uncommitted for the owner to
  review

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 and T005 are different files and can be done together, but do both before T006.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
