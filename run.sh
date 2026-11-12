#!/bin/bash

# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Andexor Network, Inc.
# Author: Ed Jenkins <ed@andexor.net>

# Update the packages within their version ranges, refresh the license report if the packages changed, build the
# site, and serve it locally the way Cloudflare will, at http://localhost:8787. Updating here means new package
# versions are tried locally before anything is deployed.

REPORT=reports/license-report.md

# This project is Apache-2.0, so strong copyleft dependencies (GPL, LGPL, AGPL) are not allowed.
# --failOn matches exact SPDX identifiers only, so the grep below is a backstop for variants
# such as "GPL-3.0*" or dual-license expressions. The report is only updated if the check passes.
FAIL_ON="AGPL-1.0;AGPL-1.0-only;AGPL-1.0-or-later;AGPL-1.0+;AGPL-3.0;AGPL-3.0-only;AGPL-3.0-or-later;AGPL-3.0+;GPL-1.0;GPL-1.0-only;GPL-1.0-or-later;GPL-1.0+;GPL-2.0;GPL-2.0-only;GPL-2.0-or-later;GPL-2.0+;GPL-3.0;GPL-3.0-only;GPL-3.0-or-later;GPL-3.0+;LGPL-2.0;LGPL-2.0-only;LGPL-2.0-or-later;LGPL-2.0+;LGPL-2.1;LGPL-2.1-only;LGPL-2.1-or-later;LGPL-2.1+;LGPL-3.0;LGPL-3.0-only;LGPL-3.0-or-later;LGPL-3.0+"

# The report says which lockfile it describes, so it is written again only when the lockfile's content has changed.
lockfile_hash() {
    sha256sum package-lock.json | cut -d' ' -f1
}

update_license_report() {
    local licenses
    licenses=$(mktemp)
    mkdir -p reports
    if ! npx license-checker-rseidelsohn --failOn "${FAIL_ON}" --markdown > "${licenses}" \
        || grep -E ' - .*GPL' "${licenses}"; then
        echo "Copyleft license found. ${REPORT} was not updated." >&2
        rm -f "${licenses}"
        return 1
    fi
    {
        date --iso-8601 seconds
        echo "<!-- package-lock.json sha256: $(lockfile_hash) -->"
        cat "${licenses}"
    } > "${REPORT}"
    rm -f "${licenses}"
}

npm update || exit 1

# Write the report again when npm installed or updated packages (the lockfile changed), when a lockfile came from
# elsewhere (./setup.sh added a package, or git brought in a new one), or when there is no report yet.
if ! grep -qs "package-lock.json sha256: $(lockfile_hash)" "${REPORT}"; then
    update_license_report || exit 1
fi

npm run build && npm run preview
