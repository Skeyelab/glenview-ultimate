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
            <div className="flex flex-col items-center gap-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <p className="text-white/40 text-xs tracking-wide uppercase">Video coming soon</p>
            </div>
          )
        )}
      </div>
      <TitleTag className="text-lg font-semibold text-white mb-2">{title}</TitleTag>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );
}
