import React from "react";
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
    <article className={cn("prose prose-invert max-w-none", className)}>
      <h1 className="text-white">{post.title}</h1>
      {publishedAt && <p className="!mt-0 text-sm text-white/70">{publishedAt}</p>}
      <div className={cn("text-white/90", contentClassName)} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}
