import React from "react";
import { getNewsBySlug } from "@/lib/directus";
import { marked } from "marked";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { NewsPost } from "@/components/news/news-post";
import { DEFAULT_REVALIDATE_SECONDS } from "@/lib/config";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export default async function NewsPostPage({ params }: { params: { slug: string } }): Promise<React.JSX.Element> {
  const post = await getNewsBySlug(params.slug);
  if (!post) return notFound();

  const rawHtml = await marked.parse(post.content);
  const html = sanitizeHtml(rawHtml);

  return <NewsPost post={post} htmlContent={html} />;
}
