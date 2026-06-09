'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Website } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { setAttr } from "@/lib/visual-editing";
import sanitizeHtml from "sanitize-html";
import {
  HERO_TITLE,
  HERO_BLOCK,
  HERO_CTA_LABEL,
  HERO_CTA_URL,
} from "@/lib/constants";

export interface HeroSectionProps {
  logoUrl: string | null;
  website: Website | null;
  className?: string;
}

export function HeroSection({ logoUrl, website, className }: HeroSectionProps): React.JSX.Element {
  const search = useSearchParams();
  const editingEnabled = search.get("visual-editing") === "true";

  // Ensure we have a valid website ID for visual editing
  const websiteId = website?.id;

  const heroTitle = website?.hero_title ?? HERO_TITLE;
  const heroBlock = website?.hero_block ?? HERO_BLOCK;
  const heroCtaLabel = website?.hero_cta_label ?? HERO_CTA_LABEL;
  const heroCtaUrl = website?.hero_cta_url ?? HERO_CTA_URL;

  const sanitizedHeroBlock = heroBlock ? sanitizeHtml(heroBlock) : null;
  const sanitizedSeasonSummary = website?.season_summary ? sanitizeHtml(website.season_summary) : null;

  return (
    <section className={cn("relative text-center space-y-5 py-6", className)}>
      {/* ambient glow behind logo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center" aria-hidden="true">
        <div className="h-64 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>
      {logoUrl && (
        <div className="flex justify-center mb-6">
          <Image
            src={logoUrl}
            alt="Glenview Ultimate"
            width={600}
            height={600}
            className="h-auto w-auto max-w-[300px]"
            sizes="(max-width: 768px) 80vw, 300px"
            quality={90}
            priority
          />
        </div>
      )}
      <h1
        className="text-4xl md:text-6xl font-bold text-white leading-tight"
        {...(editingEnabled && websiteId
          ? {
              "data-directus": setAttr({
                collection: "Website",
                item: websiteId,
                fields: ["hero_title"],
                mode: "popover",
              }),
            }
          : {})}
      >
        {heroTitle}
    </h1>
      {sanitizedHeroBlock && (
        <div
          className="text-lg text-white/90 max-w-2xl mx-auto prose prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizedHeroBlock }}
          {...(editingEnabled && websiteId
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: websiteId,
                  fields: ["hero_block"],
                  mode: "popover",
                }),
              }
            : {})}
        />
      )}
      <div className="mt-4">
        <Link
          className="button"
          href={heroCtaUrl}
          {...(editingEnabled && websiteId
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: websiteId,
                  fields: ["hero_cta_label", "hero_cta_url"],
                  mode: "popover",
                }),
              }
            : {})}
        >
          {heroCtaLabel}
        </Link>
      </div>
      {sanitizedSeasonSummary && (
        <div
          className="text-lg text-white/90 max-w-2xl mx-auto prose prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizedSeasonSummary }}
          {...(editingEnabled && websiteId
            ? {
                "data-directus": setAttr({
                  collection: "Website",
                  item: websiteId,
                  fields: ["season_summary"],
                  mode: "popover",
                }),
              }
            : {})}
        />
      )}
    </section>
  );
}
