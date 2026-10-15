# Research: Required Fields First

## The move

- **Finding**: In `src/components/contact/ContactPopup.tsx` the form renders, in order, the Full name `<Input>` (line
  181), the Work email `<Input>` (182-189), the Phone number `<Input>` with its spec 068 comment (190-197), the Company
  website `<Input>` (198), and the Primary need block (199-220: a `<div className="an-field">` holding the comment, the
  label with its required mark, and the `<select>`). The note and Send button follow. Nothing in the component depends
  on the position of the select: `handleSubmit` reads fields by name from `FormData`, the Esc handler (spec 015) finds
  the select by `matches(":open")` on the event target, and `autoFocus` is on Full name.
- **Decision**: Cut the Primary need `<div>` block and paste it between the Work email `<Input>` and the Phone number
  comment. Change nothing inside it. Because DOM order is Tab order, the keyboard order follows without any `tabindex`.
- **Alternatives considered**: CSS `order` on the field (would leave DOM and Tab order out of step with what is seen,
  which is an accessibility fault); changing the `ContactRequest` key order to match (nothing reads it positionally;
  spec 069 says the request is unchanged).

## Tests

- **Finding**: Four tests encode the old order. `tests/unit/contact-popup.test.tsx` lines 99-100 assert Work email,
  Phone number, Company website by `compareDocumentPosition`. `tests/e2e/contact-phone-field.spec.ts` has "shows an
  optional telephone field between Work email and Company website" (bounding boxes) and "Tab goes from Work email to
  Phone number to Company website". `tests/e2e/keyboard-navigation.spec.ts` lines 27-35 Tab through Phone number,
  Company website, then Primary need. `tests/e2e/contact-popup-a11y.spec.ts` lines 34-38 list the Tab stops.
- **Decision**: Update each to Work email, Primary need, Phone number, Company website. The unit order test gains
  Primary need: Work email before Primary need, Primary need before Phone number, Phone number before Company website.
  The e2e bounding-box test becomes "lists the required fields first: Primary need sits between Work email and Phone
  number" and checks the four `y` positions in order; the Tab test becomes Work email, Primary need, Phone number,
  Company website. Each check names a field; nothing is counted.

## Design and spec documents

- **Finding**: `design/README.md` lines 77-81 list the fields in the old order. `design/ui_kits/marketing-site/
  ContactUs.jsx.txt` lines 37-56 render them in the old order, and `design/_ds_bundle.js` lines 1210-1250 are the
  compiled copy. `specs/001-homepage-contact-us/spec.md` gives the fields in scenario 1 and the amended FR-008;
  `specs/001-homepage-contact-us/contracts/ui-contracts.md` point 2 and `specs/068-contact-phone-field/contracts/
  ui-contracts.md` point 2 say "in order"; `specs/068-contact-phone-field/data-model.md` has a "Form order" line.
- **Decision**: Reorder each to Full name, Work email, Primary need, Phone number, Company website, citing spec 069
  where the text already cites a spec. The bundle is edited by hand, as before.
