import React from "react";
import { getDirectusAssetUrl } from "@/lib/directus";
import { SectionCard } from "@/components/ui/section-card";
import { PhotoLightbox, type LightboxPhoto } from "./photo-lightbox";
import type { SeasonPhotoGroup } from "@/lib/team-photos-utils";

const THUMB_WIDTH = 800;
const THUMB_HEIGHT = 600;
const FULL_WIDTH = 1600;
const FULL_HEIGHT = 1600;

export interface SeasonGalleryProps {
  group: SeasonPhotoGroup;
}

export function SeasonGallery({ group }: SeasonGalleryProps): React.JSX.Element {
  // URLs are built here rather than in the client component: getDirectusAssetUrl
  // inlines an access token server-side, and a client component reproducing that
  // would cause a hydration mismatch.
  //
  // Neither transform passes `quality`. Directus rejects a transformation
  // containing it when the source exceeds its max dimension, which every photo
  // straight off a camera does.
  const photos: LightboxPhoto[] = group.photos.flatMap((photo) => {
    const thumbSrc = getDirectusAssetUrl(photo.image, {
      transforms: { width: THUMB_WIDTH, height: THUMB_HEIGHT, fit: "cover" },
    });
    const fullSrc = getDirectusAssetUrl(photo.image, {
      // `inside` keeps the whole photo visible; the grid crops, the lightbox must not.
      transforms: { width: FULL_WIDTH, height: FULL_HEIGHT, fit: "inside" },
    });
    if (!thumbSrc || !fullSrc) return [];

    return [{
      id: photo.id,
      title: photo.title ?? null,
      thumbSrc,
      fullSrc,
      alt: photo.title ?? `${group.label} team photo`,
    }];
  });

  return (
    <SectionCard
      title={group.label}
      subtitle={`${group.photos.length} ${group.photos.length === 1 ? "photo" : "photos"}`}
    >
      <PhotoLightbox photos={photos} />
    </SectionCard>
  );
}
