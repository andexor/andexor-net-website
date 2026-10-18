#!/bin/bash

# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Andexor Network, Inc.
# Author: Ed Jenkins <ed@andexor.net>

# variables
APP=$(basename "$PWD")
IMAGE=andexor/${APP}
VERSION=1

# See if there is an existing image.
ID=$(docker image list --quiet ${IMAGE}:${VERSION})

# If there is, remove it.
if [[ -n "${ID}" ]]; then
    docker image rm ${ID}
fi

# Refresh the sitemap's lastmod dates from git.
# The image build has no .git directory, so this runs here.
bun scripts/generate-sitemap.ts

# Build a new image.
# The FontAwesome token in .npmrc goes in as a BuildKit secret, so it is not stored in the image.
docker build --secret id=npmrc,src=.npmrc --tag ${IMAGE}:${VERSION} .
