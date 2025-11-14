import React from "react";

interface SeasonHighlightsCardProps {
  highlights: string[];
  title?: string;
  emptyMessage?: string;
}

export function SeasonHighlightsCard({
  highlights,
  title = "Season Highlights",
  emptyMessage = "Highlights coming soon.",
}: SeasonHighlightsCardProps): React.JSX.Element {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      {highlights.length > 0 ? (
        <ul className="list-disc space-y-2 ps-5 text-white/90">
          {highlights.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-white/80">{emptyMessage}</p>
      )}
    </div>
  );
}
