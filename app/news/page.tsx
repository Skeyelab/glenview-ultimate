import React from "react";
import { getNewsList } from "@/lib/directus";
import { NewsHeader } from "@/components/news/news-header";
import { NewsList } from "@/components/news/news-list";
import { DEFAULT_REVALIDATE_SECONDS } from "@/lib/config";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

export default async function NewsIndex(): Promise<React.JSX.Element> {
  const posts = await getNewsList();

  return (
    <div className="space-y-6">
      <NewsHeader />
      <NewsList posts={posts} />
    </div>
  );
}
