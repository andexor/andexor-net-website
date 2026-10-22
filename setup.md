<!--
SPDX-License-Identifier: Apache-2.0
Copyright 2026 Andexor Network, Inc.
Author: Ed Jenkins <ed@andexor.net>
-->

# Install Pre-requisites

Most projects have certain pre-requisites that are required for development, testing, or running in production. Install the ones that are needed.

## TypeScript

For projects written in TypeScript, you need to use Bun for package management, builds, and execution. It needs to be installed from this script.

> Run `install-bun.sh`

## NodeJS

Until now, we have been using Bun and NextJS, never using NodeJS, npm, etc. This is a little challenging because nearly all documentation for anything expects to use NodeJS and npm, prompting a translation to bun for every new dependency added. This has become exponentially more complex as we prepare to deploy to Cloudflare. Cloudflare fully expects NodeJS. It does not support Bun. What's more, there is a compatibility issue between NextJS 15 and Cloudflare. I'm going to attempt to upgrade to NextJS 16, but I also expect we will need NodeJS as well.

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

## Docker

For projects that are built in Docker or run in Docker, you need to have Docker properly installed.

> Run `install-docker.sh`

This script requires a reboot, so the system will be rebooted automatically.
After rebooting, run this to verify that it is working:

> Run `docker run hello-world`

## Spec Kit

Spec Kit is used to manage feature requirements and development.

If you have not installed uv yet, install it first.

> Run `install-uv.sh`<br/>
> Run `install-spec-kit.sh`

## License Checker

> Run `bunx license-checker-rseidelsohn`

## Playwright System Dependencies

> Run `bunx playwright install-deps webkit`

Here are some additional optional dependencies
you can install if you want, but Firefox is low priority,
so it is not included by default.

> Run `bunx playwright install firefox`<br/>
> Run `bunx playwright install-deps firefox`

Likewise, if you want to run tests for iPhone and iPad,
you can install these optional dependencies.
This hangs on my current development machine,
so they are not included by default at this time.
In the mean time, I use the device browser
in Chrome Dev Tools.

> Run `bunx playwright install webkit`<br/>
> Run `bunx playwright install-deps webkit`

## FontAwesome

The packages are added by setup.sh.
The Duotone icons are Font Awesome Pro,
used under a commercial annual
subscription held by Andexor Network, Inc.

- Purchased: 08/25/2026.
- Expires, or must be renewed: 08/25/2027. Renew before that date and update both dates here. After it lapses, a new install of the Pro icons fails, and so does the build.
- The license file is `.npmrc`. It is excluded from GitHub by `.gitignore`. `build.sh` passes it to the Docker builder stage as a BuildKit secret, so it is not stored in the image.
- NOTICE says the Pro icons are commercially licensed. It gives no dates.

## Higgsfield

This project now has access to Higgsfield skills to create images and videos with AI.

To install them,

> Run `install-higgsfield.sh`

Then

> Run `./setup.sh`

## Cloudflare Workers And OpenNext

Install these to be able to deploy to Cloudflare.

> Run `bun install @opennextjs/cloudflare@latest`<br/>
> Run `bun install -d wrangler@latest`

Then run `./setup.sh` to update the license report.

If you do not have Cloudflare installed and integrated with Claude Code,
then open Claud Code and paste this text into the prompt.

> Fetch and execute the appropriate instructions<br/>
> to set me up for Cloudflare from<br/>
> https://developers.cloudflare.com/agent-setup/prompt.md

This will install everything but the CLI.
I told Claude Code this:

> Install the CLI, using bun instead of npm.

Then I told him to create a BASH script that I can run every time the CLI gets updated.
He created install-cf.sh.

The Cloudflare CLI, `cf`, is installed globally with Bun. Its launcher expects Node, which is not installed, so the
script wraps it to run with Bun. Run the same script again to upgrade `cf`; a plain `bun install -g cf` undoes the
wrappers.

> Run `install-cf.sh`

Then log in. Use the browser-callback flow, not the default device-code flow: under Bun the device-code polling
stops after about forty seconds and the command hangs silently, so an approval made after that is never seen.

> Run `cf auth login --no-device`
