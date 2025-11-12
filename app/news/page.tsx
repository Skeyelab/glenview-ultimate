import Link from "next/link";
import { getNewsList } from "@/lib/directus";

export const revalidate = 300;

export default async function NewsIndex() {
  const posts = await getNewsList();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">News</h1>
      {!posts.length && <p className="text-white/90">Nothing posted yet. Check back soon.</p>}
      <div className="space-y-4">
        {posts.map((p) => (
          <article key={p.id} className="border border-white/20 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white">
              <Link href={`/news/${p.slug}`} className="hover:text-white/80">{p.title}</Link>
            </h2>
            <div className="text-xs text-white/70">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</div>
            {p.excerpt && <p className="text-white/90 mt-2">{p.excerpt}</p>}
            <div className="mt-2">
              <Link className="text-sm underline text-white/80 hover:text-white" href={`/news/${p.slug}`}>Read more</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
