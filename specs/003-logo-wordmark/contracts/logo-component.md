# Contract: `Logo` component

```tsx
interface LogoProps {
  light?: boolean;          // default false
  size?: "default" | "hero"; // default "default"
  href?: string;            // omitted => not a link
}
```

## Rendered output

- Link form: `<a href class="an-logo-lockup [modifiers]">` containing the mark and the wordmark.
- No-link form: `<div class="an-logo-lockup [modifiers]">` with the same children.
- Mark: `<img src="/logo/logo-gold.svg" alt="">`.
- Wordmark: `<span class="an-logo-wordmark">Andexor Network</span>`, exactly one line of text.
- No element contains the text "Network, Inc.".

## Callers

| Caller | Props |
|--------|-------|
| `ContentPage` header | `href="/"` |
| `Footer` | `light` (no `href`, so it is not a link; amended by spec 008) |

The Contact Us popup header (`ContactPopup.tsx`) is not a caller: it shows the mark alone, without the
wordmark, so it uses `<img src="/logo/logo-gold.svg" alt="">` directly (spec 016).
`tests/unit/logo.test.tsx` pins the two files that may reference `logo-gold.svg`: `Logo.tsx` and
`ContactPopup.tsx`.
| `Hero` brand row | `size="hero"`, `light` (no `href`, so it is not a link) |

## Sizes

- `--logo-mark-size`: 38px (hero: `clamp(72px, 9vw, 112px)`).
- `--logo-wordmark-size`: 26px (hero: `clamp(32px, 4.4vw, 54px)`).
- Changing one never changes the other.

## Behavior

- The lockup's accessible name is "Andexor Network", announced once.
- At 320px width the lockup stays on one line with no horizontal page scroll.
- Hover changes color only; no underline.
