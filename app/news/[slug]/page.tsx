import { getNewsBySlug } from "@/lib/directus";
import { marked } from "marked";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = await getNewsBySlug(params.slug);
  if (!post) return notFound();

  const html = post.content ? await marked.parse(post.content) : "";

  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      <p className="!mt-0 text-sm text-slate-500">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
