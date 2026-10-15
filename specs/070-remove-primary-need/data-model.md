# Data Model: Remove Primary Need

`ContactRequest` loses its `primaryNeed` field:

| Field | Type | Required | Notes |
|---|---|---|---|
| `fullName` | string | yes | unchanged |
| `workEmail` | string | yes | unchanged |
| `phoneNumber` | string | no | unchanged (spec 068) |
| `companyWebsite` | string | no | unchanged (spec 068) |
| ~~`primaryNeed`~~ | ~~enum or "Something else"~~ | ~~yes~~ | removed by spec 070 |

The "Primary Need option list" of spec 001 `data-model.md` (two groups of four services plus "Something else") has no
remaining consumer and is removed with the field. As before, the request is not persisted or transmitted anywhere.

Form order on screen, which is also the keyboard order:

| Position | Before (spec 069) | After (spec 070) | Required |
|---|---|---|---|
| 1 | Full name | Full name | yes |
| 2 | Work email | Work email | yes |
| 3 | Primary need | Phone number | no |
| 4 | Phone number | Company website | no |
| 5 | Company website | | |
