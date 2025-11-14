import React from "react";
import {
  getPartners,
  getTeam,
  getSchedule,
  getDirectusAssetUrl,
  getWebsiteSettings,
  getLogoImageId,
} from "@/lib/directus";
import { LOGO_ID, DEFAULT_REVALIDATE_SECONDS } from "@/lib/config";
import { HeroSection } from "@/components/home/hero-section";
import { SeasonHighlightsCard } from "@/components/home/season-highlights-card";
import { LeadershipSection } from "@/components/home/leadership-section";
import { PartnersSection } from "@/components/home/partners-section";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export default async function HomePage(): Promise<React.JSX.Element> {
  const [partners, people, season, websiteSettings, logoImageId] = await Promise.all([
    getPartners(),
    getTeam(),
    getSchedule(),
    getWebsiteSettings(),
    getLogoImageId(),
  ]);

  const highlights = season?.highlights ?? [];
  const logoUrl = getDirectusAssetUrl(logoImageId ?? LOGO_ID);
  const heroCopy = {
    title: websiteSettings.hero_title,
    subtitle: websiteSettings.hero_subtitle,
    tagline: websiteSettings.hero_tagline,
    messagePrimary: websiteSettings.hero_message_primary,
    messageSecondary: websiteSettings.hero_message_secondary,
    ctaLabel: websiteSettings.hero_cta_label,
    ctaUrl: websiteSettings.hero_cta_url,
    preRegistrationText: websiteSettings.hero_pre_registration_text,
  };

  return (
    <div className="space-y-10">
      <HeroSection season={season} logoUrl={logoUrl} hero={heroCopy} />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <SeasonHighlightsCard highlights={highlights} />
        <LeadershipSection people={people} />
      </section>
      <PartnersSection partners={partners} />
    </div>
  );
}
