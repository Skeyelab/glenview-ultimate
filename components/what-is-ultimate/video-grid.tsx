import React from "react";
import { VideoCard } from "./video-card";
import { cn } from "@/lib/utils";

export interface VideoItem {
  title: string;
  description: string;
  videoUrl?: string;
  embedId?: string;
}

export interface VideoGridProps {
  videos: VideoItem[];
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
  renderVideo?: (video: VideoItem, index: number) => React.ReactNode;
  className?: string;
}

export function VideoGrid({
  videos,
  title = "Learn More Through Videos",
  description,
  columns = 2,
  renderVideo,
  className,
}: VideoGridProps): React.JSX.Element {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {description && <p className="text-white/90">{description}</p>}
      <div className={cn("grid gap-4", gridCols[columns])}>
        {videos.map((video, index) => (
          <React.Fragment key={`${video.title}-${index}`}>
            {renderVideo?.(video, index) ?? (
              <VideoCard title={video.title} description={video.description} videoUrl={video.videoUrl} embedId={video.embedId} />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
