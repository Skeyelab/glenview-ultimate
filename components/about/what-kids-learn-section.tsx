import React from "react";
import { cn } from "@/lib/utils";

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
    <section className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {items.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/60 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/80">{emptyMessage}</p>
      )}
    </section>
  );
}
