import React from "react";
import { cn } from "@/lib/utils";
import sanitizeHtml from "sanitize-html";

export interface DescriptionSectionProps {
  htmlContent?: string | null;
  paragraphs?: string[];
  className?: string;
}

export function DescriptionSection({ htmlContent, paragraphs, className }: DescriptionSectionProps): React.JSX.Element {
  // If HTML content is provided, use it (sanitized)
  if (htmlContent) {
    const sanitized = sanitizeHtml(htmlContent);
    return (
      <section className={cn("space-y-4", className)}>
        <div className="text-white/90 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitized }} />
      </section>
    );
  }

  // Fallback to paragraphs array for backward compatibility
  if (paragraphs && paragraphs.length > 0) {
    return (
      <section className={cn("space-y-4", className)}>
        {paragraphs.map((paragraph, index) => (
          <p key={`${paragraph}-${index}`} className="text-white/90">
            {paragraph}
          </p>
        ))}
      </section>
    );
  }

  return <></>;
}
