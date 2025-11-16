import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SeasonSchedule } from "@/lib/directus";
import { cn } from "@/lib/utils";
import {
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_TAGLINE,
  HERO_MESSAGE_1,
  HERO_MESSAGE_2,
  HERO_CTA_LABEL,
  HERO_CTA_URL,
  HERO_PRE_REGISTRATION_TEXT,
} from "@/lib/constants";

export interface HeroSectionProps {
  season: SeasonSchedule | null;
  logoUrl: string | null;
  className?: string;
}

export function HeroSection({ season, logoUrl, className }: HeroSectionProps): React.JSX.Element {
  const heroParagraphs = [HERO_SUBTITLE, HERO_TAGLINE, HERO_MESSAGE_1, HERO_MESSAGE_2];
  const heroParagraphClass = "text-lg text-white/90 max-w-2xl mx-auto";
  const seasonLabel = season?.title ?? (season ? `${season.year} Season` : null);

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
      <h1 className="text-3xl md:text-5xl font-bold text-white">{HERO_TITLE}</h1>
      {heroParagraphs.map((paragraph) => (
        <p key={paragraph} className={heroParagraphClass}>
          {paragraph}
        </p>
      ))}
      <div className="mt-4">
        <Link className="button" href={HERO_CTA_URL}>
          {HERO_CTA_LABEL}
        </Link>
      </div>
      <p className="text-sm text-white/70 mt-2">{HERO_PRE_REGISTRATION_TEXT}</p>
      {season && seasonLabel && (
        <p className="text-sm text-white/70 mt-2">
          {seasonLabel} ({season.start_month ?? "Mar"}–{season.end_month ?? "May"})
        </p>
      )}
    </section>
  );
}
