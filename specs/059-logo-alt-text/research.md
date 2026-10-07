# Research: Logo Alt Text

## Where the logo image appears

- **Finding**: `/logo/logo-gold.svg` is rendered in two source files: `src/components/marketing/Logo.tsx` (the lockup used
  by the home page hero, the footer, and the content page and not-found headers) and `src/components/contact/ContactPopup.tsx`
  (the popup header, one image shared by the form and Request received screens). Both use `alt=""` today. An existing
  unit test already asserts that those are the only two files that reference the logo file.
- **Decision**: Change those two images only.
- **Alternatives considered**: Searching `public/` or `content/` for other uses. Nothing else references the file.

## One source for the text

- **Decision**: Export `LOGO_ALT` from `Logo.tsx` and import it in `ContactPopup.tsx`. FR-003 asks for one place.
- **Alternatives considered**: A separate constants file (more files for one string); writing the string twice (the two
  could drift apart).

## Effect on accessible names

- **Finding**: The lockup's link name is built from its contents, so with the new alt text it becomes "Andexor Network logo
  Andexor Network". Testing Library's `getByRole("link", { name: "Andexor Network" })` matches the whole name for a string,
  so the unit tests at `tests/unit/logo.test.tsx` (the link lookups) must use the new name. Playwright's `name` option
  matches a substring by default, so the e2e specs that find the header link by "Andexor Network" still work. The
  a11y spec's `.first()` lookup does too.
- **Decision**: Update the unit test lookups; leave the e2e specs alone unless one fails.
- **Alternatives considered**: `aria-label` on the link to keep the name "Andexor Network". Rejected: the owner asked for
  the alt text, and the repeated name is an accepted trade-off.

## Guard test

- **Decision**: One unit test reads the two source files and checks every `<img>` that uses the logo file takes its alt from
  `LOGO_ALT`, and a rendered check confirms the alt text equals "Andexor Network logo". No counts.
- **Alternatives considered**: Checking built `out/` HTML in e2e (slower, and the unit render covers the lockup and popup).
