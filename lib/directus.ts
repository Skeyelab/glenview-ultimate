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
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Directus error: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

// Public content helpers
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

// Form submit
export type RegistrationPayload = {
  parent1_name: string;
  parent1_email: string;
  parent1_phone?: string;
  parent2_name?: string;
  parent2_email?: string;
  parent2_phone?: string;
  children: Array<{
    full_name: string;
    age?: string;
    experience?: "beginner" | "intermediate" | "advanced";
    availability?: string[]; // weekdays
  }>;
  notes?: string;
  marketing_opt_in?: boolean;
};

export async function createRegistration(payload: RegistrationPayload) {
  if (!haveEnv()) throw new Error("Server missing Directus credentials");
  const data = await directusFetch(`/items/registrations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

// Asset URL helper
export function getDirectusAssetUrl(fileId: string | null | undefined): string | null {
  if (!fileId) {
    return null;
  }

  // Use NEXT_PUBLIC_DIRECTUS_URL when available (for client-side)
  // Fallback to DIRECTUS_URL (for server-side)
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL;

  if (!baseUrl) {
    return null;
  }

  return `${baseUrl}/assets/${fileId}`;
}
