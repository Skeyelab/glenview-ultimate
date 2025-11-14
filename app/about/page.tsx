import React from "react";
import { getAbout, getTeam } from "@/lib/directus";
import { AboutHeader } from "@/components/about/about-header";
import { WhatKidsLearnSection } from "@/components/about/what-kids-learn-section";
import { TeamLeadershipSection } from "@/components/about/team-leadership-section";

export const revalidate = 300;

const DEFAULT_CLUB_DESCRIPTION =
  "The Glenview Ultimate Frisbee Club is a community based & parent run youth sports program in Glenview Illinois. Started in 2026 by Colin Carrigan, his sister, and his father. We teach the basics of Ultimate Frisbee with a heavy emphasis on 'Spirit of The Game'.";

const DEFAULT_WHAT_KIDS_LEARN = [
  "Rules of Ultimate",
  "Proper way to throw a backhand & forehand",
  "How to run multiple types of offense & defense",
];

export default async function AboutPage(): Promise<React.JSX.Element> {
  const [about, teamMembers] = await Promise.all([getAbout(), getTeam()]);

  const clubDescription = about?.club_description ?? DEFAULT_CLUB_DESCRIPTION;
  const whatKidsLearn = about?.what_kids_learn ?? DEFAULT_WHAT_KIDS_LEARN;

  return (
    <div className="space-y-6">
      <AboutHeader description={clubDescription} />
      <WhatKidsLearnSection items={whatKidsLearn} />
      <TeamLeadershipSection members={teamMembers} />
    </div>
  );
}
