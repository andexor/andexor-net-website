# Andexor Network, Inc.

This is the company's website.

## Build

To build, run

> `./build.sh`

## Run

To run locally, run

> `./run.sh`

## Deploy

The site is deployed to Cloudflare Workers as static assets: the built `out/` directory is uploaded and served by
Cloudflare, with no server code. `wrangler.jsonc` holds the settings.

Log in once (opens a browser):

> `bunx wrangler login`

Preview the built site the way Cloudflare will serve it, at http://localhost:8787:

> `bun run build`<br/>
> `bun run preview`

Build and deploy. Cloudflare also creates the DNS record and certificate for https://andexor.net/ (the Custom Domain in
`wrangler.jsonc`), so the site is reachable there as soon as the deploy finishes:

> `bun run deploy`

Take the site down. This deletes the Worker, its assets, the Custom Domain, and the DNS record, after asking for
confirmation. Add `--force` after the command to skip the question in a script:

> `bun run undeploy`

For a quick build and deploy,

> Run `./deploy.sh`
