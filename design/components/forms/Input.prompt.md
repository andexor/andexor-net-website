Labelled text input with built-in label, hint, and error rendering.

```jsx
<Input label="Work email" type="email" placeholder="you@company.com" hint="We'll only use this for your proposal." />
<Input label="Domain" defaultValue="acme" error="Enter a valid domain." />
```

Pass any native input attribute. Supplying `error` swaps in the danger styling and message; otherwise `hint` shows.
