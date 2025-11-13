import { createDirectus, readItems, rest, staticToken } from "@directus/sdk";
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

export interface ScheduleEntry {
  id: number;
  year: number;
  title?: string | null;
  highlights?: string[] | null; // array of bullet points
  start_month?: string | null;  // e.g., "March"
  end_month?: string | null;    // e.g., "May"
}

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  published_at: string;
  excerpt?: string | null;
  content: string; // markdown or HTML
}

export interface DirectusSchema {
  Pages: Page;
  Team: TeamMember;
  Partners: Partner;
  Schedule: ScheduleEntry;
  News: NewsPost;
  Registrations: Record<string, unknown>;
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

let directusClient: DirectusRestClient | null = null;

function initDirectusClient(): DirectusRestClient {
  const { url, token } = getDirectusConfig();
  return createDirectus<DirectusSchema>(url)
    .with(staticToken(token))
    .with(rest());
}

function getDirectusClient(): DirectusRestClient {
  if (!directusClient) {
    directusClient = initDirectusClient();
  }
  return directusClient;
}

type RestRequest = Parameters<DirectusRestClient["request"]>[0];

async function directusRequest<T>(request: RestRequest): Promise<T> {
  const client = getDirectusClient();
  return await client.request(request) as T;
}

export async function getHomePage(): Promise<Page | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request<Page[]>(
    (readItems as any)('Pages', {
      filter: { slug: { _eq: 'home' } },
      limit: 1,
      fields: ['*']
    })
  );
  return data[0] ?? null;
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  return await client.request<TeamMember[]>(
    (readItems as any)('Team', { fields: ['*'] })
  );
}

export async function getPartners(): Promise<Partner[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  return await client.request<Partner[]>(
    (readItems as any)('Partners', { fields: ['*'] })
  );
}

export async function getSchedule(): Promise<ScheduleEntry | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request<ScheduleEntry[]>(
    (readItems as any)('Schedule', {
      limit: 1,
      sort: ['-year'],
      fields: ['*']
    })
  );
  return data[0] ?? null;
}

export async function getNewsList(limit = 20): Promise<NewsPost[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  return await client.request<NewsPost[]>(
    (readItems as any)('News', {
      limit,
      sort: ['-published_at'],
      fields: ['*']
    })
  );
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request<NewsPost[]>(
    (readItems as any)('News', {
      filter: { slug: { _eq: slug } },
      limit: 1,
      fields: ['*']
    })
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
