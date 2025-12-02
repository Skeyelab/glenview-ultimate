import React from "react";
import { getNewsBySlug } from "@/lib/directus";
import { marked } from "marked";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { NewsPost } from "@/components/news/news-post";

export const revalidate = 300;

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return notFound();

  const rawHtml = await marked.parse(post.content, { async: true });
  const html = sanitizeHtml(rawHtml);

  return <NewsPost post={post} htmlContent={html} />;
}
