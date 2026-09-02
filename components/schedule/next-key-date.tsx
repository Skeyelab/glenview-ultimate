import React from "react";
import type { ScheduleEvent } from "@/lib/directus";
import { formatDateRange, safeParseDate } from "@/lib/date-utils";
import { EventTypeBadge } from "./event-badge";

interface NextKeyDateProps {
  event?: ScheduleEvent;
  title?: string;
  className?: string;
}

export function NextKeyDate({ event, title = "Next Key Date", className = "" }: NextKeyDateProps): React.JSX.Element | null {
  if (!event) return null;

  // A past event is not a "next" key date. When a season ends and the new one
  // has no rows yet, this hides rather than presenting a stale date as upcoming.
  const eventDate = safeParseDate(event.end_date ?? event.date);
  if (!eventDate || eventDate.getTime() < Date.now()) return null;

  return (
    <div className={`shrink-0 rounded-xl border border-white/25 bg-white/10 p-4 md:min-w-[220px] space-y-2 ${className}`}>
      <p className="text-[0.65rem] uppercase tracking-widest text-white/70 font-semibold">{title}</p>
      <div className="space-y-1.5">
        <EventTypeBadge type={event.event_type} size="sm" />
        <p className="font-semibold text-white leading-snug">{event.title}</p>
        <p className="text-xs text-white/60">{formatDateRange(event)}</p>
      </div>
    </div>
  );
}
