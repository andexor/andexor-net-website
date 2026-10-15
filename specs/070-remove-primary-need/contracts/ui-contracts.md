# UI Contracts: Remove Primary Need

Amends the `ContactPopup` behavior contract (spec 001, as amended by specs 015, 068, and 069):

```ts
export interface ContactRequest {
    fullName: string;
    workEmail: string;
    phoneNumber: string;
    companyWebsite: string;
}
```

2. Rendering with `open=true` and `sent=false` renders the form with fields, in order: full name (required), work
   email (required), phone number (optional), company website (optional). No field, label, or list named "Primary
   need" is rendered. Tab order follows this order, then the Privacy and Terms links, then Send.

Esc (spec 015): with the popup open, a keydown of `Escape` on the document that is not `defaultPrevented` and not
`isComposing` calls `onClose`. The spec 015 exception for an expanded "Primary need" list is withdrawn; there is no
other exception.

Everything else in the contract, including the required mark on labels, focus on open, and the reset on reopen, is
unchanged.
