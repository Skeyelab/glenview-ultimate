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
  club_description?: string | null;
  what_kids_learn?: string[] | null;
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

interface DirectusResponse<T> {
  data: T[];
}

function isDirectusResponse(value: unknown): value is { data: unknown[] } {
  return typeof value === 'object' && value !== null && 'data' in value && Array.isArray(value.data);
}

async function directusFetch<T>(path: string, init?: RequestInit): Promise<DirectusResponse<T>> {
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
  const json: unknown = await res.json();
  if (isDirectusResponse(json)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Directus API returns typed data, but we can't validate the generic type T at runtime
    const response: DirectusResponse<T> = { data: json.data as T[] };
    return response;
  }
  throw new Error('Invalid Directus response format');
}

export async function getHomePage(): Promise<Page | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch<Page>(`/items/pages?filter[slug][_eq]=home&limit=1&fields=*`);
  return data.data[0] ?? null;
}

export async function getAboutPage(): Promise<Page | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch<Page>(`/items/pages?filter[slug][_eq]=about&limit=1&fields=*`);
  return data.data[0] ?? null;
}

export async function getPeople(): Promise<Person[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch<Person>(`/items/people?fields=*`);
  return data.data;
}

export async function getPartners(): Promise<Partner[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch<Partner>(`/items/partners?fields=*`);
  return data.data;
}

// Seasons
export async function getCurrentSeason(): Promise<Season | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch<Season>(`/items/seasons?limit=1&sort[]=-year&fields=*`);
  return data.data[0] ?? null;
}

// News
export async function getNewsList(limit = 20): Promise<NewsPost[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch<NewsPost>(`/items/news?limit=${limit}&sort[]=-published_at&fields=*`);
  return data.data;
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch<NewsPost>(`/items/news?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1&fields=*`);
  return data.data[0] ?? null;
}

// Helper to get Directus asset URL from file UUID
// Use NEXT_PUBLIC_DIRECTUS_URL for client components, DIRECTUS_URL for server components
export function getDirectusAssetUrl(fileId: string | null | undefined): string | null {
  if (!fileId) return null;
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? process.env.DIRECTUS_URL;
  if (!baseUrl) return null;
  return `${baseUrl}/assets/${fileId}`;
}
