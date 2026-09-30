# Data Model: Popup Header Logo

No stored data. The one entity is the small brand mark in the Contact Us popup header.

## Popup header logo

| Property | Before | After |
|----------|--------|-------|
| Image file | `/logo/andexor-logo.svg` (boxed blue and gold) | `/logo/logo-gold.svg` (gold on transparent) |
| Size | 34 by 34 px | 34 by 34 px (unchanged) |
| Corner radius | 8px | none |
| Text alternative | empty (`alt=""`), decorative | empty (unchanged) |
| Position | left of the "Contact Us" title, 12px gap | unchanged |
| Class | `an-contact-header__logo` | unchanged |

## Where `logo-gold.svg` may be referenced in `src/`

| File | Use |
|------|-----|
| `src/components/marketing/Logo.tsx` | The shared lockup (mark plus wordmark): header, hero, footer |
| `src/components/contact/ContactPopup.tsx` | The mark alone, in the popup header (spec 016) |

Any other file under `src/` that contains `logo-gold.svg` fails `tests/unit/logo.test.tsx`.
