# Implementation Plan: How Can We Help You Field

**Branch**: `71-help-field` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)

## Summary

`src/components/ui/Input.tsx` gains a `Textarea` component next to `Input`. Both use one shared internal `Field` wrapper
for the label, the hidden-from-assistive-technology asterisk, and the hint and error lines, so the two cannot drift.
`Textarea` renders `<textarea className="an-input ...">`, so it takes the same hover, focus, and colors from the
existing `.an-input` rules. A one-line rule in `src/styles/components.css` sets `resize: vertical` for
`textarea.an-input`. `ContactPopup.tsx` renders `<Textarea name="help" id="help" label="How can we help you?" rows={4} />`
after Website, and the request gets `help`. The Tab trap already includes `textarea`.

## Counter and progress bar (added later)

`Textarea` takes the native `maxLength`. When it is set, `Textarea` keeps the text length in state (from `onChange`,
using `value.length`, the same unit as the browser's limit) and wraps the label in a strip, `.an-field__head`, with the
counter `<span>` ("X/250") at its right. The strip's inline style sets the custom property `--an-fill` to the
percentage; its background is a left-to-right gradient that is filled to `--an-fill`. `--an-fill` is registered with
`@property` so the fill animates, and the animation is off under `prefers-reduced-motion`. The counter uses
`--font-mono` (Source Code Pro). The textarea's `aria-describedby` names the counter, so it is read on focus and not on
each keystroke. At 90 percent or more the strip has `data-near-limit` and the fill turns gold. The popup passes
`maxLength={250}`.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Testing**: Vitest (`input.test.tsx`, `contact-popup.test.tsx`) and Playwright (`keyboard-navigation.spec.ts`,
`contact-popup-a11y.spec.ts`, `contact-phone-field.spec.ts`, and a new `contact-help-field.spec.ts`).

**Constraints**: Prettier; straight quotes; no count assertions beyond the four lines; no hover underline; nothing else
about the popup changes.

## Constitution Check

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One small component and one CSS rule; the shared wrapper removes duplication. |
| II. Component stack | Pass. |
| III. Accessibility & performance | Pass. Real label, native textarea, same focus ring. |
| IV. Design & content consistency | Pass. Design documents updated. |
| V. Test-first | Pass. Tests written and seen to fail first. |
| VI. Always-dark, no hover underline | Pass. No underline; colors from existing tokens. |

No violations.
