import React from "react";

export interface WhatKidsLearnSectionProps {
  items: string[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

export function WhatKidsLearnSection({
  items,
  title = "What Kids Learn",
  emptyMessage = "Information coming soon.",
  className,
}: WhatKidsLearnSectionProps): React.JSX.Element {
  return (
    <section className={className ? `space-y-3 ${className}` : "space-y-3"}>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {items.length > 0 ? (
        <ul className="list-disc list-inside space-y-2 text-white/90">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-white/90">{emptyMessage}</p>
      )}
    </section>
  );
}
