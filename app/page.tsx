import React from "react";
import { getPartners, getTeam, getSchedule, getDirectusAssetUrl } from "@/lib/directus";
import { LOGO_ID, DEFAULT_REVALIDATE_SECONDS } from "@/lib/config";
import { HeroSection } from "@/components/home/hero-section";
import { SeasonHighlightsCard } from "@/components/home/season-highlights-card";
import { LeadershipSection } from "@/components/home/leadership-section";
import { PartnersSection } from "@/components/home/partners-section";
import { HomeVisualEditingProvider } from "../components/home/home-visual-editing-provider";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export default async function HomePage(): Promise<React.JSX.Element> {
  const [partners, people, season] = await Promise.all([
    getPartners(),
    getTeam(),
    getSchedule(),
  ]);

  const highlights = season?.highlights ?? [];
  const logoUrl = getDirectusAssetUrl(LOGO_ID);
  const directusUrl = process.env.DIRECTUS_URL ?? "";

  return (
    <HomeVisualEditingProvider directusUrl={directusUrl}>
      <div className="space-y-10">
        <HeroSection season={season} logoUrl={logoUrl} />
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <SeasonHighlightsCard highlights={highlights} />
          <LeadershipSection people={people} />
        </section>
        <PartnersSection partners={partners} />
      </div>
    </HomeVisualEditingProvider>
  );
}
