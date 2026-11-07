# Data Model: Clickable Phone Numbers

This feature has no database, no stored records, and no state. It has one value, the company's public phone number.

## Phone number

| Attribute | Value | Where it lives |
|-----------|-------|----------------|
| Visible form | `+14043511440` | Link text in `content/privacy-policy.md`, `content/security-policy.md`, `content/terms-of-service.md` |
| Link target | `tel:+14043511440` | Markdown link destination, the same string without spaces |
| Structured form | `+14043511440` (JSON-LD `telephone`) | `src/lib/schema/ed.json`, `src/lib/schema/organization.json`; unchanged |

## Rules

- The visible form and the link target are the same digits. The link text is never reformatted.
- Each visible occurrence in content is a Markdown link. The structured form is not visible and is not linked.
- If the number changes, edit the Markdown occurrences, the two JSON-LD files, and the number in the e2e test together.
