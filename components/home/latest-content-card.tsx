import React from "react";
import type { NewsPost, WhatIsUltimateVideo } from "@/lib/directus";
import { NewsArticleCard } from "@/components/news/news-article-card";
import { VideoCard } from "@/components/what-is-ultimate/video-card";
import { SectionCard } from "@/components/ui/section-card";

export interface LatestContentCardProps {
  latestNews?: NewsPost | null;
  firstVideo?: WhatIsUltimateVideo | null;
  className?: string;
}

export function LatestContentCard({
  latestNews,
  firstVideo,
  className,
}: LatestContentCardProps): React.JSX.Element {
  // Show latest news if available, otherwise show first video
  if (latestNews) {
    return (
      <SectionCard title="Latest News" className={className}>
        <NewsArticleCard post={latestNews} />
      </SectionCard>
    );
  }

  if (firstVideo) {
    return (
      <SectionCard title="Learn More" className={className}>
        <VideoCard
          title={firstVideo.title}
          description={firstVideo.description ?? ""}
          embedId={firstVideo.youtube_embed_id ?? undefined}
          videoUrl={firstVideo.video_url ?? undefined}
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Latest Updates" className={className}>
      <p className="text-white/90">Content coming soon.</p>
    </SectionCard>
  );
}

