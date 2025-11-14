import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Page, SeasonSchedule } from "@/lib/directus";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  home: Page | null;
  season: SeasonSchedule | null;
  logoUrl: string | null;
  className?: string;
}

export function HeroSection({ home, season, logoUrl, className }: HeroSectionProps): React.JSX.Element {
  const heroTitle = home?.hero_title ?? "The Fun Starts - Spring 2026";
  const heroSubtitle = home?.hero_subtitle ?? "Introducing Glenview's very first Youth Ultimate Frisbee Club";
  const heroTagline = home?.hero_tagline ?? "5th-8th Grade. Boys & Girls.";
  const heroMessage1 = home?.hero_message1 ?? "Everyone is Welcome. Everyone Plays.";
  const heroMessage2 = home?.hero_message2 ?? "Come play with us. Join our team.";
  const ctaLabel = home?.cta_label ?? "Register";
  const ctaUrl = home?.cta_url ?? "/register";
  const preRegistrationText = home?.pre_registration_text ?? "Pre-Registration is now open";

  return (
    <section className={cn("text-center space-y-4", className)}>
      {logoUrl && (
        <div className="flex justify-center mb-6">
          <Image
            src={logoUrl}
            alt="Glenview Ultimate"
            width={120}
            height={120}
            className="h-auto w-auto max-w-[200px]"
            priority
          />
        </div>
      )}
      <h1 className="text-3xl md:text-5xl font-bold text-white">{heroTitle}</h1>
      <p className="text-lg text-white/90 max-w-2xl mx-auto">{heroSubtitle}</p>
      <p className="text-lg text-white/90 max-w-2xl mx-auto">{heroTagline}</p>
      <p className="text-lg text-white/90 max-w-2xl mx-auto">{heroMessage1}</p>
      <p className="text-lg text-white/90 max-w-2xl mx-auto">{heroMessage2}</p>
      <div className="mt-4">
        <Link className="button" href={ctaUrl}>
          {ctaLabel}
        </Link>
      </div>
      <p className="text-sm text-white/70 mt-2">{preRegistrationText}</p>
      {season && (
        <p className="text-sm text-white/70 mt-2">
          {season.title ?? `${season.year} Season`} ({season.start_month ?? "Mar"}–{season.end_month ?? "May"})
        </p>
      )}
    </section>
  );
}
