import React from "react";
import { getNewsBySlug } from "@/lib/directus";
import { parseMarkdown } from "@/lib/markdown-utils";
import { notFound } from "next/navigation";
import { NewsPost } from "@/components/news/news-post";

// Using DEFAULT_REVALIDATE_SECONDS from @/lib/config (currently 60)
export const revalidate = 60;

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return notFound();

  const html = await parseMarkdown(post.content);

  return <NewsPost post={post} htmlContent={html} />;
}
