#!/bin/bash

# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Andexor Network, Inc.
# Author: Ed Jenkins <ed@andexor.net>

# Refresh the sitemap's lastmod dates from git first, so the deployed sitemap is current.
# `npm run deploy` builds the site itself, so there is no separate build step.
npm run sitemap && time npm run deploy
