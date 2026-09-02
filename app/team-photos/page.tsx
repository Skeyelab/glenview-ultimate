import React from "react";
import { getTeamPhotos } from "@/lib/directus";
import { groupPhotosBySeason } from "@/lib/team-photos-utils";
import { PageHeader } from "@/components/ui/page-header";
import { SeasonGallery } from "@/components/team-photos/season-gallery";

export const dynamic = 'force-dynamic'; // @NextJS

export default async function TeamPhotosPage(): Promise<React.JSX.Element> {
  const photos = await getTeamPhotos();
  const groups = groupPhotosBySeason(photos);

  return (
    <div className="space-y-6">
      <PageHeader title="Team Photos" description="Season by season, newest first." />

      {groups.length > 0 ? (
        groups.map((group) => <SeasonGallery key={group.seasonYear} group={group} />)
      ) : (
        <section className="notice">
          <p className="text-white/90 text-sm">
            <strong>Note:</strong> Team photos will be added soon.
          </p>
        </section>
      )}
    </div>
  );
}
