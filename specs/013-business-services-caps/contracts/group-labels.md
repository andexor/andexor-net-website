# Contract: Primary Need Group Labels

## Rules

- The Contact Us "Primary need" `<select>` has two `<optgroup>`s, in this order, labeled exactly
  "Technical Services" and "Business Services".
- Each group's options and their order are unchanged.
- The phrase "Business services" (lowercase s) appears nowhere in the project outside dependencies,
  build output, and the two specs that quote it (012 and 013).

## Checked by tests

| Check | Where |
|-------|-------|
| The rendered `optgroup` labels are exactly `["Technical Services", "Business Services"]`, written as literals | `tests/unit/primary-need-select.test.tsx` (new test) |
| Options render grouped and in order as defined | `tests/unit/primary-need-select.test.tsx` (existing test) |
| All 8 options plus "Something else" are present in the open popup | `tests/e2e/contact-flow.spec.ts` (existing) |
| No occurrence of "Business services" is left | one-time `grep -rIn "Business services"` (skipping specs 012 and 013) in the tasks, expected to print nothing |
