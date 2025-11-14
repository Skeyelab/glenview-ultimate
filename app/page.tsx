import React from "react";
import { getHomePage, getPartners, getTeam, getSchedule, getDirectusAssetUrl } from "@/lib/directus";
import { LOGO_ID } from "@/lib/config";
import { HeroSection } from "@/components/home/hero-section";
import { SeasonHighlightsCard } from "@/components/home/season-highlights-card";
import { LeadershipSection } from "@/components/home/leadership-section";
import { PartnersSection } from "@/components/home/partners-section";

export const revalidate = 300;

export default async function HomePage(): Promise<React.JSX.Element> {
  const [home, partners, people, season] = await Promise.all([
    getHomePage(),
    getPartners(),
    getTeam(),
    getSchedule(),
  ]);

  const highlights = season?.highlights ?? [];
  const logoUrl = getDirectusAssetUrl(LOGO_ID);

  return (
    <div className="space-y-10">
      <HeroSection home={home} season={season} logoUrl={logoUrl} />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <SeasonHighlightsCard highlights={highlights} />
        <LeadershipSection people={people} />
      </section>
      <PartnersSection partners={partners} />
    </div>
  );
}
