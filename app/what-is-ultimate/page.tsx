import React from "react";
import { WhatIsUltimateHeader } from "@/components/what-is-ultimate/what-is-ultimate-header";
import { DescriptionSection } from "@/components/what-is-ultimate/description-section";
import { VideoGrid, type VideoItem } from "@/components/what-is-ultimate/video-grid";

const DESCRIPTION_PARAGRAPHS = [
  'Ultimate, also known as Ultimate Frisbee, is a non-contact team sport played with a flying disc (frisbee). It combines elements of soccer, basketball, and football, emphasizing sportsmanship and fair play through the "Spirit of the Game" philosophy.',
  "The sport is played on a field similar to a football field, with end zones at each end. Teams score by catching the disc in the opposing team's end zone. Players cannot run with the disc and must pass it to teammates to advance down the field.",
];

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
