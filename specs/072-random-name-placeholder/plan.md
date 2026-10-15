# Implementation Plan: Random Name Placeholder

**Branch**: `65-random-name-placeholder` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

## Summary

A new module, `src/components/contact/example-names.ts`, holds the 100 names from the spec and `randomExampleName()`.
In `ContactPopup.tsx` the Full name `<Input>` becomes a small `FullNameInput` component whose placeholder comes from
`useState(randomExampleName)`. The form mounts each time the popup is displayed (the closed popup renders nothing), so
the name is chosen once per display, stays fixed while the visitor types, and is never chosen during the static build or
the first page load, which avoids a hydration mismatch.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Testing**: Vitest (`tests/unit/example-names.test.ts`, `contact-popup.test.tsx`) and Playwright
(`tests/e2e/contact-random-name.spec.ts`). No test asserts the size of the list or a particular random outcome.

**Constraints**: Prettier; straight quotes; no count assertions; nothing else in the popup changes.

## Constitution Check

No violations: Simplicity (one module, one small component), Accessibility (placeholder is not the label), Test-first
(tests written and seen to fail before the module existed), Design consistency (design README, UI kit, and bundle
updated).
