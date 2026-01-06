'use client';
import React from "react";
import Image from "next/image";
import type { Partner } from "@/lib/directus";
import { getDirectusAssetUrl } from "@/lib/directus";
import { useSearchParams } from "next/navigation";
import { setAttr } from "@/lib/visual-editing";
import { SectionCard } from "@/components/ui/section-card";

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
}: PartnersSectionProps): React.ReactElement {
  const displayPartners = partners.length > 0 ? partners : defaultPartners;
  const search = useSearchParams();
  const editingEnabled = search.get("visual-editing") === "true";

  return (
    <SectionCard title={title} className={className}>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))` }}>
        {displayPartners.map((p) => {
          // Force proxy route for client components to prevent hydration mismatches
          const logoUrl = getDirectusAssetUrl(p.logo, { fit: "contain" }, true);
          return (
            <a
              key={p.id}
              className="border border-white/20 rounded p-3 text-white/90 hover:text-white hover:border-white/40 transition-colors text-center flex flex-col items-center gap-2"
              href={p.url}
              target="_blank"
              rel="noreferrer"
              {...(editingEnabled
                ? { "data-directus": setAttr({ collection: "Partners", item: p.id, fields: ["name", "url", "logo"], mode: "popover" }) }
                : {})}
            >
              {logoUrl && (
                <div className="w-full h-20 flex items-center justify-center">
                  <Image
                    src={logoUrl}
                    alt={p.name}
                    width={240}
                    height={160}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    sizes="(max-width: 768px) 160px, 240px"
                    quality={90}
                  />
                </div>
              )}
              <span>{p.name}</span>
            </a>
          );
        })}
      </div>
    </SectionCard>
  );
}
