'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SeasonSchedule, Website } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { setAttr } from "@/lib/visual-editing";
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
  website: Website | null;
  className?: string;
}

export function HeroSection({ season, logoUrl, website, className }: HeroSectionProps): React.JSX.Element {
  const search = useSearchParams();
  const editingEnabled = search.get("visual-editing") === "true";

  const heroTitle = website?.hero_title ?? HERO_TITLE;
  const heroSubtitle = website?.hero_subtitle ?? HERO_SUBTITLE;
  const heroTagline = website?.hero_tagline ?? HERO_TAGLINE;
  const heroMessage1 = website?.hero_message_primary ?? HERO_MESSAGE_1;
  const heroMessage2 = website?.hero_message_secondary ?? HERO_MESSAGE_2;
  const heroCtaLabel = website?.hero_cta_label ?? HERO_CTA_LABEL;
  const heroCtaUrl = website?.hero_cta_url ?? HERO_CTA_URL;
  const heroPreRegistrationText = website?.hero_pre_registration_text ?? HERO_PRE_REGISTRATION_TEXT;

  const heroParagraphs = [heroSubtitle, heroTagline, heroMessage1, heroMessage2].filter(Boolean);
  const heroParagraphClass = "text-lg text-white/90 max-w-2xl mx-auto";
  const seasonLabel = season?.title ?? (season ? `${season.year} Season` : null);

  return (
    <section
      className={cn("text-center space-y-4", className)}
      {...(editingEnabled
        ? {
            "data-directus": setAttr({
              collection: "Website",
              item: "home",
              fields: [
                "hero_title",
                "hero_subtitle",
                "hero_tagline",
                "hero_message_primary",
                "hero_message_secondary",
                "hero_cta_label",
                "hero_cta_url",
                "hero_pre_registration_text",
                "hero_logo",
              ],
              mode: "popover",
            }),
          }
        : {})}
    >
      {logoUrl && (
        <div
          className="flex justify-center mb-6"
          {...(editingEnabled
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: "home",
                  fields: ["hero_logo"],
                  mode: "popover",
                }),
              }
            : {})}
        >
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
      <h1
        className="text-3xl md:text-5xl font-bold text-white"
        {...(editingEnabled
          ? {
              "data-directus": setAttr({
                collection: "Website",
                item: "home",
                fields: ["hero_title"],
                mode: "popover",
              }),
            }
          : {})}
      >
        {heroTitle}
      </h1>
      {heroParagraphs.map((paragraph, index) => (
        <p
          key={`${paragraph}-${index}`}
          className={heroParagraphClass}
          {...(editingEnabled
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: "home",
                  fields: ["hero_subtitle", "hero_tagline", "hero_message_primary", "hero_message_secondary"],
                  mode: "popover",
                }),
              }
            : {})}
        >
          {paragraph}
        </p>
      ))}
      <div className="mt-4">
        <Link
          className="button"
          href={heroCtaUrl}
          {...(editingEnabled
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: "home",
                  fields: ["hero_cta_label", "hero_cta_url"],
                  mode: "popover",
                }),
              }
            : {})}
        >
          {heroCtaLabel}
        </Link>
      </div>
      {heroPreRegistrationText && (
        <p
          className="text-sm text-white/70 mt-2"
          {...(editingEnabled
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: "home",
                  fields: ["hero_pre_registration_text"],
                  mode: "popover",
                }),
              }
            : {})}
        >
          {heroPreRegistrationText}
        </p>
      )}
      {season && seasonLabel && (
        <p className="text-sm text-white/70 mt-2">
          {seasonLabel} ({season.start_month ?? "Mar"}–{season.end_month ?? "May"})
        </p>
      )}
    </section>
  );
}
