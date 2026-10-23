# Contract: first element in head

Every built HTML page in `out/` begins its head with exactly this element, then the build's other head content:

```html
<head><script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="ba75dc6a-d85e-4740-891e-dd0cc31a62dd" type="text/javascript"></script>
```

- It appears once per page, only in `<head>`, never in `<body>`.
- No `async` or `defer`.
- The attribute values do not change without a spec change.
