import React from "react";
import Image from "next/image";
import type { TeamMember } from "@/lib/directus";
import { getDirectusAssetUrl } from "@/lib/directus";
import { normalizeRole, getRoleDisplayTitle } from "./role-utils";
import { cn } from "@/lib/utils";

export interface TeamMemberCardProps {
  member: TeamMember;
  spanFullWidth?: boolean;
  photoHeight?: string;
  showEmail?: boolean;
  showBio?: boolean;
  className?: string;
}

export function TeamMemberCard({
  member,
  spanFullWidth = false,
  photoHeight = "h-48",
  showEmail = true,
  showBio = true,
  className,
}: TeamMemberCardProps): React.JSX.Element {
  const photoUrl = getDirectusAssetUrl(member.photo);
  const roleTitle = getRoleDisplayTitle(member.role);
  const normalizedRole = normalizeRole(member.role);
  const isHeadCoach = normalizedRole === "head_coach";
  const shouldSpanFull = spanFullWidth ?? isHeadCoach;

  return (
    <div className={cn("card", shouldSpanFull && "md:col-span-2", className)}>
      <div className={cn("mb-4 w-full rounded-lg bg-white/10 flex items-center justify-center overflow-hidden", photoHeight)}>
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.name}
            width={192}
            height={192}
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="text-white/60 text-sm">Photo coming soon</p>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{roleTitle}</h3>
      <p className="text-white font-medium mb-1">{member.name}</p>
      {showEmail && member.email && (
        <p className="text-white/90 mb-3">
          <a href={`mailto:${member.email}`} className="text-white hover:underline">
            {member.email}
          </a>
        </p>
      )}
      {showBio && member.bio && <p className="text-white/90">{member.bio}</p>}
    </div>
  );
}
