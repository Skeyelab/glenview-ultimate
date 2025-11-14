import React from "react";
import type { TeamMember } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { normalizeRole } from "./role-utils";
import { TeamMemberCard } from "./team-member-card";

export interface TeamLeadershipSectionProps {
  members: TeamMember[];
  title?: string;
  emptyMessage?: string;
  captainOrder?: string[];
  renderMemberCard?: (member: TeamMember) => React.ReactNode;
  className?: string;
}

export function TeamLeadershipSection({
  members,
  title = "Team Leadership",
  emptyMessage = "Team leadership information coming soon.",
  captainOrder = ["boys_team_captain", "girls_team_captain"],
  renderMemberCard,
  className,
}: TeamLeadershipSectionProps): React.JSX.Element {
  const leadershipRoles = ["boys_team_captain", "girls_team_captain", "head_coach"];
  const allLeadershipMembers = members.filter((member) => {
    const normalizedRole = normalizeRole(member.role);
    return leadershipRoles.includes(normalizedRole);
  });

  // Separate captains and coach
  const captains = allLeadershipMembers
    .filter((member) => {
      const normalizedRole = normalizeRole(member.role);
      return normalizedRole === "boys_team_captain" || normalizedRole === "girls_team_captain";
    })
    .sort((a, b) => {
      const normalizedA = normalizeRole(a.role);
      const normalizedB = normalizeRole(b.role);
      return captainOrder.indexOf(normalizedA) - captainOrder.indexOf(normalizedB);
    });

  const coach = allLeadershipMembers.find((member) => {
    const normalizedRole = normalizeRole(member.role);
    return normalizedRole === "head_coach";
  });

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {captains.length > 0 || coach ? (
        <div className="space-y-4">
          {/* Captains side by side */}
          {captains.length > 0 && (
            <div className="grid-2">
              {captains.map((member) => (
                <React.Fragment key={member.id}>
                  {renderMemberCard?.(member) ?? <TeamMemberCard member={member} />}
                </React.Fragment>
              ))}
            </div>
          )}
          {/* Coach below, spanning full width */}
          {coach && (
            <div className="grid-2">
              {renderMemberCard?.(coach) ?? <TeamMemberCard key={coach.id} member={coach} />}
            </div>
          )}
        </div>
      ) : (
        <div className="card md:col-span-2">
          <p className="text-white/90">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
