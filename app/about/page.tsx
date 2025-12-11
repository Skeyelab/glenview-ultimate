import React from "react";
import { getAbout, getTeam } from "@/lib/directus";
import { AboutHeader } from "@/components/about/about-header";
import { WhatKidsLearnSection } from "@/components/about/what-kids-learn-section";
import { TeamLeadershipSection } from "@/components/about/team-leadership-section";
import { DEFAULT_CLUB_DESCRIPTION, DEFAULT_WHAT_KIDS_LEARN } from "@/lib/constants";

export const revalidate = 60;

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
