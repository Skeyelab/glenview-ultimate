import React from "react";
import type { ScheduleEvent } from "@/lib/directus";
import { formatDateRange, formatDay, formatTimeRange } from "@/lib/date-utils";
import { ScheduleEventCard } from "./event-card";

interface SeasonTimelineProps {
  events: ScheduleEvent[];
  title?: string;
  highlightLabel?: string;
  renderEventCard?: (event: ScheduleEvent, index: number) => React.ReactNode;
  emptyMessage?: string;
}

export function SeasonTimeline({
  events,
  title = "Season Timeline",
  highlightLabel,
  renderEventCard,
  emptyMessage = "Timeline coming soon.",
}: SeasonTimelineProps): React.JSX.Element {
  return (
    <section className="card">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      {events.length > 0 ? (
        <ol className="relative pl-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-white/20">
          {events.map((event, index) => {
            const timeRange = formatTimeRange(event);
            return (
              <li
                key={event.id}
                className="relative pl-6 pb-6 last:pb-0 md:grid md:grid-cols-[minmax(180px,240px)_1fr] md:gap-6"
              >
                <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white/40 bg-[#175230]" />
                <div className="mb-3 md:mb-0">
                  <div className="text-xs uppercase tracking-wide text-white/60">{formatDay(event.date)}</div>
                  <div className="text-sm font-semibold text-white">{formatDateRange(event)}</div>
                  {timeRange && <div className="text-xs text-white/60 mt-1">{timeRange}</div>}
                </div>
                {renderEventCard?.(event, index) ?? (
                  <ScheduleEventCard
                    event={event}
                    highlightLabel={highlightLabel}
                    withOutline={index === 0}
                    showDescription
                    showLocation
                  />
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-white/80">{emptyMessage}</p>
      )}
    </section>
  );
}
