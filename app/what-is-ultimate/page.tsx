import React from "react";
import { WhatIsUltimateHeader } from "@/components/what-is-ultimate/what-is-ultimate-header";
import { DescriptionSection } from "@/components/what-is-ultimate/description-section";
import { VideoGrid } from "@/components/what-is-ultimate/video-grid";
import { getWebsiteSettings, getWhatIsUltimateVideos } from "@/lib/directus";

export default async function WhatIsUltimatePage(): Promise<React.JSX.Element> {
  const [websiteSettings, videos] = await Promise.all([getWebsiteSettings(), getWhatIsUltimateVideos()]);
  const paragraphs = websiteSettings.description_paragraphs ?? [];
  const videoItems = videos.map((video) => ({
    title: video.title,
    description: video.description,
    videoUrl: video.video_url ?? undefined,
    embedId: video.youtube_embed_id ?? undefined,
  }));

  return (
    <div className="space-y-6">
      <WhatIsUltimateHeader />
      <DescriptionSection paragraphs={paragraphs} />
      <VideoGrid
        videos={videoItems}
        description="Check out these videos to learn more about Ultimate Frisbee:"
        columns={2}
      />
      <section className="notice">
        <p className="text-white/90 text-sm">
          <strong>Note:</strong> Video content will be added soon. This page is ready to embed YouTube videos using
          iframe embeds when the video links are available.
        </p>
      </section>
    </div>
  );
}
