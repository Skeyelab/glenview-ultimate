import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SeasonSchedule } from "@/lib/directus";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  season: SeasonSchedule | null;
  logoUrl: string | null;
  hero: {
    title: string;
    subtitle?: string | null;
    tagline?: string | null;
    messagePrimary?: string | null;
    messageSecondary?: string | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
    preRegistrationText?: string | null;
  };
  className?: string;
}

export function HeroSection({ season, logoUrl, hero, className }: HeroSectionProps): React.JSX.Element {
  return (
    <section className={cn("text-center space-y-4", className)}>
      {logoUrl && (
        <div className="flex justify-center mb-6">
          <Image
            src={logoUrl}
            alt="Glenview Ultimate"
            width={300}
            height={300}
            className="h-auto w-auto"
            priority
          />
        </div>
      )}
      <h1 className="text-3xl md:text-5xl font-bold text-white">{hero.title}</h1>
      {hero.subtitle && <p className="text-lg text-white/90 max-w-2xl mx-auto">{hero.subtitle}</p>}
      {hero.tagline && <p className="text-lg text-white/90 max-w-2xl mx-auto">{hero.tagline}</p>}
      {hero.messagePrimary && <p className="text-lg text-white/90 max-w-2xl mx-auto">{hero.messagePrimary}</p>}
      {hero.messageSecondary && <p className="text-lg text-white/90 max-w-2xl mx-auto">{hero.messageSecondary}</p>}
      {hero.ctaLabel && hero.ctaUrl && (
        <div className="mt-4">
          <Link className="button" href={hero.ctaUrl}>
            {hero.ctaLabel}
          </Link>
        </div>
      )}
      {hero.preRegistrationText && <p className="text-sm text-white/70 mt-2">{hero.preRegistrationText}</p>}
      {season && (
        <p className="text-sm text-white/70 mt-2">
          {season.title ?? `${season.year} Season`} ({season.start_month ?? "Mar"}–{season.end_month ?? "May"})
        </p>
      )}
    </section>
  );
}
