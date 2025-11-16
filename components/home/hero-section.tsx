'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SeasonSchedule } from "@/lib/directus";
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
  className?: string;
}

export function HeroSection({ season, logoUrl, className }: HeroSectionProps): React.JSX.Element {
  const search = useSearchParams();
  const editingEnabled = search.get("visual-editing") === "true";
  const heroParagraphs = [HERO_SUBTITLE, HERO_TAGLINE, HERO_MESSAGE_1, HERO_MESSAGE_2];
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
                "hero_message_1",
                "hero_message_2",
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
        {HERO_TITLE}
      </h1>
      {heroParagraphs.map((paragraph) => (
        <p
          key={paragraph}
          className={heroParagraphClass}
          {...(editingEnabled
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: "home",
                  fields: ["hero_subtitle", "hero_tagline", "hero_message_1", "hero_message_2"],
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
          href={HERO_CTA_URL}
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
          {HERO_CTA_LABEL}
        </Link>
      </div>
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
        {HERO_PRE_REGISTRATION_TEXT}
      </p>
      {season && seasonLabel && (
        <p className="text-sm text-white/70 mt-2">
          {seasonLabel} ({season.start_month ?? "Mar"}–{season.end_month ?? "May"})
        </p>
      )}
    </section>
  );
}
