import React from "react";
import type { ScheduleEvent } from "@/lib/directus";
import { formatDateShort, formatDay } from "@/lib/date-utils";
import { EventTypeBadge } from "./event-badge";

export interface MonthlyEventGroup {
  key: string;
  label: string;
  events: ScheduleEvent[];
}

interface SeasonCalendarProps {
  groups: MonthlyEventGroup[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  renderEvent?: (event: ScheduleEvent) => React.ReactNode;
}

export function SeasonCalendar({
  groups,
  title = "Season Calendar",
  subtitle = "Month-by-month snapshot of every key date",
  emptyMessage = "Calendar coming soon.",
  renderEvent,
}: SeasonCalendarProps): React.JSX.Element {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-white/60 hidden md:block">{subtitle}</p>}
      </div>
      {groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <article key={group.key} className="card space-y-3">
              <header className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">{group.label}</h3>
                <span className="text-xs uppercase tracking-wide text-white/50">
                  {group.events.length} {group.events.length === 1 ? "event" : "events"}
                </span>
              </header>
              <ul className="space-y-3">
                {group.events.map((event) => (
                  <li key={event.id}>
                    {renderEvent?.(event) ?? (
                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/60">{formatDay(event.date)}</p>
                            <p className="text-sm font-semibold text-white">{formatDateShort(event.date)}</p>
                          </div>
                          <EventTypeBadge type={event.event_type} size="sm" />
                        </div>
                        <p className="text-sm text-white/80 mt-2 font-medium">{event.title}</p>
                        {event.location && <p className="text-xs text-white/60 mt-1">Location: {event.location}</p>}
                        {event.description && <p className="text-xs text-white/60 mt-1">{event.description}</p>}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-white/80">{emptyMessage}</p>
      )}
    </section>
  );
}
