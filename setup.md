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

## Docker

For projects that are built in Docker or run in Docker, you need to have Docker properly installed.

> Run `install-docker.sh`

This script requires a reboot, so the system will be rebooted automatically.
After rebooting, run this to verify that it is working:

> Run `docker run hello-world`

## Spec Kit

Spec Kit is used to manage feature requirements and development.

If you have not installed uv yet, install it first.

> Run `install-uv.sh`

> Run `install-spec-kit.sh`

## License Checker

> Run `bunx license-checker-rseidelsohn`

## Playwright System Dependencies

> Run `bunx playwright install-deps webkit`
