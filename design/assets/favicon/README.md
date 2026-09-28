# Andexor Network favicons

Source: `assets/logo/logo-gold.svg` (Old Gold on transparent).

The 16×16 image (in `favicon.ico` and `favicon-16x16.png`) is hand-drawn pixel by pixel so it stays sharp at tab size. Don't regenerate it from the SVG.

Put all of these files at the site root, then add this to `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-config" content="/browserconfig.xml">
<meta name="theme-color" content="#002855">
```

`apple-touch-icon.png` sits on Andexor Blue (#002855) because iOS fills transparent areas with black. A transparent version is included as `apple-touch-icon-transparent.png`.
