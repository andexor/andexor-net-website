# Research: Contact Phone Field

## The phone field

- **Finding**: `ContactPopup.tsx` renders the form fields with the shared `Input` component, which derives the field id
  from the label (`an-phone-number`). The Work email field already uses `type="email"` and `inputMode="email"`.
- **Decision**: `<Input name="phoneNumber" label="Phone number" type="tel" autoComplete="tel"
  placeholder="+1 212 555 0100" />`, placed after Work email. `type="tel"` is the owner's instruction and is what makes
  phones show the keypad; no `inputMode` is needed because `tel` already implies it. `autoComplete="tel"` is the standard
  autofill hint (spec FR-005). No `pattern`: phone formats vary too much and the spec forbids format checks.
  `ContactRequest` gains `phoneNumber: string`, read from the form data like the other fields, and the unit test's
  expected payload gains it.
- **Alternatives considered**: a `pattern` or minimum length (rejected by the spec); a country-code picker (far beyond
  the request).

## Company website optional

- **Finding**: The field is `required` in the component, in `tests/unit/contact-popup.test.tsx` (`toBeRequired`), in
  spec 001 (FR-008, scenario 1, the data model, the UI contract), and in the design copies.
- **Decision**: Drop `required` from the component. Reverse the unit assertion to `not.toBeRequired()` and add the same
  for Phone number. Every e2e test that fills the website keeps doing so; one new e2e test sends the form with the
  website and phone blank. Spec 001 FR-008 gets a strikethrough-and-amended note in the style spec 001 already uses for
  requirements superseded by spec 002.

## The required mark: color

- **Finding**: The owner first asked for a red asterisk. The popup panel is `--blue-500` (#1766B4), and against it
  `--danger-500` (#D33A2C) is 1.23:1, `--danger-600` 1.07:1, and even a bright #FF6B5E only 2.09:1. The popup's axe
  check (`contact-popup-a11y.spec.ts`) runs `color-contrast`, and axe's matcher measures every element with a real
  text child that is visible on screen, `aria-hidden` or not (checked in `axe-core` 4.13, `colorContrastMatches`). A
  label-sized asterisk is small text and is held to 4.5:1; nothing that still reads as red gets there, and even the
  3:1 floor the spec first set needs a coral around #FFA399. Told this, the owner said the asterisk can be the same
  color as the label.
- **Decision**: The mark inherits the label color, `--blue-100` (#E7EFF8) in the popup, which is 5.03:1 against the
  panel and already passes. No new token, no color rule. Spec FR-013 was changed to say so.
- **Alternatives considered**: `--danger-300` as a new coral token at 3:1 (needed a justification for treating the
  mark as a graphic rather than text, and the owner did not want the argument); drawing the glyph with CSS
  `::after` so axe would not measure it (hides the problem rather than solving it; unnecessary now).

## The required mark: how it is rendered

- **Finding**: Two constraints. (1) The asterisk must not join the accessible name: Playwright's
  `getByLabel("Full name")` is a substring match and would survive, but Testing Library's `getByLabelText("Full
  name")` is exact and would fail, and screen readers would read "Full name star". (2) The mark must follow the
  `required` state so the two never disagree (spec FR-012). Also, `scripts/format-html.ts` fails the build on leading
  whitespace in a text node, so " *" as text is out.
- **Decision**: `Input` renders an empty `<span className="an-label__required" aria-hidden="true" />` inside the
  label, after the label text, whenever its `required` prop is true, and `.an-label__required::after { content: "*" }`
  next to `.an-label` in `components.css` draws the glyph, with `margin-left: 0.25em` for the gap. The span is empty
  because Testing Library's `getByLabelText` matches the label's text content, not the accessible name: a "*" text
  node turned "Full name" into "Full name*" and broke every exact query in the unit tests (found while implementing;
  the first cut used a text node). The Primary need label in `ContactPopup.tsx`,
  which is hand-written because it wraps a `<select>`, renders the same span. `aria-hidden` keeps the mark out of
  the accessible name in every browser; the `Input` component makes it automatic for every required `Input` on the
  site; and because it sits inside the label, clicking it focuses the control.
- **Alternatives considered**:
  - A pure CSS rule, `.an-field:has(:required) > .an-label::after { content: " *" / "" }`, needs no markup at all and
    cannot disagree with `required`. Rejected because generated content is part of the accessible name in Chrome and
    WebKit unless the `/ ""` alternative-text syntax is used, and that syntax is unsupported in Safari before 17.4, where
    the whole declaration is dropped and the mark silently disappears.
  - `<abbr title="required">*</abbr>`, the old convention. Rejected: it is announced and changes the name.
  - A space before the asterisk as text (`{" *"}`). Rejected: leading whitespace in a text node fails the build.

## Tests

- **Decision (unit)**: In `contact-popup.test.tsx`, the "all fields required" test becomes "Full name, Work email, and
  Primary need are required; Phone number and Company website are not". A test checks the field order by comparing
  document position of the three inputs, that Phone number has `type="tel"` and `autocomplete="tel"`, and that the
  submit payload carries `phoneNumber`. A test walks every labeled control in the form and asserts, for each one, that
  its label contains the mark exactly when the control is required; this is a per-field check, not a count. A new
  `input.test.tsx` renders `Input` with and without `required` and checks the mark's presence, its text "*", its
  `aria-hidden`, and that `getByLabelText` still finds the field by the plain label.
- **Decision (e2e)**: `contact-phone-field.spec.ts` opens the popup and checks: the Phone number field is visible with
  `type="tel"`; it sits between Work email and Company website (bounding-box order); Tab from Work email lands on it
  and shows the focus ring; the form sends with Phone number and Company website blank; `getByLabel("Full name", {
  exact: true })` resolves, proving the name is unchanged; each required label ends in "*" whose computed color equals
  the label's, and the optional labels have no mark. The existing Tab-order tests in `keyboard-navigation.spec.ts` and
  `contact-popup-a11y.spec.ts` gain the Phone number stop, and `contact-flow.spec.ts` lists it among the visible
  fields. The a11y spec is unchanged and must still pass.

## Design documents

- **Finding**: The form is described in `design/README.md` (field list, lines 76-80), `design/DESIGN.md` (Input, line
  140), `design/components/forms/Input.jsx.txt` and `Input.prompt.md`, the UI kit `ContactUs.jsx.txt`, and its
  compiled copy `_ds_bundle.js` (lines 1207-1216).
- **Decision**: Update each to the new form: Phone number after Work email, Company website optional, and the mark on
  required labels. These are edited by hand, as spec 064 did; the bundle is not regenerated.
