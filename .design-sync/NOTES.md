# Design sync notes

- The design system lives in Claude, as the artifact https://claude.ai/artifact/QRWK39XmFsbB88qgBEbtkU (made from the
  Design System type). On 2026-11-04 its `components/` (bundle, previews, READMEs), `tokens.json`, `tokens.css`, and
  `fonts/` were built from this folder: the previews here, and a bundle of `entry.tsx`'s components plus the design
  system's own Avatar, Stat, Tag, IconButton, and Switch, with the token declarations left out of the CSS. The
  `projectId` in `config.json` is a standalone Claude Design project from the same run; standalone Claude Design closes
  by 2026-12-14, so don't sync to it.
- No Storybook and no built package: the bundle entry is `.design-sync/entry.tsx`, a barrel that re-exports the site's
  components from `src/components/` and imports `.design-sync/site.css`. Add a component by exporting it there and
  adding it to `componentSrcMap`.
- ContactPopup and ContactProvider are left out on purpose: their Send button posts a real request to
  `https://andexor.net/api/contact`. Cookiebot pieces (CookiebotEscape, PrivacySettingsLink, CookieDeclaration) and the
  content-page plumbing are left out too.
- `.design-sync/site.css` mirrors `src/styles/globals.css` with three changes: fonts declared with relative paths (the
  bundler inlines them as data URLs) and the font variables set unconditionally, because the site's `fonts.css` hides
  `<body>` until the loader script in `layout.tsx` runs; the Logo image (`/logo/logo-gold.svg`, an absolute path that
  does not exist in Claude Design) supplied with `.an-logo-mark { content: url(...) }`; `content.css` and `cards.css`
  left out (absolute `/images/` URL, and no synced component uses them).
- There is no `.d.ts` tree (no `types` in package.json), so every component's props are hand-written in
  `dtsPropsFor`, copied from the source interfaces.
- UI components are grouped `ui` through the category-only stub `.design-sync/docs/ui-group.md` (`src/components/ui`
  is otherwise treated as a generic folder and lands in `general`).
- The preview frame paints a white body; every preview wraps its cells in `background: var(--surface-page)` because the
  site is always dark.
- Card modes: Services, Footer, Hero are `single` with a desktop viewport; CTABand and Logo are `column`.
- Playwright: the repo's `@playwright/test` 1.64.1 matches the cached chromium-1248; `.ds-sync` installs
  `playwright@1.64.1` to match.

## Known render warns

- None open.

## Re-sync risks

- `dtsPropsFor` is a copy of the props in `src/components/ui/*.tsx` and `src/components/marketing/*.tsx`. When a prop
  is added, renamed, or removed there, update it here or the design agent codes against a stale API.
- `.design-sync/site.css` duplicates the import list and the `@font-face` rules of `src/styles/globals.css` and
  `fonts.css`. A new stylesheet, a renamed font file, or a new font must be mirrored here.
- The Logo image shim depends on the class `an-logo-mark` and the file `public/logo/logo-gold.svg`.
- Footer and Services render the site's live copy (link lists, service data); their previews change whenever that
  copy does, which re-grades them.
- `.design-sync/conventions.md` names tokens and classes; re-validate them against the build after token changes.
