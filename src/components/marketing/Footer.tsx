// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareGithub, faSquareLinkedin, faSquareXTwitter } from "@awesome.me/kit-0a6c11d394/icons/classic/brands";
import { Logo } from "./Logo";
import { PrivacySettingsLink } from "./PrivacySettingsLink";

const SOCIAL_LINKS = [
    {
        key: "linkedin",
        label: "LinkedIn logo, Andexor profile, opens in new tab",
        href: "https://www.linkedin.com/company/andexor/",
        icon: faSquareLinkedin,
    },
    {
        key: "twitter",
        label: "X logo, Andexor profile, opens in new tab",
        href: "https://x.com/andexor",
        icon: faSquareXTwitter,
    },
    {
        key: "github",
        label: "GitHub logo, Andexor organization, opens in new tab",
        href: "https://github.com/andexor",
        icon: faSquareGithub,
    },
];

const PRIVACY_SETTINGS = "Privacy Settings";

const COLUMNS = [
    {
        heading: "TECHNICAL SERVICES",
        items: ["Web Development", "Web Hosting", "Technical SEO", "Agentic Systems"],
    },
    {
        heading: "BUSINESS SERVICES",
        items: ["Cost Reduction", "Process Re-engineering", "Lead Generation", "Growth Marketing"],
    },
    {
        heading: "COMPANY",
        items: ["About Us", "Terms Of Service", "Security Policy", "Privacy Policy", PRIVACY_SETTINGS],
    },
];

const ITEM_HREFS: Record<string, string> = {
    "Web Development": "/services/web-development",
    "Web Hosting": "/services/web-hosting",
    "Technical SEO": "/services/technical-seo",
    "Agentic Systems": "/services/agentic-systems",
    "Cost Reduction": "/services/cost-reduction",
    "Lead Generation": "/services/lead-generation",
    "Growth Marketing": "/services/growth-marketing",
    "Process Re-engineering": "/services/process-re-engineering",
    "About Us": "/company/about-us",
    "Terms Of Service": "/company/terms-of-service",
    "Security Policy": "/company/security-policy",
    "Privacy Policy": "/company/privacy-policy",
};

// FR-006: navigation grouped into technical/business/company categories,
// social media links, and a copyright line under the logo. The service and About Us entries
// link to their pages (spec 010), and so do the Terms Of Service, Security Policy, and Privacy Policy entries (specs 062
// and 081). Privacy Settings is not a page: it reopens the cookie banner (spec 081). The Do Not Sell or Share My
// Personal Information link under the copyright line does the same (spec 083, which replaced spec 081's link to the Cookie
// Declaration section), so both reopen the Cookiebot banner and neither leaves the page.
export function Footer() {
    return (
        <footer role="contentinfo" className="an-footer">
            <div className="an-footer__grid">
                <div>
                    <Logo light />
                    <p className="an-footer__copyright">© 2026 Andexor Network, Inc. All rights reserved.</p>
                    <PrivacySettingsLink className="an-footer__legal-link">
                        Do Not Sell or Share My Personal Information
                    </PrivacySettingsLink>
                    <div className="an-footer__social-row">
                        {SOCIAL_LINKS.map(({ key, label, href, icon }) => (
                            <a
                                key={key}
                                href={href}
                                className="an-footer__social-link"
                                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                                <FontAwesomeIcon icon={icon} aria-label={label} />
                            </a>
                        ))}
                    </div>
                </div>
                {COLUMNS.map((column) => (
                    <nav key={column.heading} role="navigation" aria-label={column.heading}>
                        <div className="an-footer__col-heading">{column.heading}</div>
                        <ul className="an-footer__col-list">
                            {column.items.map((item) => (
                                <li key={item}>
                                    {item === PRIVACY_SETTINGS ? (
                                        <PrivacySettingsLink className="an-footer__col-link">
                                            {PRIVACY_SETTINGS}
                                        </PrivacySettingsLink>
                                    ) : (
                                        <a href={ITEM_HREFS[item]} className="an-footer__col-link">
                                            {item}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>
        </footer>
    );
}
