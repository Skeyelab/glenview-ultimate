import React from "react";
import Image from "next/image";
import type { Partner } from "@/lib/directus";
import { getDirectusAssetUrl } from "@/lib/directus";
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
}: PartnersSectionProps): React.JSX.Element {
  const displayPartners = partners.length > 0 ? partners : defaultPartners;

  return (
    <SectionCard title={title} className={className}>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))` }}>
        {displayPartners.map((p) => {
          const logoUrl = getDirectusAssetUrl(p.logo);
          return (
            <a
              key={p.id}
              className="border border-white/20 rounded-lg p-4 text-white/90 hover:text-white hover:border-white/40 transition-colors flex flex-col items-center justify-center gap-2 min-h-[120px]"
              href={p.url}
              target="_blank"
              rel="noreferrer"
            >
              {logoUrl ? (
                <>
                  <div className="relative w-full h-16 flex items-center justify-center">
                    <Image
                      src={logoUrl}
                      alt={p.name}
                      width={120}
                      height={60}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-center">{p.name}</span>
                </>
              ) : (
                <span className="text-center">{p.name}</span>
              )}
            </a>
          );
        })}
      </div>
    </SectionCard>
  );
}
