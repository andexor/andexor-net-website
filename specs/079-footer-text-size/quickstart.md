# Quickstart: Footer Text Size

## Prerequisites

Port 3000 free. `bun install` done.

## Check the build

```sh
bun run format:check
bun run test
bun run test:e2e -- tests/e2e/footer-links.spec.ts --project=chromium
```

Expected: all pass.

## Check by hand

Serve `out/` with `bun server.ts`, open any page, and compare the copyright line and the "Do Not Sell or Share My
Personal Information" link with the column links. They should look the same size. Repeat at 360px: both lines are
fully visible, and the page does not scroll sideways.
