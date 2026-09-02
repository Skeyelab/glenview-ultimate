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
    <section className="space-y-5">
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
      </div>
      {groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <article key={group.key} className="card space-y-4">
              <header className="flex items-baseline justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white">{group.label}</h3>
                <span className="text-xs text-white/70 tabular-nums">
                  {group.events.length} {group.events.length === 1 ? "event" : "events"}
                </span>
              </header>
              <ul className="space-y-2">
                {group.events.map((event) => (
                  <li key={event.id}>
                    {renderEvent?.(event) ?? (
                      <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-colors duration-150 hover:bg-white/10 hover:border-white/20">
                        <div className="shrink-0 text-right min-w-[44px]">
                          <p className="text-[0.6rem] uppercase tracking-widest text-white/70 leading-none">
                            {formatDay(event.date).slice(0, 3)}
                          </p>
                          <p className="text-sm font-bold text-white leading-snug">{formatDateShort(event.date)}</p>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <EventTypeBadge type={event.event_type} size="sm" />
                          </div>
                          <p className="text-sm text-white font-medium leading-snug">{event.title}</p>
                          {event.location && (
                            <p className="text-xs text-white/70">Location: {event.location}</p>
                          )}
                          {event.description && (
                            <p className="text-xs text-white/70 line-clamp-2">{event.description}</p>
                          )}
                        </div>
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
