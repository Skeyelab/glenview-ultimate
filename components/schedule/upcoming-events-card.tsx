import React from "react";
import type { ScheduleEvent } from "@/lib/directus";
import { formatDateRange, formatTimeRange } from "@/lib/date-utils";
import { SectionCard } from "@/components/ui/section-card";
import { ScheduleEventCard } from "./event-card";

interface UpcomingEventsCardProps {
  events: ScheduleEvent[];
  title?: string;
  emptyMessage?: string;
  highlightLabel?: string;
  renderEventCard?: (event: ScheduleEvent) => React.ReactNode;
}

export function UpcomingEventsCard({
  events,
  title = "Up Next",
  emptyMessage = "Season events coming soon.",
  highlightLabel,
  renderEventCard,
}: UpcomingEventsCardProps): React.JSX.Element {
  return (
    <SectionCard title={title}>
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              {renderEventCard?.(event) ?? (
                <ScheduleEventCard
                  event={event}
                  showDescription={false}
                  showLocation
                  highlightLabel={highlightLabel}
                  meta={
                    <div className="text-sm text-white/70">
                      <p>{formatDateRange(event)}</p>
                      {/* Time is the fact a parent is actually checking against
                          another activity, so it renders here rather than only
                          deep in the season timeline. */}
                      {formatTimeRange(event) && (
                        <p className="font-medium text-white/90">{formatTimeRange(event)}</p>
                      )}
                    </div>
                  }
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/80">{emptyMessage}</p>
      )}
    </SectionCard>
  );
}
