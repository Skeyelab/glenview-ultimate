import React, { Suspense } from "react";
import { getPartners, getTeam, getSchedule, getWebsite, getDirectusAssetUrl } from "@/lib/directus";
import { LOGO_ID } from "@/lib/config";
import { HeroSection } from "@/components/home/hero-section";
import { SeasonHighlightsCard } from "@/components/home/season-highlights-card";
import { LeadershipSection } from "@/components/home/leadership-section";
import { PartnersSection } from "@/components/home/partners-section";
import { HomeVisualEditingProvider } from "../components/home/home-visual-editing-provider";

export const revalidate = 300;

export default async function HomePage(): Promise<React.JSX.Element> {
  const [partners, people, season, website] = await Promise.all([
    getPartners(),
    getTeam(),
    getSchedule(),
    getWebsite(),
  ]);

  const highlights = season?.highlights ?? [];
  const logoUrl = getDirectusAssetUrl(LOGO_ID);
  const directusUrl = process.env.DIRECTUS_URL ?? "";

  return (
    <Suspense fallback={null}>
      <HomeVisualEditingProvider directusUrl={directusUrl}>
        <div className="space-y-10">
          <HeroSection season={season} logoUrl={logoUrl} website={website} />
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <SeasonHighlightsCard highlights={highlights} />
            <LeadershipSection people={people} />
          </section>
          <PartnersSection partners={partners} />
        </div>
      </HomeVisualEditingProvider>
    </Suspense>
  );
}
