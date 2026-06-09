import React from "react";
import Link from "next/link";
import type { NewsPost } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { formatFullDate } from "@/lib/date-utils";

export interface NewsPostProps {
  post: NewsPost;
  htmlContent: string;
  dateFormat?: (date: string) => string | null;
  className?: string;
  contentClassName?: string;
}

export function NewsPost({
  post,
  htmlContent,
  dateFormat = formatFullDate,
  className,
  contentClassName,
}: NewsPostProps): React.JSX.Element {
  const publishedAt = post.published_at ? dateFormat(post.published_at) : null;

  return (
    <div className="space-y-6">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
      >
        ← All news
      </Link>
      <article className={cn("prose prose-invert max-w-none", className)}>
        {publishedAt && (
          <p className="!mt-0 text-xs uppercase tracking-widest text-white/40 font-medium not-prose">{publishedAt}</p>
        )}
        <h1 className="text-white">{post.title}</h1>
        <div className={cn("text-white/90", contentClassName)} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </div>
  );
}
