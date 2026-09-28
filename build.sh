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

# Build a new image.
docker build --tag ${IMAGE}:${VERSION} .
