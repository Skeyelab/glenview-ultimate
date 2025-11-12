export interface Page {
  id: number;
  slug: string;
  title: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
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

function haveEnv() {
  return Boolean(process.env.DIRECTUS_URL && process.env.DIRECTUS_STATIC_TOKEN);
}

async function directusFetch(path: string, init?: RequestInit) {
  const url = getDirectusUrl();
  const token = getDirectusToken();
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(token ? { "authorization": `Bearer ${token}` } : {}),
  };
  // Merge init headers if provided and it's a plain object
  if (init?.headers && typeof init.headers === 'object' && !Array.isArray(init.headers) && !(init.headers instanceof Headers)) {
    Object.assign(headers, init.headers);
  }
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Directus error: ${res.status} ${res.statusText} - ${text}`);
  }
  return await res.json();
}

export async function getHomePage(): Promise<Page | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch(`/items/pages?filter[slug][_eq]=home&limit=1&fields=*`);
  if (!data) return null;
  return data?.data?.[0] ?? null;
}

export async function getPeople(): Promise<Person[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch(`/items/people?fields=*`);
  return data?.data ?? [];
}

export async function getPartners(): Promise<Partner[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch(`/items/partners?fields=*&sort[]=name`);
  return data?.data ?? [];
}

// Seasons
export async function getCurrentSeason(): Promise<Season | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch(`/items/seasons?limit=1&sort[]=-year&fields=*`);
  return data?.data?.[0] ?? null;
}

// News
export async function getNewsList(limit = 20): Promise<NewsPost[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch(`/items/news?limit=${limit}&sort[]=-published_at&fields=*`);
  return data?.data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch(`/items/news?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1&fields=*`);
  return data?.data?.[0] ?? null;
}

// Helper to get Directus asset URL from file UUID
// Use NEXT_PUBLIC_DIRECTUS_URL for client components, DIRECTUS_URL for server components
export function getDirectusAssetUrl(fileId: string | null | undefined): string | null {
  if (!fileId) return null;
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL;
  if (!baseUrl) return null;
  return `${baseUrl}/assets/${fileId}`;
}
