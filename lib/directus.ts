export type Page = {
  id: number;
  slug: string;
  title: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  content?: string | null;
};

export type Partner = {
  id: number;
  name: string;
  url: string;
  logo?: string | null;
};

export type Person = {
  id: number;
  name: string;
  role: string;
  email?: string | null;
  bio?: string | null;
  photo?: string | null;
};

export type Season = {
  id: number;
  year: number;
  title?: string | null;
  highlights?: string[] | null; // array of bullet points
  start_month?: string | null;  // e.g., "March"
  end_month?: string | null;    // e.g., "May"
};

export type NewsPost = {
  id: number;
  slug: string;
  title: string;
  published_at?: string | null;
  excerpt?: string | null;
  content?: string | null; // markdown or HTML
};

const DIRECTUS_URL = process.env.DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN!;

function haveEnv() {
  return Boolean(DIRECTUS_URL && DIRECTUS_TOKEN);
}

async function directusFetch(path: string, init?: RequestInit) {
  if(!DIRECTUS_URL) throw new Error("DIRECTUS_URL not configured");
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
      ...(DIRECTUS_TOKEN ? { "authorization": `Bearer ${DIRECTUS_TOKEN}` } : {}),
    },
    cache: "no-store"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Directus error: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function getHomePage(): Promise<Page | null> {
  if (!haveEnv()) return null;
  const data = await directusFetch(`/items/pages?filter[slug][_eq]=home&limit=1&fields=*`);
  return data?.data?.[0] ?? null;
}

export async function getPeople(): Promise<Person[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch(`/items/people?fields=*`);
  return data?.data ?? [];
}

export async function getPartners(): Promise<Partner[]> {
  if (!haveEnv()) return [];
  const data = await directusFetch(`/items/partners?fields=*`);
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
