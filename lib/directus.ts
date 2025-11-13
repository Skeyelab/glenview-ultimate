import { createDirectus, createItem, readItems, rest, staticToken } from "@directus/sdk";
import type { DirectusClient, RestClient, StaticTokenClient } from "@directus/sdk";

export interface Page {
  id: number;
  slug: string;
  title: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_tagline?: string | null;
  hero_message1?: string | null;
  hero_message2?: string | null;
  pre_registration_text?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  content?: string | null;
}

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
  end_date?: string | null;
  location?: string | null;
  description?: string | null;
  highlight?: boolean | null;
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

export interface DirectusSchema {
  Pages: Page[];
  Team: TeamMember[];
  Partners: Partner[];
  Schedule: ScheduleEvent[];
  News: NewsPost[];
  About: About[];
  Registrations: Registration[];
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

export async function getHomePage(): Promise<Page | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request(
    readItems("Pages", {
      filter: { slug: { _eq: "home" } },
      limit: 1,
      fields: ["*"],
    }),
  );
  return data[0] ?? null;
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  return await client.request(
    readItems("Team", { fields: ["*"] }),
  );
}

export async function getPartners(): Promise<Partner[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  return await client.request(
    readItems("Partners", { fields: ["*"] }),
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
    highlight: true,
  },
  {
    id: 2,
    season_year: 2026,
    event_type: "registration_close",
    title: "Registration & Uniform Orders Due",
    date: "2026-02-15T15:00:00.000Z",
    highlight: true,
  },
  {
    id: 3,
    season_year: 2026,
    event_type: "season_start",
    title: "Spring Season Kickoff Practice",
    date: "2026-03-01T21:30:00.000Z",
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
  },
  {
    id: 5,
    season_year: 2026,
    event_type: "tournament",
    title: "Tournament Opportunities",
    date: "2026-04-01T15:00:00.000Z",
    end_date: "2026-05-31T22:00:00.000Z",
    description: "Opportunity to attend 3-4 tournaments.",
  },
];

const DEFAULT_SCHEDULE: SeasonSchedule = buildSeasonSchedule(DEFAULT_SCHEDULE_EVENTS);

export async function getSchedule(): Promise<SeasonSchedule> {
  if (!haveEnv()) return DEFAULT_SCHEDULE;
  const client = getDirectusClient();
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
    .filter((event): event is ScheduleEvent => event.season_year === latestSeasonYear && Boolean(event.date))
    .map((event) => ({
      ...event,
      // Normalise empty strings to undefined for optional fields
      end_date: event.end_date ?? null,
      location: event.location ?? null,
      description: event.description ?? null,
      highlight: event.highlight ?? null,
    }));

  if (latestSeasonEvents.length === 0) {
    return DEFAULT_SCHEDULE;
  }

  return buildSeasonSchedule(latestSeasonEvents);
}

export async function getNewsList(limit = 20): Promise<NewsPost[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  return await client.request(
    readItems("News", {
      limit,
      sort: ["-published_at"],
      fields: ["*"],
    }),
  );
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request(
    readItems("News", {
      filter: { slug: { _eq: slug } },
      limit: 1,
      fields: ["*"],
    }),
  );
  return data[0] ?? null;
}

export async function getAbout(): Promise<About | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request(
    readItems("About", {
      limit: 1,
      fields: ["*"],
    }),
  );
  return data[0] ?? null;
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
  const date = parseDate(isoDate);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}

function formatMonthYear(isoDate: string): string {
  const date = parseDate(isoDate);
  if (!date) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function parseDate(isoDate: string | null | undefined): Date | null {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}
