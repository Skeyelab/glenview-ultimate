import { createDirectus, createItem, readItems, rest, staticToken } from "@directus/sdk";
import type { DirectusClient, RestClient, StaticTokenClient } from "@directus/sdk";
import { safeParseDate } from "./date-utils";
import {
  FALLBACK_ABOUT,
  FALLBACK_NAV_LINKS,
  FALLBACK_PARTNERS,
  FALLBACK_SCHEDULE_EVENTS,
  FALLBACK_WEBSITE_SETTINGS,
  FALLBACK_WHAT_IS_ULTIMATE_VIDEOS,
} from "./directus-fallbacks";

export interface Partner {
  id: number;
  name: string;
  url: string;
  logo?: string | null;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email?: string | null;
  bio?: string | null;
  photo?: string | null;
}

export type ScheduleEventType =
  | "season_start"
  | "season_end"
  | "registration_open"
  | "registration_close"
  | "game"
  | "practice"
  | "tournament"
  | "other";

export interface ScheduleEvent {
  id: number;
  season_year: number;
  event_type: ScheduleEventType;
  title: string;
  date: string;
  end_date: string | null;
  location: string | null;
  description: string | null;
  highlight: boolean | null;
}

export interface SeasonSchedule {
  season_year: number;
  year: number;
  title: string;
  start_month?: string | null;
  end_month?: string | null;
  highlights: string[];
  events: ScheduleEvent[];
}

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  published_at: string;
  excerpt?: string | null;
  content: string; // markdown or HTML
}

export interface About {
  id: number;
  club_description?: string | null;
  what_kids_learn?: string[] | null;
}

export interface WebsiteSettings {
  id: number;
  site_name: string;
  footer_text?: string | null;
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  hero_message_primary: string;
  hero_message_secondary: string;
  hero_cta_label: string;
  hero_cta_url: string;
  hero_pre_registration_text?: string | null;
  description_paragraphs?: string[] | null;
  register_heading?: string | null;
  register_intro?: string | null;
}

export interface NavigationLink {
  id: number;
  label: string;
  href: string;
  order?: number | null;
  is_primary_cta?: boolean | null;
}

export interface LogoSingleton {
  id: number;
  image?: string | null;
}

export interface WhatIsUltimateVideo {
  id: number;
  title: string;
  description: string;
  youtube_embed_id?: string | null;
  video_url?: string | null;
  sort?: number | null;
}

export interface DirectusSchema {
  Team: TeamMember[];
  Partners: Partner[];
  Schedule: ScheduleEvent[];
  News: NewsPost[];
  About: About[];
  Registrations: Registration[];
  Website: WebsiteSettings[];
  NavigationLinks: NavigationLink[];
  Logo: LogoSingleton[];
  WhatIsUltimateVideos: WhatIsUltimateVideo[];
}

// Removed AuthenticatedRestClient - not used

interface DirectusConfig {
  url: string;
  token: string;
}

function getDirectusConfig(): DirectusConfig {
  const url = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_STATIC_TOKEN;
  if (!url) throw new Error("DIRECTUS_URL not configured");
  if (!token) throw new Error("DIRECTUS_STATIC_TOKEN not configured");
  return { url, token };
}

function haveEnv(): boolean {
  if (process.env.NODE_ENV === "test") return false;
  return Boolean(process.env.DIRECTUS_URL && process.env.DIRECTUS_STATIC_TOKEN);
}

async function withDirectus<T>(fallback: T, request: (client: DirectusRestClient) => Promise<T>): Promise<T> {
  if (!haveEnv()) return fallback;
  const client = getDirectusClient();
  try {
    return await request(client);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[directus] Falling back to local data due to error:", error);
    }
    return fallback;
  }
}

type DirectusRestClient = DirectusClient<DirectusSchema> & StaticTokenClient<DirectusSchema> & RestClient<DirectusSchema>;

export interface RegistrationChild {
  full_name: string;
  age?: string | null;
  experience?: "beginner" | "intermediate" | "advanced" | null;
  availability?: string[] | null;
}

export interface RegistrationInsert {
  parent1_name: string;
  parent1_email: string;
  parent1_phone?: string | null;
  parent2_name?: string | null;
  parent2_email?: string | null;
  parent2_phone?: string | null;
  children?: RegistrationChild[] | null;
  notes?: string | null;
  marketing_opt_in?: boolean | null;
}

export interface Registration extends RegistrationInsert {
  id: number;
  date_created?: string | null;
}

let directusClient: DirectusRestClient | null = null;

function initDirectusClient(): DirectusRestClient {
  const { url, token } = getDirectusConfig();
  return createDirectus<DirectusSchema>(url)
    .with(staticToken(token))
    .with(rest());
}

function getDirectusClient(): DirectusRestClient {
  directusClient ??= initDirectusClient();
  return directusClient;
}

export function getTeam(): Promise<TeamMember[]> {
  return withDirectus([], (client) =>
    client.request(
      readItems("Team", { fields: ["*"] }),
    ),
  );
}

export function getPartners(): Promise<Partner[]> {
  return withDirectus(FALLBACK_PARTNERS, (client) =>
    client.request(
      readItems("Partners", { fields: ["*"] }),
    ),
  );
}

const START_EVENT_TYPES: ScheduleEventType[] = ["season_start", "practice", "game", "tournament"];
const END_EVENT_TYPES: ScheduleEventType[] = ["season_end", "tournament", "game", "practice"];

const DEFAULT_SCHEDULE: SeasonSchedule = buildSeasonSchedule(FALLBACK_SCHEDULE_EVENTS);

