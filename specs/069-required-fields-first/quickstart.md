# Quickstart: Required Fields First

1. `bun run test -- contact-popup`: the unit tests pass, including the order test (Work email, then Primary need, then
   Phone number, then Company website).
2. `bun run build && bun run test:e2e -- "contact|keyboard" --project=chromium`: the phone-field spec's order and Tab
   tests, the keyboard walk, and the a11y Tab order all pass in the new order, and axe reports no violations.
3. `bun run test` and `bun run test:e2e -- --project=chromium --project=android`: everything passes (the
   straight-quotes failure on the ignored Higgsfield skill files is pre-existing).
4. Open `/`, click Contact Us: Full name, Work email, Primary need, each with an asterisk, then Phone number and Company
   website without. Fill the first two, pick a service, press Send, and see "Request received".
5. `grep -rn "Company website" design specs/001-homepage-contact-us specs/068-contact-phone-field | grep -i "primary
   need"` shows no line that still puts Primary need after Company website. `bun run lint` and `bun run format:check`
   are clean.
