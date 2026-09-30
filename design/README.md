# Handoff: Andexor Network Design System and Marketing Homepage

## Overview
The Andexor Network design system: tokens, React primitives, brand assets, and a high-fidelity marketing homepage with a Contact Us popup. Use this bundle as the reference when building Andexor Network sites and apps in Claude Code.

## File extensions
Source files in `components/` and `ui_kits/` carry an extra `.txt` extension (`Button.jsx.txt`, `Button.types.ts.txt`) so they are not compiled into the live design system. Strip `.txt` when copying them into a codebase. The HTML previews load them as is.

## About Us the design files
Files in this bundle are **design references created in HTML/React (Babel in the browser)**. They show intended look and behavior. They are not production code to ship as is. Recreate them in the target codebase's environment (React, Next.js, Astro, etc.) using its patterns. If no codebase exists yet, Next.js or Astro with plain CSS custom properties is a good fit, since all tokens are already CSS variables.

The token CSS (`styles.css`, `tokens/*.css`, `components/components.css`) **can** be copied directly into production.

## Fidelity
**High fidelity.** Final colors, type, spacing, copy, and interactions. Recreate pixel-accurately.

## Brand and copy rules (locked, apply everywhere)
- **Fonts:** Play (headings, 400 and 700 only, never 500/600) · Roboto (body/UI, 400/500/700) · Source Code Pro (mono, eyebrows, metrics, 400/500/600). Google Fonts; self-host for production.
- **Never use italics** for anything. Emphasize with weight, color, or caps.
- **No periods on headline phrases.** Keep one only if the headline is a full sentence.
- **Oxford comma always:** "web, SEO, and AI".
- **Avoid dashes in copy** (em, en, spaced hyphen). Split sentences or use a comma.
- **Never "&" for "and"** in reader-facing copy.
- **Hex colors UPPERCASE** everywhere (`#EAAA00`).
- **No emoji.** Icons are Lucide line icons (2px stroke). Eyebrows are UPPERCASE mono, optionally prefixed `>>`.
- Headlines and buttons use sentence case, except the brand CTA label "Contact Us".
- Voice: "we" to "you", confident, precise, measured claims, no hype.

## Screens / views

### 1. Marketing homepage (`ui_kits/marketing-site/index.html`)
Sections in order: Hero → Services → CTA band → Footer. No sticky header. Section vertical padding is `--section-y`, **32px (Compact, the default)**; hero top/bottom padding 29px.

**Hero**
- Full-width, background `--surface-ink` (`#002855`). Overlay: engineering grid of 1px `rgba(255,255,255,0.04)` lines on 48px cells, opacity 0.5, masked by `radial-gradient(ellipse 80% 70% at 70% 0%, #000 30%, transparent 75%)`.
- Inner container max 1320px, horizontal padding 24px.
- Brand row (flex, gap 22px, centered): gold logo `assets/logo/logo-gold.svg` at `clamp(72px, 9vw, 112px)` square, then "Andexor Network" in Play 700, `clamp(32px, 4.4vw, 54px)`, line-height 1, tracking -0.02em, `#FFFFFF`. Behind the logo, a 420px Old Gold radial glow: `radial-gradient(circle, color-mix(in srgb, #EAAA00 22%, transparent), transparent 65%)`, positioned left -150px, vertically centered.
- H1 "Enterprise-grade services at small business prices": Play 700, `clamp(38px, 5vw, 60px)`, line-height 1.04, tracking -0.02em, white, max-width 14em, `text-wrap: balance`, margin-top 40px.
- Subhead "Andexor Network designs, builds, and manages solutions to help your business grow.": Roboto 19px/1.55, `--blue-200` (`#C5D8EF`), max-width 22em, margin-top 20px.
- Button "Contact Us": accent (gold), size lg, trailing arrow-right icon 18px, margin-top 30px. Opens Contact Us popup.

**Services** (`#services`)
- Container max 1320px, padding `var(--section-y) 24px`.
- Header block max 620px. H2 "Four disciplines, all in one place": Play 700, `clamp(30px,3.6vw,42px)`, tracking -0.02em, color `--text-heading` (`#002855`). Lede "Web, SEO, AI, and marketing under one roof.": 18px/1.55, `--text-body` (`#334155`), margin-top 14px.
- Grid: `repeat(auto-fit, minmax(250px, 1fr))`, gap 18px, margin-top 40px.
- Card (DS `Card` with `hover`): white, 1px `#E2E8F0` border, radius 16px, `--shadow-sm`; hover lifts 2px, `--shadow-lg`, border `#C5D8EF`. Rendered as a link.
  - Top row (space-between, margin-bottom 16px): 44px icon tile, radius 11px, bg `#F3F7FC`, icon 22px `#013A73`; right, `Badge` (brand or accent tone).
  - Title Play 700 20px, margin-bottom 6px. Body 14px/1.55 `#334155`, margin-bottom 14px.
  - Bullets: flex column, gap 7px; 13px text; check icon 15px in `--gold-600` (`#C08C00`).