export function getSchedule(): Promise<SeasonSchedule> {
  return withDirectus(DEFAULT_SCHEDULE, async (client) => {
    const events = await client.request(
      readItems("Schedule", {
        fields: ["id", "season_year", "event_type", "title", "date", "end_date", "location", "description", "highlight"],
        sort: ["-season_year", "date"],
      }),
    );

    if (!events || events.length === 0) {
      return DEFAULT_SCHEDULE;
    }

    const latestSeasonYear = events[0]?.season_year ?? DEFAULT_SCHEDULE.season_year;
    const latestSeasonEvents = events
      .filter((event) => event.season_year === latestSeasonYear && Boolean(event.date))
      .map(normalizeScheduleEvent);

    if (latestSeasonEvents.length === 0) {
      return DEFAULT_SCHEDULE;
    }

    return buildSeasonSchedule(latestSeasonEvents);
  });
}

export function getNewsList(limit = 20): Promise<NewsPost[]> {
  return withDirectus([], (client) =>
    client.request(
      readItems("News", {
        limit,
        sort: ["-published_at"],
        fields: ["*"],
      }),
    ),
  );
}

export function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  return withDirectus<NewsPost | null>(null, async (client) => {
    const data = await client.request(
      readItems("News", {
        filter: { slug: { _eq: slug } },
        limit: 1,
        fields: ["*"],
      }),
    );
    return data[0] ?? null;
  });
}

export function getAbout(): Promise<About | null> {
  return withDirectus<About | null>(FALLBACK_ABOUT, async (client) => {
    const data = await client.request(
      readItems("About", {
        limit: 1,
        fields: ["*"],
      }),
    );
    return data[0] ?? FALLBACK_ABOUT;
  });
}

export function getWebsiteSettings(): Promise<WebsiteSettings> {
  return withDirectus(FALLBACK_WEBSITE_SETTINGS, async (client) => {
    const data = await client.request(
      readItems("Website", {
        limit: 1,
        fields: ["*"],
      }),
    );
    const record = data[0];
    if (!record) return FALLBACK_WEBSITE_SETTINGS;
    return {
      ...record,
      description_paragraphs: (record.description_paragraphs as string[] | null | undefined) ?? FALLBACK_WEBSITE_SETTINGS.description_paragraphs,
    };
  });
}

export function getNavigationLinks(): Promise<NavigationLink[]> {
  return withDirectus(FALLBACK_NAV_LINKS, (client) =>
    client.request(
      readItems("NavigationLinks", {
        fields: ["*"],
        sort: ["order"],
      }),
    ),
  ).then((links) => (links.length ? links : FALLBACK_NAV_LINKS));
}

export function getLogoImageId(): Promise<string | null> {
  return withDirectus<string | null>(null, async (client) => {
    const data = await client.request(
      readItems("Logo", {
        limit: 1,
        fields: ["image"],
      }),
    );
    const logo = data[0];
    return logo?.image ?? null;
  });
}

export function getWhatIsUltimateVideos(): Promise<WhatIsUltimateVideo[]> {
  return withDirectus(FALLBACK_WHAT_IS_ULTIMATE_VIDEOS, (client) =>
    client.request(
      readItems("WhatIsUltimateVideos", {
        fields: ["*"],
        sort: ["sort"],
      }),
    ),
  ).then((videos) => (videos.length ? videos : FALLBACK_WHAT_IS_ULTIMATE_VIDEOS));
}

// Helper to get Directus asset URL from file UUID
// Use NEXT_PUBLIC_DIRECTUS_URL for client components, DIRECTUS_URL for server components
export function getDirectusAssetUrl(fileId: string | null | undefined): string | null {
  if (!fileId) return null;
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? process.env.DIRECTUS_URL;
  if (!baseUrl) return null;
  return `${baseUrl}/assets/${fileId}`;
}

export function getDirectusRestClient(): DirectusRestClient {
  if (!haveEnv()) throw new Error("Directus not configured");
  return getDirectusClient();
}

export async function submitRegistration(payload: RegistrationInsert): Promise<Registration> {
  const client = getDirectusRestClient();
  return await client.request(
    createItem("Registrations", payload),
  );
}

function buildSeasonSchedule(events: ScheduleEvent[]): SeasonSchedule {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const seasonYear = sortedEvents[0]?.season_year ?? FALLBACK_SCHEDULE_EVENTS[0].season_year;
  const title = `${seasonYear} Season Schedule`;

  const seasonStartSource =
    sortedEvents.find((event) => START_EVENT_TYPES.includes(event.event_type)) ?? sortedEvents[0];
  const seasonEndSource =
    [...sortedEvents]
      .reverse()
      .find((event) => END_EVENT_TYPES.includes(event.event_type)) ?? sortedEvents[sortedEvents.length - 1];

  const startMonth = getMonthLabel(seasonStartSource?.date);
  const endMonth = getMonthLabel(seasonEndSource?.end_date ?? seasonEndSource?.date);

  const highlights = sortedEvents
    .filter((event) => event.highlight)
    .map((event) => `${formatMonthYear(event.date)} - ${event.title}${event.location ? ` (${event.location})` : ""}`);

  return {
    season_year: seasonYear,
    year: seasonYear,
    title,
    start_month: startMonth,
    end_month: endMonth,
    highlights,
    events: sortedEvents,
  };
}

function getMonthLabel(isoDate: string | null | undefined): string | null {
  const date = safeParseDate(isoDate);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}

function formatMonthYear(isoDate: string): string {
  const date = safeParseDate(isoDate);
  if (!date) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function normalizeScheduleEvent(event: ScheduleEvent): ScheduleEvent {
  return {
    ...event,
    end_date: event.end_date ?? null,
    location: event.location ?? null,
    description: event.description ?? null,
    highlight: event.highlight ?? null,
  };
}
