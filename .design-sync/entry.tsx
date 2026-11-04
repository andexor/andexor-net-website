// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// The entry the design sync bundles for Claude Design: the site's own components, re-exported, plus the stylesheet
// they need. Only components that are safe to render anywhere are here. ContactPopup and ContactProvider are left out
// because their Send button posts a real contact request, and the Cookiebot and content-page pieces are site plumbing.

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./site.css";

// As in src/app/layout.tsx: the stylesheet is imported above, so FontAwesome must not inject its own at runtime.
config.autoAddCss = false;

export { Badge } from "../src/components/ui/Badge";
export { Button } from "../src/components/ui/Button";
export { Card } from "../src/components/ui/Card";
export { Input, Textarea } from "../src/components/ui/Input";
export { CTABand } from "../src/components/marketing/CTABand";
export { Footer } from "../src/components/marketing/Footer";
export { Hero } from "../src/components/marketing/Hero";
export { Logo } from "../src/components/marketing/Logo";
export { Services } from "../src/components/marketing/Services";
