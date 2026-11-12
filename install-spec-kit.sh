#!/bin/bash

# Copied from https://github.com/github/spec-kit

# NOTE: If you have not done so already, run install-uv.sh first.

# Install Spec Kit.
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.4.0

# Upgrade Spec Kit.
# If specify-cli is already installed,
# you can upgrade it to the latest version with this command:
uv tool upgrade specify-cli

# Initialize the project.
specify init --here --force --non-interactive --script sh --integration claude

# Add .claude to .gitignore
cat >> .gitignore <<EOF

# Claude
.claude/
EOF
