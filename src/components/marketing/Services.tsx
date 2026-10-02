// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SERVICES } from "./services-data";

// FR-004: exactly 4 service offerings, each with title/description/bullets.
// Each card is one link to its page (spec 011); there is no placeholder href.
export function Services() {
  return (
    <section id="services" className="an-services">
      <div className="an-services__header">
        <h2 className="an-services__heading">Business and technical services, all in one place</h2>
        <p className="an-services__lede">Web, SEO, AI, and marketing under one roof.</p>
      </div>
      <div className="an-services__grid">
        {SERVICES.map((service) => {
          const Icon = service.icon;
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
                  <Icon size={22} aria-hidden="true" />
                </span>
                <Badge tone={service.badgeTone}>{service.tag}</Badge>
              </div>
              <h3 className="an-services__card-title">{service.title}</h3>
              <p className="an-services__card-body">{service.description}</p>
              <ul className="an-services__bullets">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="an-services__bullet">
                    <Check size={15} aria-hidden="true" className="an-services__bullet-icon" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
