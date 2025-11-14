import React from "react";
import { cn } from "@/lib/utils";

export interface VideoCardProps {
  title: string;
  description: string;
  videoUrl?: string;
  embedId?: string;
  placeholder?: React.ReactNode;
  className?: string;
  titleAs?: keyof React.JSX.IntrinsicElements;
}

export function VideoCard({
  title,
  description,
  videoUrl,
  embedId,
  placeholder,
  className,
  titleAs: TitleTag = "h3",
}: VideoCardProps): React.JSX.Element {
  const hasVideo = Boolean(videoUrl || embedId);

  return (
    <div className={cn("card", className)}>
      <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
        {hasVideo ? (
          embedId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${embedId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : videoUrl ? (
            <iframe className="w-full h-full" src={videoUrl} title={title} allowFullScreen />
          ) : null
        ) : (
          placeholder ?? (
            <div className="text-center">
              <p className="text-white/60 text-sm">YouTube Video Embed</p>
              <p className="text-white/40 text-xs mt-1">Coming Soon</p>
            </div>
          )
        )}
      </div>
      <TitleTag className="text-lg font-semibold text-white mb-2">{title}</TitleTag>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );
}
