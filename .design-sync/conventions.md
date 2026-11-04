# Andexor Network: how to build with this library

These are the real components of the andexor.net website (Andexor Network, Inc.). Build with them and the site's CSS
tokens; don't invent new colors, fonts, or class names.

## Setup

- Link `styles.css` once. It carries every token, the component CSS, and the brand fonts (Play for headings, Roboto
  for text, Source Code Pro for mono), inlined. No provider or wrapper component is needed.
- The site is **always dark**. `body` gets `background: var(--surface-page)` and `color: var(--text-body)` from the
  stylesheet; if you render inside your own container, give it `background: var(--surface-page)` or the text (light
  slate) will be unreadable. Never design a light theme.
- Components are on `window.AndexorNetwork`: `Badge`, `Button`, `Card`, `Input`, `Textarea` (UI) and `Logo`, `Hero`,
  `CTABand`, `Footer`, `Services` (page sections). `Hero`, `Footer`, and `Services` take no props and render the live
  site's copy; use them as they are for home-page designs.
- There is no Contact Us popup component in this library. For a contact form, compose `Input`, `Textarea`, and
  `Button variant="accent"`.

## Styling idiom: CSS custom properties

Style your own layout with `var(--*)` tokens (inline styles or your own CSS):

| Family | Names |
|---|---|
| Surfaces | `--surface-page`, `--surface-card`, `--surface-sunken`, `--surface-ink`, `--surface-ink-2`, `--surface-brand-soft`, `--surface-accent-soft` |
| Text | `--text-heading`, `--text-body`, `--text-muted`, `--text-subtle`, `--text-strong`, `--text-accent`, `--text-link`, `--text-link-hover` |
| Brand scales | `--blue-50` ... `--blue-950` (Andexor Blue is `--blue-800`), `--gold-50` ... `--gold-800` (Old Gold) |
| Borders | `--border-subtle`, `--border-default`, `--border-strong`, `--border-ink` |
| Spacing | `--space-1` ... `--space-32`, `--gutter`, `--section-y`, `--container-sm` ... `--container-2xl` |
| Type | `--font-display`, `--font-sans`, `--font-mono`, `--text-xs` ... `--text-6xl`, `--weight-regular` ... `--weight-bold`, `--leading-tight`, `--leading-normal` |
| Shape | `--radius-sm` ... `--radius-2xl`, `--radius-full`, `--shadow-sm` ... `--shadow-xl`, `--ring` |

Headings `h1`-`h5` already use `--font-display` and `--text-heading`.

## Brand rules that the agent must keep

- Links are never underlined, at rest or on hover. Hover is a color change (`--text-link` to `--text-link-hover`).
- Gold (`Button variant="accent"`) is for the one main call to action on a view, usually "Contact Us".
- Never link to `#top` and never add a back-to-top control. The `Logo` links only with `href="/"`, in content-page
  headers.
- Straight quotes only (' and "), never curly ones, in any text you write.

## Where the truth lives

`_ds_bundle.css` holds every token and component class (`an-btn`, `an-card`, `an-badge`, `an-input`, `an-hero`,
`an-cta-band`, `an-services`, `an-footer`). Each component's props are in `components/<group>/<Name>/<Name>.d.ts` and
examples in `<Name>.prompt.md`.

## Example

```jsx
const { Card, Badge, Button } = window.AndexorNetwork;

<section style={{ background: "var(--surface-page)", padding: "var(--section-y) var(--gutter)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-4)", maxWidth: "var(--container-lg)", margin: "0 auto" }}>
        <Card ink>
            <Badge tone="accent">New</Badge>
            <h3 style={{ margin: "var(--space-3) 0 var(--space-2)" }}>Agentic Systems</h3>
            <p style={{ margin: "0 0 var(--space-4)" }}>Agents that answer customers and handle routine work.</p>
            <Button variant="accent" size="sm">Contact Us</Button>
        </Card>
        <Card hover as="a" href="/web-hosting">
            <h3 style={{ marginBottom: "var(--space-2)" }}>Web Hosting</h3>
            <p style={{ margin: 0 }}>Fast, reliable servers that keep running when traffic spikes.</p>
        </Card>
    </div>
</section>
```
