import React from "react";
import { getWhatIsUltimate, getWhatIsUltimateVideos } from "@/lib/directus";
import { WhatIsUltimateHeader } from "@/components/what-is-ultimate/what-is-ultimate-header";
import { DescriptionSection } from "@/components/what-is-ultimate/description-section";
import { VideoGrid, type VideoItem } from "@/components/what-is-ultimate/video-grid";
import { DESCRIPTION_PARAGRAPHS } from "@/lib/constants";

export const revalidate = 3600;

export default async function WhatIsUltimatePage(): Promise<React.JSX.Element> {
  const [whatIsUltimate, videos] = await Promise.all([
    getWhatIsUltimate(),
    getWhatIsUltimateVideos(),
  ]);

  const descriptionHtml = whatIsUltimate?.Description ?? null;
  const videoItems: VideoItem[] = videos.map((video) => ({
    title: video.title,
    description: video.description ?? "",
    embedId: video.youtube_embed_id ?? undefined,
    videoUrl: video.video_url ?? undefined,
  }));

  return (
    <div className="space-y-6">
      <WhatIsUltimateHeader />
      <DescriptionSection
        htmlContent={descriptionHtml}
        paragraphs={descriptionHtml ? undefined : DESCRIPTION_PARAGRAPHS}
      />
      <VideoGrid
        videos={videoItems}
        description="Check out these videos to learn more about Ultimate Frisbee:"
        columns={2}
      />
      {videoItems.length === 0 && (
        <section className="notice">
          <p className="text-white/90 text-sm">
            <strong>Note:</strong> Video content will be added soon. This page is ready to embed YouTube videos using
            iframe embeds when the video links are available.
          </p>
        </section>
      )}
    </div>
  );
}
