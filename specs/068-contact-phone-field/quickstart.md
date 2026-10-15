# Quickstart: Contact Phone Field

1. `bun run test -- contact-popup input`: the unit tests pass. Full name, Work email, and Primary need are required
   and carry the mark; Phone number and Company website are optional and do not; Phone number is `type="tel"` and
   sits between Work email and Company website; the submit payload includes `phoneNumber`.
2. `bun run build && bun run test:e2e -- tests/e2e/contact-phone-field.spec.ts`: the field is visible and typed for
   a keypad, Tab goes Work email, Phone number, Company website, the form sends with both optional fields blank, every
   required label ends in "*" in the label's color, and `getByLabel("Full name", { exact: true })` still finds the
   field.
3. `bun run test:e2e -- contact keyboard`: the popup, a11y (axe reports no violations), keyboard, and flow specs pass
   with the new Tab stop.
4. `bun run test`: the whole unit suite passes, including the straight-quotes and no-top-links checks.
5. Open `/`, click Contact Us, and look: five fields in order, three asterisks, none on Phone number or Company
   website. On a phone, tapping Phone number opens the keypad. Fill only Full name, Work email, and a need, press Send,
   and see "Request received".
6. `grep -rn "Company website" design specs/001-homepage-contact-us | grep -i required` finds nothing that still calls
   it required. `bun run lint` and `bun run format:check` are clean.
