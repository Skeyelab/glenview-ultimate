import type { TeamPhoto } from "@/lib/directus";

export interface SeasonPhotoGroup {
  seasonYear: number;
  label: string;
  photos: TeamPhoto[];
}

/**
 * Groups photos into one section per season, newest season first.
 * Within a season, photos keep the CMS `sort` order, falling back to id
 * so the order is stable when `sort` is unset.
 */
export function groupPhotosBySeason(photos: TeamPhoto[]): SeasonPhotoGroup[] {
  const bySeason = new Map<number, TeamPhoto[]>();

  for (const photo of photos) {
    const existing = bySeason.get(photo.season_year);
    if (existing) {
      existing.push(photo);
    } else {
      bySeason.set(photo.season_year, [photo]);
    }
  }

  return [...bySeason.entries()]
    .sort(([a], [b]) => b - a)
    .map(([seasonYear, seasonPhotos]) => ({
      seasonYear,
      label: `${seasonYear} Season`,
      photos: [...seasonPhotos].sort(
        (a, b) => (a.sort ?? Number.MAX_SAFE_INTEGER) - (b.sort ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
      ),
    }));
}
