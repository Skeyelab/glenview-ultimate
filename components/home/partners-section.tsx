'use client';
import React from "react";
import type { Partner } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { setAttr } from "@/lib/visual-editing";

export interface PartnersSectionProps {
  partners: Partner[];
  defaultPartners?: Partner[];
  title?: string;
  minColumnWidth?: string;
  className?: string;
}

const DEFAULT_PARTNERS: Partner[] = [
  { id: 1, name: "Illinois Ultimate", url: "https://illinoisultimate.org" },
  { id: 2, name: "Chicago Union (UFA)", url: "https://watchufa.com/union" },
  { id: 3, name: "Glenview Park District", url: "https://glenviewparks.org" },
  { id: 4, name: "USA Ultimate", url: "https://usaultimate.org" },
  { id: 5, name: "Ultimate Chicago", url: "https://ultimatechicago.org" },
];

export function PartnersSection({
  partners,
  defaultPartners = DEFAULT_PARTNERS,
  title = "Partners",
  minColumnWidth = "160px",
  className,
}: PartnersSectionProps): React.JSX.Element {
  const displayPartners = partners.length > 0 ? partners : defaultPartners;
  const search = useSearchParams();
  const editingEnabled = search.get("visual-editing") === "true";

  return (
    <section className={cn("card", className)}>
      <h2
        className="text-xl font-semibold mb-3 text-white"
        {...(editingEnabled
          ? { "data-directus": setAttr({ collection: "Partners", item: displayPartners[0]?.id ?? 1, fields: "name", mode: "popover" }) }
          : {})}
      >
        {title}
      </h2>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))` }}>
        {displayPartners.map((p) => (
          <a
            key={p.id}
            className="border border-white/20 rounded p-3 text-white/90 hover:text-white hover:border-white/40 transition-colors"
            href={p.url}
            target="_blank"
            rel="noreferrer"
            {...(editingEnabled
              ? { "data-directus": setAttr({ collection: "Partners", item: p.id, fields: ["name", "url"], mode: "popover" }) }
              : {})}
          >
            {p.name}
          </a>
        ))}
      </div>
    </section>
  );
}
