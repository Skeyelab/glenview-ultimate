import React from "react";
import Image from "next/image";
import { getDirectusAssetUrl } from "@/lib/directus";
import { SectionCard } from "@/components/ui/section-card";
import type { SeasonPhotoGroup } from "@/lib/team-photos-utils";

const PHOTO_WIDTH = 800;
const PHOTO_HEIGHT = 600;

export interface SeasonGalleryProps {
  group: SeasonPhotoGroup;
}

export function SeasonGallery({ group }: SeasonGalleryProps): React.JSX.Element {
  return (
    <SectionCard
      title={group.label}
      subtitle={`${group.photos.length} ${group.photos.length === 1 ? "photo" : "photos"}`}
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.photos.map((photo) => {
          // No `quality` here on purpose. Directus rejects a transformation
          // containing quality when the source exceeds its max dimension, which
          // every photo straight off a camera does. Omitting it resizes any
          // source fine, and Directus applies its own default quality.
          const src = getDirectusAssetUrl(photo.image, {
            transforms: { width: PHOTO_WIDTH, height: PHOTO_HEIGHT, fit: "cover" },
          });
          if (!src) return null;

          return (
            <li key={photo.id} className="space-y-2">
              <div className="overflow-hidden rounded-lg border border-white/20">
                <Image
                  src={src}
                  alt={photo.title ?? `${group.label} team photo`}
                  width={PHOTO_WIDTH}
                  height={PHOTO_HEIGHT}
                  className="h-full w-full object-cover"
                />
              </div>
              {photo.title && <p className="text-sm text-white/80">{photo.title}</p>}
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
