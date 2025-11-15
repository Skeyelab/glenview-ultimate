import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/directus";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.glenview-ultimate.org").replace(/\/+$/, "");

const STATIC_PATHS: Array<{ path: string; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/register", changeFrequency: "weekly", priority: 0.9 },
  { path: "/schedule", changeFrequency: "monthly", priority: 0.7 },
  { path: "/news", changeFrequency: "daily", priority: 0.8 },
  { path: "/what-is-ultimate", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const newsPosts = await getNewsList(100);
  const newsEntries: MetadataRoute.Sitemap = newsPosts.map((post) => ({
    url: `${BASE_URL}/news/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...newsEntries];
}
