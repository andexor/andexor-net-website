Binary on/off toggle for settings and feature flags.

```jsx
<Switch checked={on} onChange={e => setOn(e.target.checked)} />
<Switch checked={on} onChange={...} accent />
```

Blue track on by default; `accent` turns it gold. Always controlled.
