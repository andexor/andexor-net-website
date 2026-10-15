# Data Model: Contact Phone Field

The only data shape that changes is the in-memory `ContactRequest` from spec 001
(`src/components/contact/ContactPopup.tsx`). It is still never persisted or transmitted.

| Field | Type | Required | Validation | Change |
|---|---|---|---|---|
| `fullName` | string | Yes | Non-empty (native `required`) | none |
| `workEmail` | string | Yes | Non-empty, valid email format | none |
| `phoneNumber` | string | No | None. Free text in a `type="tel"` field; empty string when left blank | new |
| `companyWebsite` | string | No | None | was required |
| `primaryNeed` | enum or "Something else" | Yes | One of the service names or the literal "Something else" | none |

Form order: `fullName`, `workEmail`, `phoneNumber`, `companyWebsite`, `primaryNeed` (spec 069 moved `primaryNeed` to
third: `fullName`, `workEmail`, `primaryNeed`, `phoneNumber`, `companyWebsite`).

## Required mark

Derived, not stored: a field's label shows the mark exactly when the control is `required`. In `Input` this follows
from the `required` prop; for the hand-written Primary need label it is written next to the `required` select. The
unit tests check the two agree for every field.
