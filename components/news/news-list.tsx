import React from "react";
import type { NewsPost } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { NewsArticleCard } from "./news-article-card";

export interface NewsListProps {
  posts: NewsPost[];
  emptyMessage?: string;
  renderArticle?: (post: NewsPost) => React.ReactNode;
  className?: string;
}

export function NewsList({
  posts,
  emptyMessage = "Nothing posted yet. Check back soon.",
  renderArticle,
  className,
}: NewsListProps): React.JSX.Element {
  if (posts.length === 0) {
    return <p className="text-white/90">{emptyMessage}</p>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {posts.map((post) => (
        <React.Fragment key={post.id}>{renderArticle?.(post) ?? <NewsArticleCard post={post} />}</React.Fragment>
      ))}
    </div>
  );
}
