#!/bin/bash

# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Andexor Network, Inc.
# Author: Ed Jenkins <ed@andexor.net>

# Modify and run this to add new dependencies.

# FontAwesome
bun add @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core
bun add '@awesome.me/kit-0a6c11d394@latest'

# bun add @fortawesome/pro-solid-svg-icons
# bun add @fortawesome/pro-regular-svg-icons
# bun add @fortawesome/pro-light-svg-icons
# bun add @fortawesome/pro-thin-svg-icons
# bun add @fortawesome/pro-duotone-svg-icons
# bun add @fortawesome/duotone-regular-svg-icons
# bun add @fortawesome/duotone-light-svg-icons
# bun add @fortawesome/duotone-thin-svg-icons
# bun add @fortawesome/sharp-solid-svg-icons
# bun add @fortawesome/sharp-regular-svg-icons
# bun add @fortawesome/sharp-light-svg-icons
# bun add @fortawesome/sharp-thin-svg-icons
# bun add @fortawesome/sharp-duotone-solid-svg-icons
# bun add @fortawesome/sharp-duotone-regular-svg-icons
# bun add @fortawesome/sharp-duotone-light-svg-icons
# bun add @fortawesome/sharp-duotone-thin-svg-icons

# To get a license report, you can use license-checker-rseidelsohn.
# It is not required for the project to run,
# but it is useful for auditing dependencies.
mkdir -p reports
bun add -d license-checker-rseidelsohn

# This project is Apache-2.0, so strong copyleft dependencies (GPL, LGPL, AGPL) are not allowed.
# --failOn matches exact SPDX identifiers only, so the grep below is a backstop for variants
# such as "GPL-3.0*" or dual-license expressions. The report is only updated if the check passes.
FAIL_ON="AGPL-1.0;AGPL-1.0-only;AGPL-1.0-or-later;AGPL-1.0+;AGPL-3.0;AGPL-3.0-only;AGPL-3.0-or-later;AGPL-3.0+;GPL-1.0;GPL-1.0-only;GPL-1.0-or-later;GPL-1.0+;GPL-2.0;GPL-2.0-only;GPL-2.0-or-later;GPL-2.0+;GPL-3.0;GPL-3.0-only;GPL-3.0-or-later;GPL-3.0+;LGPL-2.0;LGPL-2.0-only;LGPL-2.0-or-later;LGPL-2.0+;LGPL-2.1;LGPL-2.1-only;LGPL-2.1-or-later;LGPL-2.1+;LGPL-3.0;LGPL-3.0-only;LGPL-3.0-or-later;LGPL-3.0+"
LICENSES_TMP=$(mktemp)
if ! bunx license-checker-rseidelsohn --failOn "${FAIL_ON}" --markdown > "${LICENSES_TMP}" \
    || grep -E ' - .*GPL' "${LICENSES_TMP}"; then
    echo "Copyleft license found. reports/license-report.md was not updated." >&2
    rm -f "${LICENSES_TMP}"
    exit 1
fi
echo " " >> reports/license-report.md
date --iso-8601 seconds >> reports/license-report.md
echo " " >> reports/license-report.md
cat "${LICENSES_TMP}" >> reports/license-report.md
rm -f "${LICENSES_TMP}"

# Check for known vulnerabilities in dependencies.
# uv --preview-features audit-command audit 2>> reports/uv-audit-report.txt
