Icon-only button for toolbars and compact controls. Always pass `aria-label`.

```jsx
<IconButton aria-label="Search" bordered><Icon name="search" /></IconButton>
<IconButton aria-label="Close" size="sm"><Icon name="x" /></IconButton>
```

Use `bordered` for standalone actions; the default ghost style suits dense toolbars.
