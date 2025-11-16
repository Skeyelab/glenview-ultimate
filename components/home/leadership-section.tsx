import React from "react";
import type { TeamMember } from "@/lib/directus";
import { SectionCard } from "@/components/ui/section-card";

export interface LeadershipSectionProps {
  people: TeamMember[];
  title?: string;
  emptyMessage?: string;
  renderMember?: (member: TeamMember) => React.ReactNode;
  className?: string;
}

export function LeadershipSection({
  people,
  title = "Leadership",
  emptyMessage = "Captains & coach bios coming soon.",
  renderMember,
  className,
}: LeadershipSectionProps): React.JSX.Element {
  return (
    <SectionCard title={title} className={className}>
      <div className="space-y-2">
        {people.length > 0 ? (
          people.map((p) => (
            <React.Fragment key={p.id}>
              {renderMember?.(p) ?? (
                <div className="border border-white/20 rounded p-2">
                  <div className="font-medium text-white">{p.name}</div>
                  <div className="text-sm text-white/70">{p.role}</div>
                  {p.email && (
                    <a className="text-sm text-white/80 hover:text-white" href={`mailto:${p.email}`}>
                      {p.email}
                    </a>
                  )}
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <p className="text-white/90">{emptyMessage}</p>
        )}
      </div>
    </SectionCard>
  );
}
