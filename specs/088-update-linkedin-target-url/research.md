# Research: Point the Footer LinkedIn Icon at the Company Page

## Where the old address appears

- **Decision**: Change only `src/components/marketing/Footer.tsx`.
- **Rationale**: A search of the repository (excluding build output) finds the old address in three places: the footer,
  `content/about-us.md` (a link on the founder's name), and `specs/044-.../data-model.md` (history). Only the footer is the
  company's icon.
- **Alternatives considered**: Also changing the About Us link. Rejected: it names a person, so a personal profile is
  correct there.

## Accessible name

- **Decision**: Keep "LinkedIn logo, Andexor profile, opens in new tab".
- **Rationale**: "Andexor profile" describes a company page equally well, and the e2e checks that use the name stay valid.
- **Alternatives considered**: Renaming to "company page". Rejected: it would force test and spec edits for no gain.
