import { createDirectus, createItem, readItems, rest, staticToken } from "@directus/sdk";
import type { DirectusClient, RestClient, StaticTokenClient } from "@directus/sdk";
import { safeParseDate } from "./date-utils";

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
  squad?: string | null;
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

export interface WhatIsUltimate {
  id: number;
  Description?: string | null;
}

export interface WhatIsUltimateVideo {
  id: number;
  title: string;
  description?: string | null;
  youtube_embed_id?: string | null;
  video_url?: string | null;
  sort?: number | null;
  active?: boolean | null;
}

export interface Website {
  id: number;
  site_name: string;
  hero_title: string;
  hero_block?: string | null;
  hero_cta_label?: string | null;
  hero_cta_url?: string | null;
  hero_pre_registration_text?: string | null;
}

export interface DirectusSchema {
  Team: TeamMember[];
  Partners: Partner[];
  Schedule: ScheduleEvent[];
  News: NewsPost[];
  About: About[];
  WhatIsUltimate: WhatIsUltimate[];
  WhatIsUltimateVideos: WhatIsUltimateVideo[];
  Registrations: Registration[];
  Website: Website[];
}

export type DirectusImageFit = "cover" | "contain" | "inside" | "outside" | "fill";

export type DirectusImageFormat = "auto" | "jpg" | "png" | "webp" | "tiff" | "gif" | "avif";

export interface DirectusAssetTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: DirectusImageFit;
  format?: DirectusImageFormat;
  key?: string;
  withoutEnlargement?: boolean;
  transforms?: Record<string, string | number | boolean>;
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
  return Boolean(process.env.DIRECTUS_URL && process.env.DIRECTUS_STATIC_TOKEN);
}

async function withDirectus<T>(fallback: T, request: (client: DirectusRestClient) => Promise<T>): Promise<T> {
  if (!haveEnv()) return fallback;
  const client = getDirectusClient();
  return await request(client);
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
  return withDirectus([], (client) =>
    client.request(
      readItems("Partners", { fields: ["*"] }),
    ),
  );
}

const START_EVENT_TYPES: ScheduleEventType[] = ["season_start", "practice", "game", "tournament"];
const END_EVENT_TYPES: ScheduleEventType[] = ["season_end", "tournament", "game", "practice"];

const DEFAULT_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 1,
    season_year: 2026,
    event_type: "registration_open",
    title: "Pre-Registration Opens",
    date: "2025-11-01T15:00:00.000Z",
    end_date: null,
    location: null,
    description: null,
    highlight: true,
  },
  {
    id: 2,
    season_year: 2026,
    event_type: "registration_close",
    title: "Registration & Uniform Orders Due",
    date: "2026-02-15T15:00:00.000Z",
    end_date: null,
    location: null,
    description: null,
    highlight: true,
  },
  {
    id: 3,
    season_year: 2026,
    event_type: "season_start",
    title: "Spring Season Kickoff Practice",
    date: "2026-03-01T21:30:00.000Z",
    end_date: null,
    location: "TBD",
    description: "Weekly practices begin (12 weeks). Time & location currently TBD.",
    highlight: true,
  },
  {
    id: 4,
    season_year: 2026,
    event_type: "practice",
    title: "Weekly Practices Continue",
    date: "2026-03-08T21:30:00.000Z",
    end_date: "2026-05-24T21:30:00.000Z",
    location: "TBD",
    description: "Skills, drills, and scrimmages.",
    highlight: null,
  },
  {
    id: 5,
    season_year: 2026,
    event_type: "tournament",
    title: "Tournament Opportunities",
    date: "2026-04-01T15:00:00.000Z",
    end_date: "2026-05-31T22:00:00.000Z",
    description: "Opportunity to attend 3-4 tournaments.",
    location: null,
    highlight: null,
  },
];

const DEFAULT_SCHEDULE: SeasonSchedule = buildSeasonSchedule(DEFAULT_SCHEDULE_EVENTS);

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
  return withDirectus<About | null>(null, async (client) => {
    const data = await client.request(
      readItems("About", {
        limit: 1,
        fields: ["*"],
      }),
    );
    return data[0] ?? null;
  });
}

export function getWhatIsUltimate(): Promise<WhatIsUltimate | null> {
  return withDirectus<WhatIsUltimate | null>(null, async (client) => {
    const data = await client.request(
      readItems("WhatIsUltimate", {
        limit: 1,
        fields: ["*"],
      }),
    );
    return data[0] ?? null;
  });
}

export function getWhatIsUltimateVideos(): Promise<WhatIsUltimateVideo[]> {
  return withDirectus<WhatIsUltimateVideo[]>([], async (client) => {
    const videos = await client.request(
      readItems("WhatIsUltimateVideos", {
        fields: ["id", "title", "description", "youtube_embed_id", "video_url", "sort", "active"],
        filter: { active: { _eq: true } },
        sort: ["sort"],
      }),
    );
    return videos;
  });
}

export function getWebsite(): Promise<Website | null> {
  return withDirectus<Website | null>(null, async (client) => {
    const data = await client.request(
      readItems("Website", {
        limit: 1,
        fields: ["*"],
      }),
    );
    // Website is a singleton collection, so data could be an array or a single object
    if (Array.isArray(data)) {
      return data[0] ?? null;
    }
    return data ?? null;
  });
}

// Helper to get Directus asset URL from file UUID
// For server components: uses direct Directus URL with access token
// For client components: uses the API proxy route to handle authentication
function appendTransformParams(
  params: URLSearchParams,
  options?: DirectusAssetTransformOptions,
): void {
  if (!options) return;

  const baseEntries: Array<[string, string | number | boolean | undefined]> = [
    ["width", options.width],
    ["height", options.height],
    ["quality", options.quality],
    ["fit", options.fit],
    ["format", options.format],
    ["key", options.key],
    ["withoutEnlargement", options.withoutEnlargement],
  ];

  for (const [key, value] of baseEntries) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }

  if (options.transforms) {
    for (const [transformKey, value] of Object.entries(options.transforms)) {
      if (value === undefined || value === null) continue;
      params.set(transformKey, String(value));
    }
  }
}

export function getDirectusAssetUrl(
  fileId: string | null | undefined,
  options?: DirectusAssetTransformOptions,
): string | null {
  if (!fileId) return null;

  // Server-side: if we have DIRECTUS_URL and DIRECTUS_STATIC_TOKEN, use direct URL with token
  const baseUrl = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_STATIC_TOKEN;
  if (baseUrl && token) {
    const params = new URLSearchParams();
    params.set("access_token", token);
    appendTransformParams(params, options);
    const queryString = params.toString();
    return `${baseUrl}/assets/${fileId}?${queryString}`;
  }

  // Client-side or when token not available: use API proxy route
  // This handles authentication server-side via the API route
  const params = new URLSearchParams();
  appendTransformParams(params, options);
  const queryString = params.toString();
  return `/api/assets/${fileId}${queryString ? `?${queryString}` : ""}`;
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
  const seasonYear = sortedEvents[0]?.season_year ?? DEFAULT_SCHEDULE_EVENTS[0].season_year;
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
