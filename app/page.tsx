import React, { Suspense } from "react";
import { getPartners, getSchedule, getWebsite, getDirectusAssetUrl } from "@/lib/directus";
import { LOGO_ID } from "@/lib/config";
import { HeroSection } from "@/components/home/hero-section";
import { SeasonHighlightsCard } from "@/components/home/season-highlights-card";
import { PartnersSection } from "@/components/home/partners-section";
import { HomeVisualEditingProvider } from "../components/home/home-visual-editing-provider";

export const revalidate = 300;

export default async function HomePage(): Promise<React.JSX.Element> {
  const [partners, season, website] = await Promise.all([
    getPartners(),
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
          <SeasonHighlightsCard highlights={highlights} />
          <PartnersSection partners={partners} />
        </div>
      </HomeVisualEditingProvider>
    </Suspense>
  );
}
