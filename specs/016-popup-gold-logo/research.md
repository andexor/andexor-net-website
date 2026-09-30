# Research: Gold Logo in the Contact Us Popup

## Decision 1: Swap the image file, keep the popup's own `<img>`

- **Decision**: In `ContactPopup.tsx`, change the header image `src` from `/logo/andexor-logo.svg` to
  `/logo/logo-gold.svg`. Keep `alt=""` and the class `an-contact-header__logo`.
- **Rationale**: The request is to replace the logo, and the popup shows the mark by itself. The shared
  `Logo` component renders mark plus wordmark, which would change the header's look.
- **Alternatives considered**: Use `<Logo light />`. Rejected: it adds the "Andexor Network" wordmark
  next to a "Contact Us" title, which is a redesign, not a logo swap.

## Decision 2: Remove `border-radius: 8px` from `.an-contact-header__logo`

- **Decision**: Delete that declaration; keep `position`, `width: 34px`, and `height: 34px`.
- **Rationale**: The radius rounded the corners of the boxed file. On a transparent mark it has no
  visible effect. Both SVGs are `viewBox="0 0 96 96"`, so 34px still fits and the header does not shift.
- **Alternatives considered**: Leave the radius. Rejected: dead style that suggests a box is there.

## Decision 3: Pin the mark's allowed places with a test

- **Decision**: Add a unit test in `tests/unit/logo.test.tsx` that reads every `.ts` and `.tsx` file
  under `src/` and expects exactly `src/components/marketing/Logo.tsx` and
  `src/components/contact/ContactPopup.tsx` to contain `logo-gold.svg`.
- **Rationale**: Spec 003 (FR on "one place") wants the mark defined once, but its test only spot-checks
  three files. This feature makes a deliberate second place, and the test states it. A future stray
  use fails loudly.
- **Alternatives considered**: Leave the existing test alone. Rejected: it passes today and would still
  pass if the mark spread to five files.

## Decision 4: Tests for the header logo

- **Decision**: A unit test in `tests/unit/contact-popup.test.tsx` renders the popup and checks the
  header `img` (`.an-contact-header__logo`) has `src` `/logo/logo-gold.svg` and `alt` `""`, in the form
  state and after a valid send. A new `tests/e2e/contact-popup-logo.spec.ts` opens the popup from the
  hero button and from the footer on `/web-development` and checks the image loaded (`complete`,
  `naturalWidth > 0`, as `tests/e2e/not-found-style.spec.ts` does), measures 34 by 34, has a transparent
  background and no border radius, and sits 12px left of the title.
- **Rationale**: Unit tests pin the source; e2e proves it loads and looks right in a real browser
  (SC-001, SC-002). The existing accessibility spec (`tests/e2e/contact-popup-a11y.spec.ts`) already
  covers SC-003 for both states.
- **Alternatives considered**: Screenshot comparison. Rejected: brittle across browsers and fonts, for a
  one-image change.

## Findings from the code

- `ContactPopup.tsx` line 96 is the only use of `andexor-logo.svg` in `src/`.
- `logo-gold.svg` and `andexor-logo.svg` are both 96 by 96 (`viewBox="0 0 96 96"`); the gold one is
  765 bytes and is already loaded by `Logo.tsx`.
- `.an-contact-header` has a `--blue-800` background and a 260px gold radial glow (22% gold) at the
  top left; the logo sits over the glow's edge. The design system describes the gold mark as "Old Gold
  on transparent, for dark surfaces".
- No existing test references `.an-contact-header__logo` or `andexor-logo.svg`.
- `design/README.md` line 75 documents "Boxed logo 34px, radius 8px" for the popup header, and
  `design/ui_kits/marketing-site/ContactUs.jsx.txt` and `design/_ds_bundle.js` are the design tool's
  mock, which uses the boxed logo.
- Spec 003's `data-model.md`, `contracts/logo-component.md`, and `tasks.md` describe the mark as living
  only in the shared lockup.

No open questions.
