# Data Model: Required Fields First

No data changes. `ContactRequest` keeps the fields and order spec 068 defined (`fullName`, `workEmail`,
`phoneNumber`, `companyWebsite`, `primaryNeed`); nothing reads it positionally.

What changes is the order of fields on screen, which is also the keyboard order:

| Position | Before (spec 068) | After (spec 069) | Required |
|---|---|---|---|
| 1 | Full name | Full name | yes |
| 2 | Work email | Work email | yes |
| 3 | Phone number | Primary need | yes |
| 4 | Company website | Phone number | no |
| 5 | Primary need | Company website | no |
