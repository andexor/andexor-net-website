<!--
SPDX-License-Identifier: Apache-2.0
Copyright 2026 Andexor Network, Inc.
Author: Ed Jenkins <ed@andexor.net>
-->

# Install Pre-requisites

Most projects have certain pre-requisites that are required for development, testing, or running in production. Install the ones that are needed.

## Node.js and npm

The site is written in TypeScript and runs on Node.js with npm: package management, builds, scripts, tests, the
and Cloudflare deployment (spec 094). Install Node.js with nvm, then install the packages.

The following script was copied from
[Node.js — Download Node.js®](https://nodejs.org/en/download/current).

### Download and install nvm:

> `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash`<br/>
> `exit`

### Start a new shell and download and install Node.js:

> `nvm install 26`

### Verify the Node.js version:

> `node -v`

### Verify npm version:

> `npm -v`

### Install the packages:

> `npm ci`

`npm ci` installs exactly what `package-lock.json` lists. To add packages, edit and run `./setup.sh`, or use `npm install`. `./run.sh` runs `npm update`, and then rewrites
`reports/license-report.md` if the lockfile changed.

## Spec Kit

Spec Kit is used to manage feature requirements and development.

If you have not installed uv yet, install it first.

> Run `install-uv.sh`<br/>
> Run `install-spec-kit.sh`

## License Checker

> Run `npx license-checker-rseidelsohn`

## Playwright System Dependencies

> Run `npx playwright install-deps webkit`

Here are some additional optional dependencies
you can install if you want, but Firefox is low priority,
so it is not included by default.

> Run `npx playwright install firefox`<br/>
> Run `npx playwright install-deps firefox`

Likewise, if you want to run tests for iPhone and iPad,
you can install these optional dependencies.
This hangs on my current development machine,
so they are not included by default at this time.
In the mean time, I use the device browser
in Chrome Dev Tools.

> Run `npx playwright install webkit`<br/>
> Run `npx playwright install-deps webkit`

## FontAwesome

The packages are added by setup.sh.
The Duotone icons are Font Awesome Pro,
used under a commercial annual
subscription held by Andexor Network, Inc.

- Purchased: 08/25/2026.
- Expires, or must be renewed: 08/25/2027. Renew before that date and update both dates here. After it lapses, a new install of the Pro icons fails, and so does the build.
- The license file is `.npmrc`. It is excluded from GitHub by `.gitignore`.
- NOTICE says the Pro icons are commercially licensed. It gives no dates.

## Higgsfield

This project now has access to Higgsfield skills to create images and videos with AI.

To install them,

> Run `install-higgsfield.sh`

Then

> Run `./setup.sh`

## Cloudflare Workers

The site deploys to Cloudflare Workers as static assets. Wrangler uploads the built `out/` directory and
Cloudflare serves it; there is no Worker code and no OpenNext. The settings are in `wrangler.jsonc`, and the
`preview`, `deploy`, and `undeploy` scripts in `package.json` run Wrangler. Wrangler is a dev dependency,
installed by `npm ci`; its `workerd` package has an install script that `allowScripts` in `package.json` allows.
Wrangler runs on Node, so install Node (above) before using it.

> Run `npx wrangler login`

Then `npm run deploy`. See the README for the commands.

### www redirect

The Worker answers only at andexor.net (a Custom Domain matches the exact hostname). A zone Redirect Rule, created
once on 2026-10-22 and independent of the Worker, sends www.andexor.net to andexor.net with a 301, keeping the path and
query string. The proxied www DNS record stays so Cloudflare can answer. To recreate the rule:

> Run `cf rulesets entrypoint update http_request_dynamic_redirect --zone andexor.net --body '{"name":"Redirect rules","rules":[{"ref":"redirect_www_to_root","description":"Redirect www.andexor.net to andexor.net","expression":"(http.host eq \"www.andexor.net\")","action":"redirect","action_parameters":{"from_value":{"target_url":{"expression":"concat(\"https://andexor.net\", http.request.uri.path)"},"status_code":301,"preserve_query_string":true}}}]}'`

If you do not have Cloudflare installed and integrated with Claude Code,
then open Claud Code and paste this text into the prompt.

> Fetch and execute the appropriate instructions<br/>
> to set me up for Cloudflare from<br/>
> https://developers.cloudflare.com/agent-setup/prompt.md

This will install everything but the CLI.

The Cloudflare CLI, `cf`, is installed globally with npm. Run the same command to upgrade it.

> Run `npm install -g cf@latest`

Then log in. Use the browser-callback flow, not the default device-code flow. The device-code polling stopped after
about forty seconds and hung silently when `cf` ran under Bun, and it has not been tried again under Node.

> Run `cf auth login --no-device`

## exiftool

Install exiftool with

> `sudo apt-get -y install libimage-exiftool-perl`
