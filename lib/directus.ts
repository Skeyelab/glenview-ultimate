import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

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

export interface Person {
  id: number;
  name: string;
  role: string;
  email?: string | null;
  bio?: string | null;
  photo?: string | null;
}

export interface Season {
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

function getDirectusUrl(): string {
  const url = process.env.DIRECTUS_URL;
  if (!url) throw new Error("DIRECTUS_URL not configured");
  return url;
}

function getDirectusToken(): string | undefined {
  return process.env.DIRECTUS_STATIC_TOKEN;
}

function haveEnv(): boolean {
  return Boolean(process.env.DIRECTUS_URL && process.env.DIRECTUS_STATIC_TOKEN);
}

function getDirectusClient() {
  const url = getDirectusUrl();
  const token = getDirectusToken();
  const client = createDirectus(url).with(rest());
  if (token) {
    return client.with(staticToken(token));
  }
  return client;
}

export async function getHomePage(): Promise<Page | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request(
    readItems('pages', {
      filter: { slug: { _eq: 'home' } },
      limit: 1,
      fields: ['*'],
    })
  );

  return (data as Page[])[0] ?? null;
}

export async function getPeople(): Promise<Person[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  const data = await client.request(
    readItems('people', {
      fields: ['*'],
    })
  );

  return data as Person[];
}

export async function getPartners(): Promise<Partner[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  const data = await client.request(
    readItems('partners', {
      fields: ['*'],
    })
  );

  return data as Partner[];
}

// Seasons
export async function getCurrentSeason(): Promise<Season | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request(
    readItems('seasons', {
      limit: 1,
      sort: ['-year'],
      fields: ['*'],
    })
  );

  return (data as Season[])[0] ?? null;
}

// News
export async function getNewsList(limit = 20): Promise<NewsPost[]> {
  if (!haveEnv()) return [];
  const client = getDirectusClient();
  const data = await client.request(
    readItems('news', {
      limit,
      sort: ['-published_at'],
      fields: ['*'],
    })
  );

  return data as NewsPost[];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  if (!haveEnv()) return null;
  const client = getDirectusClient();
  const data = await client.request(
    readItems('news', {
      filter: { slug: { _eq: slug } },
      limit: 1,
      fields: ['*'],
    })
  );

  return (data as NewsPost[])[0] ?? null;
}

// Helper to get Directus asset URL from file UUID
// Use NEXT_PUBLIC_DIRECTUS_URL for client components, DIRECTUS_URL for server components
export function getDirectusAssetUrl(fileId: string | null | undefined): string | null {
  if (!fileId) return null;
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? process.env.DIRECTUS_URL;
  if (!baseUrl) return null;
  return `${baseUrl}/assets/${fileId}`;
}
