# Implementation Plan: Footer "Contact Us" Opens the Contact Form

**Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/014-footer-contact-us/spec.md`

## Summary

The Contact Us popup and its open/close state live only in the home page (`src/app/page.tsx`), and the
footer's "Contact" is a `#contact` placeholder link. The footer is shared by the home page, the
Markdown content pages, and the not-found page, so the popup has to be available everywhere the
footer is (spec, User Story 3, option A). The plan moves the popup and its state into one client
component, `ContactProvider`, mounted once in the root layout. It exposes `useContact()`, which
returns `openContact()`. The home page's hero and call-to-action band use it instead of local state,
and the footer's second Company entry becomes a small client button, `FooterContactButton`, labeled
"Contact Us", that calls it. The provider remembers which element had focus when the popup opened
and gives focus back when it closes (FR-004). `Footer` itself stays a server component, so content
pages stay static Markdown pages. No new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`)

**Primary Dependencies**: none added (React context only)

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change; the popup renders nothing while closed, as today, so pages gain
one small client component and no extra markup

**Constraints**: one popup instance per page (no duplicate dialogs); the popup itself is unchanged
(fields, validation, confirmation, ways to close); footer look unchanged; no link underlines; the
footer entry is a `<button>`, not a link; Footer must still render on server-rendered content pages

**Scale/Scope**: 2 new components, 4 edited components (`layout.tsx`, `page.tsx`, `Footer.tsx`, CSS),
2 unit tests edited, 3 e2e specs edited, spec 001 and spec 010 amended

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. One context with one function, justified by FR-005 (popup on every page with the footer). No state library, no portal library, no route change. |
| II. Component stack | Pass. React context in a Next.js static export; nothing else. |
| III. Accessibility & performance | Pass. A real `<button>` with `aria-haspopup="dialog"` (FR-006), keyboard operable, visible focus ring, focus returned to it on close (FR-004). The popup is not rendered while closed, so no page weight or reading-order impact. |
| IV. Design & content consistency | Pass. The footer button reuses the `an-footer__col-link` look; one shared popup replaces per-page copies. |
| V. Test-first | Pass. Tests are written first and fail until the change. |
| VI. Always-dark, no link underlines | Pass. The button is styled like the other footer entries: color change on hover, focus ring, no underline. `no-hover-underline.test.ts` still runs. |
| VII. Graceful shutdown | Not affected; the usual Docker check still applies. |
| VIII. Markdown-authored pages | Pass. The popup lives in the root layout, not in page content; `content/` pages stay Markdown and `[...slug]/page.tsx` is unchanged. |
| License header | New `.tsx` files get the SPDX header. |

No violations; Complexity Tracking is empty. No constitution change.

## Project Structure

### Documentation (this feature)

```text
specs/014-footer-contact-us/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── contact-us-action.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/components/contact/ContactProvider.tsx       # new: context, one ContactPopup, focus return, useContact()
src/components/marketing/FooterContactButton.tsx # new: "Contact Us" button for the footer (client)
src/components/marketing/Footer.tsx              # edit: label "Contact Us"; render the button for it
src/app/layout.tsx                               # edit: wrap children in ContactProvider
src/app/page.tsx                                 # edit: use useContact(); drop local state and ContactPopup
src/styles/marketing.css                         # edit: reset button styles for .an-footer__col-link
server.ts                                        # edit: decode the URL path so [...slug] chunks are served (found while building)

tests/
├── unit/contact-provider.test.tsx               # new: opens popup, returns focus, throws outside provider
├── unit/content-links.test.tsx                  # edit: wrap Footer renders in ContactProvider
├── unit/logo.test.tsx                           # edit: wrap Footer and NotFound renders in ContactProvider
├── unit/not-found.test.tsx                      # edit: wrap NotFound renders in ContactProvider
├── e2e/static-server.spec.ts                    # new: every script/style loads; no path escapes out/
├── e2e/footer-links.spec.ts                     # edit: Contact is no longer a placeholder
├── e2e/footer-contact.spec.ts                   # new: opens from /, /web-development, /nope; focus returns
└── e2e/contact-flow.spec.ts                     # edit: CTA-band test must not use .last()

specs/001-homepage-contact-us/{spec.md,contracts/ui-contracts.md}   # edit: popup is app-wide
specs/010-footer-page-links/spec.md                                 # edit: Contact no longer a placeholder
```

**Structure Decision**: Existing single Next.js project; two small new components beside their peers.

## Design Decisions

- **Provider in the root layout.** `layout.tsx` is a server component and can render a client
  component around `children`. This puts one popup on every page, including the not-found page,
  without touching `ContentPage` or the Markdown route.
- **Footer stays a server component.** Only the button is a client component
  (`FooterContactButton`), so `Footer` keeps rendering during the static build for content pages.
- **A `<button>`, not a link.** It opens a dialog and does not navigate (FR-003, FR-006). It reuses
  the `an-footer__col-link` class with a small CSS reset (no background, border, or padding;
  inherited font; pointer cursor; left aligned).
- **`useContact()` throws outside a provider.** A silent no-op default would hide a footer that
  is rendered without a popup. Unit tests that render `<Footer />` wrap it in `ContactProvider`.
- **Focus return.** On open, the provider stores the `opener` it was given, or else
  `document.activeElement`; the footer button passes itself, since Safari and Firefox on macOS do not
  focus a button on click. On close it clears the popup and, in an effect that runs after the popup has
  unmounted, calls `focus()` on the stored element if it is still in the document. This applies to all
  three triggers. The popup's own focus behavior on open is unchanged.
- **The home page switches to the shared state.** If `page.tsx` kept its own `ContactPopup`, the
  home page would have two dialogs. It now calls `useContact().openContact` for the hero and the
  call-to-action band.
- **Escape is added separately.** Closing on Escape is specified and built in spec 015; it lives inside
  `ContactPopup`, so it works with this provider unchanged.

## Complexity Tracking

None.
