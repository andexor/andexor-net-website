# UI Contracts: Contact Phone Field

Amends the `ContactPopup` and `Input` contracts from `specs/001-homepage-contact-us/contracts/ui-contracts.md`. Only
the differences are listed.

## ContactPopup

**`ContactRequest`** gains one field:

```ts
export interface ContactRequest {
    fullName: string;
    workEmail: string;
    phoneNumber: string; // new; "" when left blank
    companyWebsite: string;
    primaryNeed: string;
}
```

**Behavior contract**, point 2, becomes: rendering with `open=true` and `sent=false` renders the form with fields, in
order: full name (required), work email (required), phone number (optional, `type="tel"`, `autocomplete="tel"`),
company website (optional), primary need (required). Point 3 passes `phoneNumber` in the `ContactRequest`. Point 4 is
unchanged: only an empty or invalid required field blocks the send.

Every required control's label contains the required mark (below); no optional control's label does.

## Input

`Input` keeps its props. New behavior: when `required` is true, the label renders, after its text, the required mark:

```html
<label class="an-label" for="an-full-name">Full name<span class="an-label__required" aria-hidden="true"></span></label>
```

- The span is empty; `.an-label__required::after` draws "*" in the label's color and size, after a `0.25em` gap.
- The label's text stays "Full name", so Testing Library's exact `getByLabelText("Full name")` matches (it reads the
  label's text content, not the accessibility tree), and `aria-hidden` keeps the span out of the accessible name.
- Clicking it focuses the control, because it is inside the label.
- Labels written by hand next to a required control (the Primary need `<select>`) render the same span.

## CSS

```css
.an-label__required {
    margin-left: 0.25em;
}
.an-label__required::after {
    content: "*";
}
```

In `src/styles/components.css`, next to `.an-label`. No color, hover, or focus styling; it is not interactive on its
own.
