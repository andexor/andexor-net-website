Andexor's primary action control — use for any clickable command; `accent` (gold) for the single highest-intent CTA, `primary` (blue) for standard actions.

```jsx
<Button variant="accent" size="lg" onClick={start}>Get a proposal</Button>
<Button variant="secondary" leftIcon={<Icon name="search" />}>Audit my site</Button>
<Button variant="ghost" size="sm">Learn more</Button>
```

Variants: `primary` (blue), `accent` (gold — reserve for the hero CTA), `secondary` (outline), `ghost`, `danger`. Sizes `sm | md | lg`. Use `onInk` for secondary/ghost on blue backgrounds, `block` to fill width, `as="a"` for link buttons.