- Content:
  1. `code-2` · Web (brand) · **Web Development** · "We'll create or update your site with a strong technical foundation to handle an increase in traffic and sales." · Brochure site, blog, forms, shop / Content management system / Web application
  2. `search` · SEO (accent) · **Technical SEO** · "We'll assess your site's structure and brand identity, then improve visibility in search engines and AI agents." · Site audit / Content strategy / Maps, social media
  3. `bot` · AI (brand) · **Agentic Systems** · "We'll build the agents you need so you can adapt to emerging trends as AI agents handle business transactions." · Knowledge Base / Digital assistant, scheduling / Workflow automation
  4. `line-chart` · Growth (accent) · **Growth Marketing** · "Campaigns made for impact, from brand awareness to lead generation to closed sales, with continuous monitoring." · Newsletters, branded email / Social media marketing / Paid advertising

**CTA band**
- Container max 1200px, padding `0 24px var(--section-y)`.
- Panel: bg `#002855`, radius 24px, padding 56px 48px, flex space-between, align center, gap 32px, wraps.
- H2 "Let's talk about your needs and explore solutions, then plan the way forward.": Play 700, `clamp(28px,3.4vw,40px)`, line-height 1.1, white, max-width 12.28em.
- "Contact Us" accent lg button with arrow. A 320px gold radial glow (same gradient as hero) is centered **on the button**.

**Footer**
- bg `--blue-900` (`#001B3A`). Grid `1.4fr repeat(3, 1fr)`, gap 32px, padding 56px 24px 28px; stacks on narrow screens.
- Col 1: logo lockup (light), tagline "Enterprise-grade services / at small business prices" 14px/1.6 `#8FB6E2`; social icon buttons (LinkedIn, Twitter, GitHub) 34px square, radius 8px, 1px `#013A73` border, icon 16px `#C5D8EF`.
- Column headings: Source Code Pro 11px, tracking 0.14em, uppercase, `--gold-400` (`#F4BD2E`).
  - TECHNICAL SERVICES: Web Development, Web Hosting, Technical SEO, Agentic Systems
  - BUSINESS SERVICES: Cost Reduction, Lead Generation, Growth Marketing, Process Re-engineering
  - COMPANY: About Us, Contact
- Links 14px `#C5D8EF`, hover `#FFFFFF`.
- Bottom bar: 1px `#002855` top border; 13px `#4A8BD0`; "© 2026 Andexor Network, Inc. All rights reserved." left; Privacy, Terms right (gap 20px).

### 2. Contact Us popup (`ui_kits/marketing-site/contact-us.html` shows both states)
- Scrim: fixed, `rgba(0,19,43,0.55)`, `backdrop-filter: blur(3px)`, z-index 60, centers the panel with 24px padding. Clicking the scrim closes.
- Panel: `min(480px, 100%)`, bg `--blue-500` (`#1766B4`), radius 18px, `--shadow-xl`.
- Header: bg `#002855`, padding 22px 24px, flex gap 12px. 260px gold radial glow top-left (offset -110px). Boxed logo 34px, radius 8px. Title "Contact Us" Play 700 30px/34px white. Close (x, 20px, `#C5D8EF`) at right.
- **Form state** (padding 24px, column, gap 14px). Labels in `--blue-100` (`#E7EFF8`):
  - Full name (placeholder "Jordan Reyes", required)
  - Work email (email, "you@company.com", required)
  - Company website ("company.com", required)
  - Primary need (select, required). Placeholder "Select a service…". Group "Technical Services": Web Development, Web Hosting, Technical SEO, Agentic Systems. Group "Business services": Cost Reduction, Lead Generation, Growth Marketing, Process Re-engineering. Then "Something else".
  - "Send" accent button, block, lg, arrow-right icon.
  - Note "No obligation. We never share your personal information." 12px `#E7EFF8`, centered.
- **Request received state** (padding 40px 28px, centered): 56px circle bg `--success-100` (`#D7F0E3`) with 28px check `--success-600` (`#167A4F`); H3 "Request received" 22px white; body "Thanks for reaching out. A strategist will review your site and contact you soon." 14px/1.55 `#E7EFF8`, max 34ch; "Done" primary button, margin-top 22px, closes.

## Interactions and behavior
- Every "Contact Us" button opens the popup. Reopening resets to the form state.
- Submit uses native `required` validation; on submit, prevent default and switch to Request received (wire to a real endpoint in production).
- Buttons: 0.15s ease color transitions; hover primary → `#013A73`, accent → `#F4BD2E`; active translates 1px down (primary `#001B3A`, accent `#C08C00`).
- Cards: 0.18s ease lift.
- Focus: `:focus-visible` gold halo `0 0 0 3px rgba(234,170,0,0.45)`.
- Responsive: fluid `clamp()` type; service grid auto-fits; CTA band and footer wrap/stack. No fixed heights on text boxes.
- Dark mode follows the OS (`prefers-color-scheme`) only; the semantic aliases in `tokens/colors.css` flip. No in-app toggle.
- The Tweaks panel in `App.jsx` (Signal color, Dark canvas, Rhythm) is a design exploration tool. Do not build it in production; use the defaults: gold, blue, compact.

