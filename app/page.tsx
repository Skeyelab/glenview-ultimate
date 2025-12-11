import React, { Suspense } from "react";
import { getPartners, getSchedule, getWebsite, getDirectusAssetUrl, getNewsList, getWhatIsUltimateVideos } from "@/lib/directus";
import { LOGO_ID } from "@/lib/config";
import { HeroSection } from "@/components/home/hero-section";
import { SeasonHighlightsCard } from "@/components/home/season-highlights-card";
import { LatestContentCard } from "@/components/home/latest-content-card";
import { PartnersSection } from "@/components/home/partners-section";
import { HomeVisualEditingProvider } from "../components/home/home-visual-editing-provider";

// Using DEFAULT_REVALIDATE_SECONDS from @/lib/config (currently 60)
export const revalidate = 60;

export default async function HomePage(): Promise<React.JSX.Element> {
  const [partners, season, website, newsList, videos] = await Promise.all([
    getPartners(),
    getSchedule(),
    getWebsite(),
    getNewsList(1),
    getWhatIsUltimateVideos(),
  ]);

  const highlights = season?.highlights ?? [];
  const latestNews = newsList.length > 0 ? newsList[0] : null;
  const firstVideo = videos.length > 0 ? videos[0] : null;
  const logoUrl = getDirectusAssetUrl(LOGO_ID);
  const directusUrl = process.env.DIRECTUS_URL ?? "";

  return (
    <Suspense fallback={null}>
      <HomeVisualEditingProvider directusUrl={directusUrl}>
        <div className="space-y-10">
          <HeroSection season={season} logoUrl={logoUrl} website={website} />
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <SeasonHighlightsCard highlights={highlights} />
            <LatestContentCard latestNews={latestNews} firstVideo={firstVideo} />
          </section>
          <PartnersSection partners={partners} />
        </div>
      </HomeVisualEditingProvider>
    </Suspense>
  );
}
