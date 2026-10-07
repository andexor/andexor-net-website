// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SERVICES } from "./services-data";

// Spec 048: one section per kind, technical then business, each with its own heading and sub-heading and
// one card per service page, in the footer's order. Each card is one link to its page (spec 011).
const SECTIONS = [
    {
        kind: "technical",
        id: "technical-services",
        heading: "Technical services built to scale",
        lede: "Web, hosting, search, and AI that stay fast as you grow.",
    },
    {
        kind: "business",
        id: "business-services",
        heading: "Business services that drive growth",
        lede: "Lower costs, more leads, and better processes, with campaigns to match.",
    },
] as const;

export function Services() {
    return (
        <>
            {SECTIONS.map((section) => (
                <section
                    key={section.id}
                    id={section.id}
                    aria-labelledby={`${section.id}-heading`}
                    className="an-services"
                >
                    <div className="an-services__header">
                        <h2 id={`${section.id}-heading`} className="an-services__heading">
                            {section.heading}
                        </h2>
                        <p className="an-services__lede">{section.lede}</p>
                    </div>
                    <div className="an-services__grid">
                        {SERVICES.filter((service) => service.kind === section.kind).map((service) => {
                            return (
                                <Card
                                    key={service.title}
                                    hover
                                    as="a"
                                    href={service.href}
                                    className="an-services__card"
                                >
                                    <div className="an-services__card-top">
                                        <span className="an-services__icon-tile">
                                            <FontAwesomeIcon icon={service.icon} aria-hidden="true" />
                                        </span>
                                    </div>
                                    <h3 className="an-services__card-title">{service.title}</h3>
                                    <p className="an-services__card-body">{service.description}</p>
                                    <ul className="an-services__bullets">
                                        {service.bullets.map((bullet) => (
                                            <li key={bullet} className="an-services__bullet">
                                                <Check
                                                    size={15}
                                                    aria-hidden="true"
                                                    className="an-services__bullet-icon"
                                                />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            ))}
        </>
    );
}
