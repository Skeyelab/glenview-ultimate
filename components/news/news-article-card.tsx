import React from "react";
import Link from "next/link";
import type { NewsPost } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { formatFullDate } from "@/lib/date-utils";

export interface NewsArticleCardProps {
  post: NewsPost;
  showExcerpt?: boolean;
  showReadMore?: boolean;
  readMoreLabel?: string;
  dateFormat?: (date: string) => string | null;
  className?: string;
  titleAs?: keyof React.JSX.IntrinsicElements;
}

export function NewsArticleCard({
  post,
  showExcerpt = true,
  showReadMore = true,
  readMoreLabel = "Read more →",
  dateFormat = formatFullDate,
  className,
  titleAs: TitleTag = "h2",
}: NewsArticleCardProps): React.JSX.Element {
  const publishedAt = post.published_at ? dateFormat(post.published_at) : null;

  return (
    <article className={cn("group border border-white/20 rounded-xl p-5 transition-colors duration-150 hover:border-white/40 hover:bg-white/5", className)}>
      <div className="space-y-2">
        {publishedAt && (
          <div className="text-xs uppercase tracking-widest text-white/40 font-medium">{publishedAt}</div>
        )}
        <TitleTag className="text-xl font-semibold text-white">
          <Link href={`/news/${post.slug}`} className="hover:text-white/80 transition-colors">
            {post.title}
          </Link>
        </TitleTag>
        {showExcerpt && post.excerpt && (
          <p className="text-white/70 text-sm leading-relaxed">{post.excerpt}</p>
        )}
        {showReadMore && (
          <div className="pt-1">
            <Link
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              href={`/news/${post.slug}`}
            >
              {readMoreLabel}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
