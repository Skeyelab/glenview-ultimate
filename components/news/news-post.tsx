import React from "react";
import type { NewsPost } from "@/lib/directus";
import { cn } from "@/lib/utils";

export interface NewsPostProps {
  post: NewsPost;
  htmlContent: string;
  dateFormat?: (date: string) => string;
  className?: string;
  contentClassName?: string;
}

const defaultDateFormat = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export function NewsPost({
  post,
  htmlContent,
  dateFormat = defaultDateFormat,
  className,
  contentClassName,
}: NewsPostProps): React.JSX.Element {
  return (
    <article className={cn("prose prose-invert max-w-none", className)}>
      <h1 className="text-white">{post.title}</h1>
      {post.published_at && (
        <p className="!mt-0 text-sm text-white/70">{dateFormat(post.published_at)}</p>
      )}
      <div className={cn("text-white/90", contentClassName)} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}
