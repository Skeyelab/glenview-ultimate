'use client';
import React from "react";
import type { TeamMember } from "@/lib/directus";
import { useSearchParams } from "next/navigation";
import { setAttr } from "@/lib/visual-editing";
import { SectionCard } from "@/components/ui/section-card";
import { TeamMemberCard } from "@/components/ui/team-member-card";

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
}: LeadershipSectionProps): React.ReactElement {
  const search = useSearchParams();
  const editingEnabled = search.get("visual-editing") === "true";
  return (
    <SectionCard title={title} className={className}>
      <div className="space-y-2">
        {people.length > 0 ? (
          people.map((p) => (
            <React.Fragment key={p.id}>
              {renderMember?.(p) ?? (
                <TeamMemberCard
                  member={p}
                  internalGap="compact"
                  showBio={false}
                  showEmail={false}
                  squareImage={true}
                  {...(editingEnabled
                    ? { "data-directus": setAttr({ collection: "Team", item: p.id, fields: ["name", "role", "email"], mode: "popover" }) }
                    : {})}
                />
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
