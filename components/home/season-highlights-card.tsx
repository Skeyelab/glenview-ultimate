import React from "react";
import { SectionCard } from "@/components/ui/section-card";

export interface SeasonHighlightsCardProps {
  highlights: string[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

export function SeasonHighlightsCard({
  highlights,
  title = "Season Highlights",
  emptyMessage = "Highlights coming soon.",
  className,
}: SeasonHighlightsCardProps): React.JSX.Element {
  return (
    <SectionCard title={title} className={className}>
      {highlights.length > 0 ? (
        <ul className="list-disc ps-5 space-y-1 text-white/90">
          {highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : (
        <p className="text-white/90">{emptyMessage}</p>
      )}
    </SectionCard>
  );
}
