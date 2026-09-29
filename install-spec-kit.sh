#!/bin/bash

# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Andexor Network, Inc.
# Author: Ed Jenkins <ed@andexor.net>

# Copied from https://github.com/github/spec-kit

# NOTE: If you have not done so already, run install-uv.sh first.

# Install Spec Kit.
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.0.12

# Initialize the project.
specify init --here --force --non-interactive --script sh --integration claude

# Add .claude to .gitignore
cat >> .gitignore <<EOF

# Claude
.claude/
EOF
