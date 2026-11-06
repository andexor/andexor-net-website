# Data Model: Organization Structured Data on the Home Page

This feature adds no stored data. It publishes one existing record in a machine-readable form.

## Organization (source)

- **Source**: `src/lib/schema/organization.json`
- **Type**: schema.org `Organization`, with `@context` `https://schema.org` and `@id` `https://andexor.net/#organization`
- **Fields** (names only; values are in the file): `name`, `legalName`, `url`, `description`, `slogan`, `logo`, `email`, `telephone`, `foundingDate`, `areaServed`, `sameAs` (list), `contactPoint` (object), `founder` (object)
- **Ownership**: the owner edits the file. A change takes effect at the next build, with no other edit.

## Published block

- **Form**: one `<script type="application/ld+json">` element in the head of `out/index.html`
- **Content**: the source record serialized as JSON on one line, with `<` written as `<`
- **Produced by**: `JsonLD` (`src/components/JsonLD.tsx`), rendered to a string at build time by `scripts/format-html.ts`
- **Validity**: the parsed block deep-equals the source record. No other field is added.

## Relationships

- The published block is derived from the Organization source on every build. Nothing else refers to it.
