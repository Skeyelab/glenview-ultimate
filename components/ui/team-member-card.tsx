'use client';

import React, { useState } from "react";
import Image from "next/image";
import type { TeamMember } from "@/lib/directus";
import { getDirectusAssetUrl } from "@/lib/directus";
import { normalizeRole, getRoleDisplayTitle } from "@/components/about/role-utils";
import { cn } from "@/lib/utils";

const DEFAULT_PHOTO_SIZE = 900;
const SQUARE_PHOTO_SIZE = 400;
const PHOTO_QUALITY = 90;

export interface TeamMemberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  member: TeamMember;
  spanFullWidth?: boolean;
  photoHeight?: string;
  showEmail?: boolean;
  showBio?: boolean;
  internalGap?: "compact" | "normal";
  squareImage?: boolean;
}

export function TeamMemberCard({
  member,
  spanFullWidth = false,
  showEmail = true,
  showBio = true,
  className,
  internalGap = "normal",
  squareImage = false,
  ...props
}: TeamMemberCardProps): React.JSX.Element {
  const targetSize = squareImage ? SQUARE_PHOTO_SIZE : DEFAULT_PHOTO_SIZE;
  // Force proxy route for client components to prevent hydration mismatches
  const photoUrl = getDirectusAssetUrl(member.photo, {
    width: targetSize,
    height: targetSize,
    fit: "cover",
    quality: PHOTO_QUALITY,
  }, true);
  const roleTitle = getRoleDisplayTitle(member.role, member.squad);
  const normalizedRole = normalizeRole(member.role, member.squad);
  const isHeadCoach = normalizedRole === "head_coach";
  const shouldSpanFull = spanFullWidth || isHeadCoach;
  const [imageError, setImageError] = useState(false);

  const gapClass = internalGap === "compact" ? "gap-2" : "gap-4";
  const stackedLayout = !squareImage;
  const imageContainerClass = cn(
    "flex-shrink-0 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden",
    squareImage ? "w-32 h-32" : "w-full aspect-square md:w-52 md:h-64"
  );
  const infoSectionClass = cn("flex-1 min-w-0", stackedLayout && "pt-4 md:pt-0");

  // Image dimensions: square = 128x128, non-square = 208x256 on desktop, responsive on mobile
  const imageWidth = squareImage ? 128 : 208;
  const imageHeight = squareImage ? 128 : 256;

  return (
    <div className={cn("card", shouldSpanFull && "md:col-span-2", className)} {...props}>
      <div className={cn("flex", gapClass, stackedLayout && "flex-col md:flex-row")}>
        {/* Photo on the left */}
        <div className={imageContainerClass}>
          {photoUrl && !imageError ? (
            <Image
              src={photoUrl}
              alt={member.name}
              width={imageWidth}
              height={imageHeight}
              className="h-full w-full object-cover"
              sizes={squareImage ? "128px" : "(max-width: 768px) 100vw, 208px"}
              quality={PHOTO_QUALITY}
              onError={() => {
                // eslint-disable-next-line no-console
                console.error(`[TeamMemberCard] Failed to load image for ${member.name}:`, photoUrl);
                setImageError(true);
              }}
            />
          ) : (
            <p className="text-white/60 text-xs text-center px-2">Photo coming soon</p>
          )}
        </div>

        {/* Info on the right */}
        <div className={infoSectionClass}>
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
      </div>
    </div>
  );
}

