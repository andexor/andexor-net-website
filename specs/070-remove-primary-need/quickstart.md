# Quickstart: Remove Primary Need

1. `bun run test -- contact-popup`: the unit tests pass. There is no "Primary need" control, Full name and Work email
   are the only required fields, the order test reads Work email, Phone number, Company website, and the Esc tests pass
   without the open-list case. `tests/unit/primary-need-select.test.tsx` no longer exists.
2. `bun run build && bun run test:e2e -- "contact|keyboard|ok-button" --project=chromium`: every popup spec passes
   without selecting a need, the phone-field spec's order and Tab tests read Work email, Phone number, Company website,
   the Esc spec closes the popup on the first press, and axe reports no violations.
3. `bun run test` and `bun run test:e2e -- --project=chromium --project=android`: everything passes (the
   straight-quotes failure on the ignored Higgsfield skill files is pre-existing).
4. Open `/`, click Contact Us: Full name and Work email with asterisks, then Phone number and Company website without,
   and no list of services. Fill the first two, press Send, and see "Request received". Reopen, press Esc once: the
   popup closes.
5. `grep -rn -i "primary need\|primaryNeed\|PRIMARY_NEED" src tests design` returns nothing. `bun run lint` and
   `bun run format:check` are clean.
