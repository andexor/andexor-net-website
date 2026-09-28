#!/bin/bash

# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Andexor Network, Inc.
# Author: Ed Jenkins <ed@andexor.net>

# variables
APP=$(basename "$PWD")
IMAGE=andexor/${APP}
VERSION=1

# debug
docker run -it --rm -p 3000:3000 ${IMAGE}:${VERSION} /bin/bash
