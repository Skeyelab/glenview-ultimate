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
      <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>
      {events.length > 0 ? (
        <ol className="relative pl-5 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-px before:bg-white/20">
          {events.map((event, index) => {
            const timeRange = formatTimeRange(event);
            const isFirst = index === 0;
            return (
              <li
                key={event.id}
                className="group relative pl-7 pb-8 last:pb-0 md:grid md:grid-cols-[minmax(160px,220px)_1fr] md:gap-6"
              >
                {/* timeline dot — white fill for first event, ring-only for rest */}
                <span
                  className={`absolute left-0 top-1.5 h-[18px] w-[18px] rounded-full border-2 transition-colors duration-200 ${
                    isFirst
                      ? "border-white bg-white"
                      : "border-white/50 bg-transparent group-hover:border-white group-hover:bg-white/20"
                  }`}
                />
                <div className="mb-3 md:mb-0 pt-0.5">
                  <div className="text-[0.65rem] uppercase tracking-widest text-white/40 font-medium">
                    {formatDay(event.date)}
                  </div>
                  <div className="text-sm font-semibold text-white">{formatDateRange(event)}</div>
                  {timeRange && <div className="text-xs text-white/50 mt-0.5">{timeRange}</div>}
                </div>
                {renderEventCard?.(event, index) ?? (
                  <ScheduleEventCard
                    event={event}
                    highlightLabel={highlightLabel}
                    withOutline={isFirst}
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
