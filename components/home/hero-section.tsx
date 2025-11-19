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
  const websiteId = website?.id ?? null;
  const heroParagraphClass = "text-lg text-white/90 max-w-2xl mx-auto";
  const seasonLabel = season?.title ?? (season ? `${season.year} Season` : null);
  const heroTitle = website?.hero_title ?? HERO_TITLE;
  const heroSubtitle = website?.hero_subtitle ?? HERO_SUBTITLE;
  const heroTagline = website?.hero_tagline ?? HERO_TAGLINE;
  const heroMessagePrimary = website?.hero_message_primary ?? HERO_MESSAGE_1;
  const heroMessageSecondary = website?.hero_message_secondary ?? HERO_MESSAGE_2;
  const heroCtaLabel = website?.hero_cta_label ?? HERO_CTA_LABEL;
  const heroCtaUrl = website?.hero_cta_url ?? HERO_CTA_URL;
  const heroPreRegistrationText = website?.hero_pre_registration_text ?? HERO_PRE_REGISTRATION_TEXT;
  const heroParagraphs: { key: string; text: string; fields: string[] }[] = [
    { key: "hero_subtitle", text: heroSubtitle, fields: ["hero_subtitle"] },
    { key: "hero_tagline", text: heroTagline, fields: ["hero_tagline"] },
    { key: "hero_message_primary", text: heroMessagePrimary, fields: ["hero_message_primary"] },
    { key: "hero_message_secondary", text: heroMessageSecondary, fields: ["hero_message_secondary"] },
  ];

  const getWebsiteAttr = (fields: string[]) =>
    editingEnabled
      ? {
          "data-directus": setAttr({
            collection: "Website",
            item: websiteId,
            fields,
            mode: "popover",
          }),
        }
      : {};

  return (
    <section
      className={cn("text-center space-y-4", className)}
      {...getWebsiteAttr([
        "hero_title",
        "hero_subtitle",
        "hero_tagline",
        "hero_message_primary",
        "hero_message_secondary",
        "hero_cta_label",
        "hero_cta_url",
        "hero_pre_registration_text",
      ])}
    >
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
      <h1
        className="text-3xl md:text-5xl font-bold text-white"
        {...getWebsiteAttr(["hero_title"])}
      >
        {heroTitle}
      </h1>
      {heroParagraphs.map(({ key, text, fields }) => (
        <p
          key={key}
          className={heroParagraphClass}
          {...getWebsiteAttr(fields)}
        >
          {text}
        </p>
      ))}
      <div className="mt-4">
        <Link
          className="button"
          href={heroCtaUrl}
          {...getWebsiteAttr(["hero_cta_label", "hero_cta_url"])}
        >
          {heroCtaLabel}
        </Link>
      </div>
      <p
        className="text-sm text-white/70 mt-2"
        {...getWebsiteAttr(["hero_pre_registration_text"])}
      >
        {heroPreRegistrationText}
      </p>
      {season && seasonLabel && (
        <p className="text-sm text-white/70 mt-2">
          {seasonLabel} ({season.start_month ?? "Mar"}–{season.end_month ?? "May"})
        </p>
      )}
    </section>
  );
}