## State
- `contactOpen: boolean` (page level).
- Popup: `sent: boolean`, reset to false on open.

## Design tokens
All tokens are CSS custom properties in `tokens/`. Also exported as `design-tokens.json`. Full spec in `DESIGN.md`.
- **Brand:** Andexor Blue `#002855` (`--blue-800`), Old Gold `#EAAA00` (`--gold-500`). Gold is an accent only; for gold text on light use `--gold-700` `#9C7100`.
- **Blue:** 950 `#00132B` · 900 `#001B3A` · 800 `#002855` · 700 `#013A73` · 600 `#0A4F93` · 500 `#1766B4` · 400 `#4A8BD0` · 300 `#8FB6E2` · 200 `#C5D8EF` · 100 `#E7EFF8` · 50 `#F3F7FC`
- **Gold:** 800 `#7A5900` · 700 `#9C7100` · 600 `#C08C00` · 500 `#EAAA00` · 400 `#F4BD2E` · 300 `#F8D066` · 200 `#FBE4A3` · 100 `#FDF2D4` · 50 `#FEF9EA`
- **Slate:** 900 `#111A2B` · 700 `#334155` · 500 `#64748B` · 400 `#94A3B8` · 300 `#CBD5E1` · 200 `#E2E8F0` · 100 `#F1F5F9` · 50 `#F8FAFC`
- **Status:** success `#1F8A5B` · warning `#EAAA00` · danger `#D33A2C` · info `#1766B4`
- **Medal set (diagrams):** gold `#EAAA00` · silver `#CBD5E1` · bronze `#D49A6A` · maroon `#7B1E26`; edge/glow colors gold `#FFD23D`, silver `#8FE9FF`, bronze `#FF9A4D`, maroon `#FF2F52` (`--glow-*` shadows ready made)
- **Type scale (px):** 11 · 12 · 14 · 16 (base) · 18 · 22 · 28 · 36 · 48 · 60 · 76. Leading 1 / 1.12 / 1.28 / 1.5 / 1.65. Caps tracking 0.14em.
- **Spacing:** 4px base: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128. Containers 640 / 768 / 1024 / 1200 / 1320.
- **Radii:** 3 · 5 · 8 · 12 · 16 · 24 · 999. Cards 16, buttons 8, CTA bands 24.
- **Shadows:** blue-tinted `rgba(0,19,43,α)`, `--shadow-xs` to `--shadow-xl`. Cards rest `sm`, hover `lg`, modals `xl`.

## Components (`components/`)
Each has `<Name>.jsx` (reference implementation), `<Name>.types.ts` (props), and `<Name>.prompt.md` (usage notes). Styling classes live in `components/components.css`.
- **Button:** variant primary / secondary / ghost / accent; size sm / md / lg; `block`, `onInk`, `leftIcon`, `rightIcon`, `as`/`href`. Accent (gold) is reserved for the single highest-intent action.
- **IconButton**, **Input** (label, hairline border, gold focus halo), **Switch**
- **Badge** (tone neutral / brand / accent / success / warning / danger / info, optional dot), **Tag**, **Card** (`hover`, `ink`, `pad`; never a colored left-border accent), **Avatar**, **Stat** (Play value + mono label)

## Assets
- `assets/logo/andexor-logo.svg`: primary boxed mark, Blue and Old Gold, BIMI compliant
- `assets/logo/logo-gold.svg`: Old Gold on transparent, for dark surfaces (hero, header)
- `assets/logo/logo-outline.svg`: line variant
- `assets/favicon/`: full favicon set with `site.webmanifest` and `browserconfig.xml`
- Icons: Lucide `0.460.0` (CDN in the reference; install `lucide-react` in production)

## Files
- `styles.css`: single entry, imports all tokens and component CSS
- `tokens/`: colors, typography, spacing, elevation, base
- `design-tokens.json`: tokens as JSON
- `DESIGN.md`: full design system specification
- `components/`: primitives (see above)
- `_ds_bundle.js`: prebuilt bundle so the reference HTML previews run
- `ui_kits/marketing-site/index.html`: homepage (open in a browser to preview)
- `ui_kits/marketing-site/contact-us.html`: popup, both states
- `ui_kits/marketing-site/*.jsx`: `Hero`, `Services`, `CTA`, `Footer`, `ContactUs`, `Icon` (Lucide wrapper and logo lockup), `App` (composition). `Header`, `Results`, and `Testimonial` are legacy sections, loaded but not rendered.

## Suggested Claude Code setup
Put this folder in your repo (for example `/design`) and add to your repo's `CLAUDE.md`:
```
Follow design/README.md and design/DESIGN.md for all UI. Use the CSS variables in design/tokens. Obey the brand and copy rules in design/README.md.
```
