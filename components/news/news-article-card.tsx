import React from "react";
import Link from "next/link";
import type { NewsPost } from "@/lib/directus";
import { cn } from "@/lib/utils";

export interface NewsArticleCardProps {
  post: NewsPost;
  showExcerpt?: boolean;
  showReadMore?: boolean;
  readMoreLabel?: string;
  dateFormat?: (date: string) => string;
  className?: string;
  titleAs?: keyof React.JSX.IntrinsicElements;
}

const defaultDateFormat = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export function NewsArticleCard({
  post,
  showExcerpt = true,
  showReadMore = true,
  readMoreLabel = "Read more",
  dateFormat = defaultDateFormat,
  className,
  titleAs: TitleTag = "h2",
}: NewsArticleCardProps): React.JSX.Element {
  return (
    <article className={cn("border border-white/20 rounded-lg p-4", className)}>
      <TitleTag className="text-xl font-semibold text-white">
        <Link href={`/news/${post.slug}`} className="hover:text-white/80">
          {post.title}
        </Link>
      </TitleTag>
      {post.published_at && (
        <div className="text-xs text-white/70">{dateFormat(post.published_at)}</div>
      )}
      {showExcerpt && post.excerpt && <p className="text-white/90 mt-2">{post.excerpt}</p>}
      {showReadMore && (
        <div className="mt-2">
          <Link className="text-sm underline text-white/80 hover:text-white" href={`/news/${post.slug}`}>
            {readMoreLabel}
          </Link>
        </div>
      )}
    </article>
  );
}
