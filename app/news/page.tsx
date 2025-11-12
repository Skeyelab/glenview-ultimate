import Link from "next/link";
import { getNewsList } from "@/lib/directus";

export const revalidate = 300;

export default async function NewsIndex() {
  const posts = await getNewsList();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">News</h1>
      {!posts.length && <p className="text-slate-700">Nothing posted yet. Check back soon.</p>}
      <div className="space-y-4">
        {posts.map((p) => (
          <article key={p.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">
              <Link href={`/news/${p.slug}`}>{p.title}</Link>
            </h2>
            <div className="text-xs text-slate-500">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</div>
            {p.excerpt && <p className="text-slate-700 mt-2">{p.excerpt}</p>}
            <div className="mt-2">
              <Link className="text-sm underline" href={`/news/${p.slug}`}>Read more</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
