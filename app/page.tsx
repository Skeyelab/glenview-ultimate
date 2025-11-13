import React from "react";
import { getHomePage, getPartners, getTeam, getSchedule, getDirectusAssetUrl } from "@/lib/directus";
import { LOGO_ID } from "@/lib/config";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 300;

type AsyncReturn<T> = T extends Promise<infer U> ? U : T;
type HomePageData = AsyncReturn<ReturnType<typeof getHomePage>>;
type ScheduleData = AsyncReturn<ReturnType<typeof getSchedule>>;
type TeamData = AsyncReturn<ReturnType<typeof getTeam>>;
type PartnersData = AsyncReturn<ReturnType<typeof getPartners>>;
type PartnerItem = PartnersData extends Array<infer Item> ? Item : never;

interface HeroSectionProps {
  home: HomePageData;
  schedule: ScheduleData;
  logoUrl: string | null;
}

function HeroSection({ home, schedule, logoUrl }: HeroSectionProps): React.JSX.Element {
  const heroTitle = home?.hero_title ?? "The Fun Starts - Spring 2026";
  const heroSubtitle = home?.hero_subtitle ?? "Introducing Glenview's very first Youth Ultimate Frisbee Club";
  const heroTagline = home?.hero_tagline ?? "5th-8th Grade. Boys & Girls.";
  const heroMessage1 = home?.hero_message1 ?? "Everyone is Welcome. Everyone Plays.";
  const heroMessage2 = home?.hero_message2 ?? "Come play with us. Join our team.";
  const ctaLabel = home?.cta_label ?? "Register";
  const ctaUrl = home?.cta_url ?? "/register";
  const preRegistrationText = home?.pre_registration_text ?? "Pre-Registration is now open";

  return (
    <section className="text-center space-y-4">
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
        <Link className="button" href={ctaUrl}>{ctaLabel}</Link>
      </div>
      <p className="text-sm text-white/70 mt-2">{preRegistrationText}</p>
      {schedule && (
        <p className="text-sm text-white/70 mt-2">
          {schedule.title ?? `${schedule.year} Season`} ({schedule.start_month ?? "Mar"}–{schedule.end_month ?? "May"})
        </p>
      )}
    </section>
  );
}

interface ScheduleHighlightsProps {
  highlights: string[];
}

function ScheduleHighlights({ highlights }: ScheduleHighlightsProps): React.JSX.Element {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-3 text-white">Season Highlights</h2>
      {highlights.length > 0 ? (
        <ul className="list-disc ps-5 space-y-1 text-white/90">
          {highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      ) : (
        <p className="text-white/90">Highlights coming soon.</p>
      )}
    </div>
  );
}

interface LeadershipSectionProps {
  team: TeamData;
}

function LeadershipSection({ team }: LeadershipSectionProps): React.JSX.Element {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2 text-white">Leadership</h2>
      <div className="space-y-2">
        {team.length > 0 ? (
          team.map((member) => (
            <div key={member.id} className="border border-white/20 rounded p-2">
              <div className="font-medium text-white">{member.name}</div>
              <div className="text-sm text-white/70">{member.role}</div>
              {member.email && <a className="text-sm text-white/80 hover:text-white" href={`mailto:${member.email}`}>{member.email}</a>}
            </div>
          ))
        ) : (
          <p className="text-white/90">Captains & coach bios coming soon.</p>
        )}
      </div>
    </div>
  );
}

interface PartnersSectionProps {
  partners: PartnersData;
}

function PartnersSection({ partners }: PartnersSectionProps): React.JSX.Element {
  const defaultPartners: PartnerItem[] = [
    { id: 1, name: "Illinois Ultimate", url: "https://illinoisultimate.org" },
    { id: 2, name: "Chicago Union (UFA)", url: "https://watchufa.com/union" },
    { id: 3, name: "Glenview Park District", url: "https://glenviewparks.org" },
    { id: 4, name: "USA Ultimate", url: "https://usaultimate.org" },
    { id: 5, name: "Ultimate Chicago", url: "https://ultimatechicago.org" },
  ];

  const displayPartners = partners.length > 0 ? partners : defaultPartners;

  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-3 text-white">Partners</h2>
      <div className="grid gap-3" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'}}>
        {displayPartners.map((p) => (
          <a key={p.id} className="border border-white/20 rounded p-3 text-white/90 hover:text-white hover:border-white/40 transition-colors" href={p.url} target="_blank" rel="noreferrer">
            {p.name}
          </a>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage(): Promise<React.JSX.Element> {
  const [home, partners, team, schedule] = await Promise.all([
    getHomePage(),
    getPartners(),
    getTeam(),
    getSchedule(),
  ]);

  const highlights = schedule?.highlights ?? [];
  const logoUrl = getDirectusAssetUrl(LOGO_ID);

  return (
    <div className="space-y-10">
      <HeroSection home={home} schedule={schedule} logoUrl={logoUrl} />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <ScheduleHighlights highlights={highlights} />
        <LeadershipSection team={team} />
      </section>
      <PartnersSection partners={partners} />
    </div>
  );
}
