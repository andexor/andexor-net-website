# UI Contracts: Homepage and Contact Us Popup

This feature has no server/API surface (see `data-model.md`). The interface contracts that
matter are the component boundaries within the page, since other future features (e.g. a real
contact-request backend) will need to plug into them without reworking the UI.

## Page composition contract

The homepage is a single page composed of four sections, rendered in this fixed order, each an
independent component with no required props beyond static content:

```text
<RootLayout>
  <ContactProvider>            // renders the one <ContactPopup>; exposes useContact().openContact
    <HomePage>
      <Hero onContactClick={() => openContact()} />
      <Services />
      <CTABand onContactClick={() => openContact()} />
      <Footer />               // its "Contact Us" <button> also calls openContact (spec 014)
    </HomePage>
  </ContactProvider>
</RootLayout>
```

- `Hero`, `CTABand`, and the footer each expose a "Contact Us" action; all MUST call the same
  `openContact` (FR-007: every Contact Us CTA opens the same popup).
- Popup open/close state lives in `ContactProvider` in the root layout (spec 014; it was page-level
  state in `HomePage` before), not inside `Hero`/`CTABand`, so the popup is available on every page.

## ContactPopup component contract

Mirrors the design reference (`design/ui_kits/marketing-site/ContactUs.jsx.txt`):

**Props**:

| Prop | Type | Required | Behavior |
|---|---|---|---|
| `open` | boolean | Yes | Whether the popup is rendered/visible |
| `onClose` | `() => void` | Yes | Called on ×, scrim click, Esc, or "Done" click |
| `onSubmit` | `(request: ContactRequest) => void` | No | Optional hook for a future feature (e.g. real backend delivery) to observe a validated submission; this feature does not require a consumer to pass one, and the component MUST still show the confirmation state if omitted |

**Internal state**: `sent: boolean`, reset to `false` whenever `open` transitions from `false` to
`true` (FR-013 — reopening always shows the empty form, never a stale confirmation).

**Behavior contract** (drives acceptance tests in `quickstart.md`):

1. Rendering with `open=false` renders nothing (no DOM node, not just hidden).
2. Rendering with `open=true` and `sent=false` renders the form with fields: full name, work
   email, company website, primary need (all `required`).
3. Submitting the form with all required fields valid MUST call `onSubmit` (if provided) with
   the `ContactRequest` values, then set `sent=true`, replacing the form with the confirmation
   view. It MUST NOT perform a network request itself (FR-018).
4. Submitting with any required field empty/invalid MUST NOT transition to the confirmation
   view; the browser's native validation UI indicates the offending field (FR-010).
5. Clicking ×, the scrim, pressing Esc (spec 015), or (in the confirmation view) "Done" MUST call `onClose` and MUST NOT
   itself flip `sent` back to `false` — the reset happens on next open, per point above.

## Extension seam for a future backend

`onSubmit` is the intended integration point for a later feature that delivers contact requests
to a real destination (CRM, email, etc.). This feature ships without wiring anything to it
(consistent with FR-018); a future feature can add a consumer of `onSubmit` without changing
`ContactPopup`'s public contract.
