import React from "react";
import type { Partner } from "@/lib/directus";
import { cn } from "@/lib/utils";

export interface PartnersSectionProps {
  partners: Partner[];
  title?: string;
  minColumnWidth?: string;
  emptyMessage?: string;
  className?: string;
}

export function PartnersSection({
  partners,
  title = "Partners",
  minColumnWidth = "160px",
  emptyMessage = "Partner information coming soon.",
  className,
}: PartnersSectionProps): React.JSX.Element {
  return (
    <section className={cn("card", className)}>
      <h2 className="text-xl font-semibold mb-3 text-white">{title}</h2>
      {partners.length === 0 ? (
        <p className="text-white/80">{emptyMessage}</p>
      ) : (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))` }}
        >
          {partners.map((p) => (
            <a
              key={p.id}
              className="border border-white/20 rounded p-3 text-white/90 hover:text-white hover:border-white/40 transition-colors"
              href={p.url}
              target="_blank"
              rel="noreferrer"
            >
              {p.name}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
