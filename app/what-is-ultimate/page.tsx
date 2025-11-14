import React from "react";
import { WhatIsUltimateHeader } from "@/components/what-is-ultimate/what-is-ultimate-header";
import { DescriptionSection } from "@/components/what-is-ultimate/description-section";
import { VideoGrid, type VideoItem } from "@/components/what-is-ultimate/video-grid";
import { DESCRIPTION_PARAGRAPHS } from "@/lib/constants";

const VIDEOS: VideoItem[] = [
  {
    title: "Introduction to Ultimate",
    description: "A comprehensive introduction to the basics of Ultimate Frisbee",
  },
  {
    title: "Rules of the Game",
    description: "Learn the fundamental rules and how the game is played",
  },
  {
    title: "Basic Throwing Techniques",
    description: "Master the backhand and forehand throws",
  },
  {
    title: "Spirit of the Game",
    description: "Understanding the core values and sportsmanship in Ultimate",
  },
];

export default function WhatIsUltimatePage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <WhatIsUltimateHeader />
      <DescriptionSection paragraphs={DESCRIPTION_PARAGRAPHS} />
      <VideoGrid
        videos={VIDEOS}
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
