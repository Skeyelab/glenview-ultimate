import React from "react";
import { cn } from "@/lib/utils";

export interface DescriptionSectionProps {
  paragraphs: string[];
  className?: string;
}

export function DescriptionSection({ paragraphs, className }: DescriptionSectionProps): React.JSX.Element {
  return (
    <section className={cn("space-y-4", className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={`para-${index}`} className="text-white/90">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
