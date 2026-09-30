# Research: Footer "Contact Us"

## Decision 1: One popup in the root layout, shared through React context

- **Decision**: Add `ContactProvider` (client) that holds `open` state and renders one
  `<ContactPopup>`. Mount it in `src/app/layout.tsx` around `children`. Expose `useContact()`.
- **Rationale**: The footer is rendered by three different shells (home page, `ContentPage`, and the
  not-found page through `ContentPage`), and the popup has to open on the same page (spec option A).
  The one place all three share is the root layout.
- **Alternatives considered**:
  - The footer owns its own popup. Rejected: the home page would have two popups (its own and the
    footer's) that can drift apart, against "the same popup".
  - Each shell wraps itself in a provider. Rejected: three copies of the same wiring.
  - A global store library. Rejected: one boolean does not need one.

## Decision 2: The footer entry is a client button inside a server-rendered footer

- **Decision**: New `FooterContactButton` ("use client") calls `useContact().openContact`.
  `Footer.tsx` renders it for the "Contact Us" item and keeps rendering links for the rest.
- **Rationale**: `Footer` is imported by a server component (`ContentPage`) and a client page. Keeping
  it a server component means content pages stay fully static, with only the button hydrated.
- **Alternatives considered**: Make all of `Footer` a client component. Rejected: more JavaScript for
  every content page for one button.

## Decision 3: `<button>` with `aria-haspopup="dialog"`, styled like the other entries

- **Decision**: Render `<button type="button" className="an-footer__col-link" aria-haspopup="dialog">`.
  Add a CSS reset to `.an-footer__col-link` for buttons. Hover stays the existing color change.
- **Rationale**: FR-006 says it must be announced as opening a dialog, not as a link. Reusing the class
  keeps FR-007 (same look) and the no-underline rule with no new styles.
- **Alternatives considered**: `<a href="#contact" onClick=...>`. Rejected: a link with a fake address
  is announced as navigation, and an address change or jump is the exact thing FR-003 forbids.

## Decision 4: Hook throws outside a provider

- **Decision**: `useContact()` throws a clear error when there is no provider.
- **Rationale**: A default no-op would let a footer render in a tree with no popup and do nothing when
  activated, which is the bug this feature fixes.
- **Alternatives considered**: A no-op default. Rejected as above. This means `tests/unit/content-links.test.tsx`
  and `tests/unit/logo.test.tsx` must wrap `<Footer />` in the provider.

## Decision 5: Return focus in the provider, for every trigger

- **Decision**: `openContact(opener?)` records the element to return to: the `opener` if given, else
  `document.activeElement`. The footer button passes itself (`event.currentTarget`), because Safari and
  Firefox on macOS do not focus a button when it is clicked, so `activeElement` would be `body` there.
  Closing sets `open` to false; an effect that runs after the popup has unmounted then focuses the
  recorded element if it is still connected.
- **Rationale**: Today the popup has no focus management at all. Closing it from the close button
  unmounts the focused button and focus falls to the page. FR-004 needs the footer entry to get focus
  back, and the mechanism cannot tell one trigger from another.
- **Alternatives considered**: Return focus only for the footer button. Rejected: extra code to
  special-case it. Add a focus trap. Rejected: outside this request. (Escape-to-close is added by spec 015.)

## Decision 6: Keep existing tests from silently changing target

- **Decision**: `tests/e2e/contact-flow.spec.ts` line 22 finds the CTA band button with
  `getByRole("button", { name: "Contact Us" }).last()`. With a third button in the footer, `.last()`
  becomes the footer button. Scope it to the CTA band section instead.
- **Rationale**: The test would still pass, and it would prove the wrong thing.
- Other tests use `.first()`, which is still the hero button.

## Findings from the code

- `page.tsx` is a client component owning `contactOpen`; `Hero` and `CTABand` take `onContactClick`.
- `Footer` is used by `page.tsx` and `ContentPage.tsx` (which also serves `not-found.tsx`).
- `ContactPopup` renders `null` when closed, had no Escape handler when this was written (spec 015 adds one), and does not manage focus.
- The footer's "Contact" is `#contact` from the `slugify` fallback; nothing has `id="contact"`.
- `tests/e2e/footer-links.spec.ts` and spec 010 assert that "Contact" is a placeholder; both change.
- `tests/unit/content-links.test.tsx` and `tests/unit/logo.test.tsx` render `<Footer />` standalone.
- The link-style e2e and `no-hover-underline` unit tests look at `a` and CSS, so a `<button>` styled
  through the same class needs its own hover-underline check in the new e2e.

## Decision 7: Fix `server.ts` so content pages hydrate (found while building)

- **Finding**: `server.ts` looked files up with the percent-encoded URL path, so
  `/_next/static/chunks/app/%5B...slug%5D/page-*.js` (the route chunk for every Markdown page and the
  not-found page) returned 404. Those pages never hydrated. It was invisible until now because they
  had no client-side behavior; with `ContactProvider` in the layout, the footer button did nothing there.
- **Decision**: Decode the path (`decodeURIComponent`, treating a malformed escape or a NUL byte as
  not found) and refuse any resolved path outside `out/`, since decoding can produce `..` segments.
- **Rationale**: This is the Docker runtime server, so the bug was in production too. A test that loads
  every script and stylesheet on `/`, `/web-development`, and `/nope` failed before the fix (3 failures)
  and passes after it; a second test checks that `..%2f` and malformed paths return 404.
- **Alternatives considered**: Rename the catch-all route to avoid brackets. Rejected: the route
  name is the framework's convention and would change every content page's build output.

## Additional findings while building

- Unit tests that render the not-found page (`tests/unit/not-found.test.tsx`, and one test in
  `tests/unit/logo.test.tsx`) also render the footer, so they needed the provider too.

No open questions.
