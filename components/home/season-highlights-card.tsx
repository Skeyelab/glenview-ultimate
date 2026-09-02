import React from "react";
import { SectionCard } from "@/components/ui/section-card";
import { EventTypeBadge } from "@/components/schedule/event-badge";
import type { ScheduleEvent } from "@/lib/directus";
import { formatDateShort, formatDateRange } from "@/lib/date-utils";

export interface SeasonHighlightsCardProps {
  /** @deprecated Use `events` instead for richer display with badges */
  highlights?: string[];
  events?: ScheduleEvent[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

function formatEventDate(event: ScheduleEvent): string {
  if (event.end_date) return formatDateRange(event);
  return formatDateShort(event.date);
}

export function SeasonHighlightsCard({
  highlights = [],
  events,
  title = "Season Highlights",
  emptyMessage = "Highlights coming soon.",
  className,
}: SeasonHighlightsCardProps): React.JSX.Element {
  const hasEvents = events && events.length > 0;
  const hasHighlights = highlights.length > 0;

  return (
    <SectionCard title={title} className={className}>
      {hasEvents ? (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <EventTypeBadge type={event.event_type} size="sm" />
                <span className="text-xs text-white/60">{formatEventDate(event)}</span>
              </div>
              <span className="text-white/90 font-medium">{event.title}</span>
              {event.location && (
                <span className="text-xs text-white/70">{event.location}</span>
              )}
            </li>
          ))}
        </ul>
      ) : hasHighlights ? (
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
