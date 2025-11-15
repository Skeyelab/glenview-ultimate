import React from "react";
import type { ScheduleEvent } from "@/lib/directus";
import { formatDateShort, formatDay, safeParseDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { EventTypeBadge, EVENT_TYPE_ACCENTS } from "./event-badge";

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

interface CalendarDay {
  key: string;
  label: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  events: ScheduleEvent[];
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const GROUP_EMPTY_MESSAGE = "No scheduled events for this month yet.";

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
        {subtitle && <p className="hidden text-sm text-white/60 md:block">{subtitle}</p>}
      </div>
      {groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => {
            const sortedEvents = sortEventsByDate(group.events);
            const calendarDays = buildCalendarDaysForGroup(group.key, sortedEvents);

            return (
              <article key={group.key} className="card space-y-4">
                <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{group.label}</h3>
                    {!calendarDays && (
                      <p className="text-xs uppercase tracking-wide text-amber-200/80">Dates are still being finalized</p>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-wide text-white/50">
                    {sortedEvents.length} {sortedEvents.length === 1 ? "event" : "events"}
                  </span>
                </header>

                {calendarDays ? (
                  <>
                    <CalendarGrid days={calendarDays} hasEvents={sortedEvents.length > 0} />
                    <MobileEventList events={sortedEvents} renderEvent={renderEvent} />
                  </>
                ) : (
                  <MobileEventList events={sortedEvents} renderEvent={renderEvent} emptyMessage={GROUP_EMPTY_MESSAGE} />
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-white/80">{emptyMessage}</p>
      )}
    </section>
  );
}

function CalendarGrid({ days, hasEvents }: { days: CalendarDay[]; hasEvents: boolean }): React.JSX.Element {
  return (
    <div className="hidden md:block">
      <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-white/60">
        {DAY_LABELS.map((label) => (
          <span key={label} className="pb-1">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
        {days.map((day) => (
          <CalendarCell key={day.key} day={day} />
        ))}
      </div>
      {!hasEvents && <p className="mt-3 text-sm text-white/60">{GROUP_EMPTY_MESSAGE}</p>}
    </div>
  );
}

function CalendarCell({ day }: { day: CalendarDay }): React.JSX.Element {
  return (
    <div
      className={cn(
        "min-h-[120px] bg-[#0b1c16]/70 p-2 transition-colors",
        day.inCurrentMonth ? "text-white" : "text-white/35 bg-white/[0.04]",
      )}
    >
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-semibold", day.inCurrentMonth ? "text-white" : "text-white/40")}>{day.label}</span>
        {day.isToday && (
          <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-emerald-300">Today</span>
        )}
      </div>
      {day.events.length > 0 && (
        <ul className="mt-2 space-y-1">
          {day.events.map((event) => (
            <li key={`${day.key}-${event.id}`}>
              <div className="flex items-center gap-2 rounded-md bg-white/10 px-2 py-1">
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", EVENT_TYPE_ACCENTS[event.event_type])}
                  aria-hidden="true"
                />
                <p className="truncate text-[0.7rem] font-medium text-white">{event.title}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MobileEventList({
  events,
  renderEvent,
  emptyMessage = GROUP_EMPTY_MESSAGE,
}: {
  events: ScheduleEvent[];
  renderEvent?: (event: ScheduleEvent) => React.ReactNode;
  emptyMessage?: string;
}): React.JSX.Element {
  if (events.length === 0) {
    return <p className="text-sm text-white/70">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-3 md:hidden">
      {events.map((event) => (
        <li key={event.id}>{renderEvent?.(event) ?? <DefaultEventCard event={event} />}</li>
      ))}
    </ul>
  );
}

function DefaultEventCard({ event }: { event: ScheduleEvent }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60">{formatDay(event.date)}</p>
          <p className="text-sm font-semibold text-white">{formatDateShort(event.date)}</p>
        </div>
        <EventTypeBadge type={event.event_type} size="sm" />
      </div>
      <p className="mt-2 text-sm font-medium text-white/90">{event.title}</p>
      {event.location && <p className="mt-1 text-xs text-white/70">Location: {event.location}</p>}
      {event.description && <p className="mt-1 text-xs text-white/70">{event.description}</p>}
    </div>
  );
}

function buildCalendarDaysForGroup(key: string, events: ScheduleEvent[]): CalendarDay[] | null {
  const parsed = parseMonthKey(key);
  if (!parsed) return null;
  return buildCalendarDays(parsed.year, parsed.month, events);
}

function buildCalendarDays(year: number, month: number, events: ScheduleEvent[]): CalendarDay[] {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const firstWeekday = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const gridStart = new Date(Date.UTC(year, month, 1));
  gridStart.setUTCDate(gridStart.getUTCDate() - firstWeekday);

  const gridEnd = new Date(gridStart);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + totalCells - 1);

  const eventsByDay = mapEventsToRange(events, gridStart, gridEnd);
  const todayKey = formatIsoDateKey(new Date());

  const days: CalendarDay[] = [];
  for (let i = 0; i < totalCells; i += 1) {
    const current = new Date(gridStart);
    current.setUTCDate(current.getUTCDate() + i);

    const isoKey = formatIsoDateKey(current);
    days.push({
      key: isoKey,
      label: current.getUTCDate(),
      inCurrentMonth: current.getUTCMonth() === month,
      isToday: isoKey === todayKey,
      events: eventsByDay.get(isoKey) ?? [],
    });
  }

  return days;
}

function mapEventsToRange(
  events: ScheduleEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): Map<string, ScheduleEvent[]> {
  const eventsByDay = new Map<string, ScheduleEvent[]>();
  const rangeStartMs = rangeStart.getTime();
  const rangeEndMs = rangeEnd.getTime();

  events.forEach((event) => {
    const startDate = safeParseDate(event.date);
    if (!startDate) return;
    const endDate = safeParseDate(event.end_date) ?? startDate;

    let cursor = startOfUtcDay(startDate);
    const eventEnd = startOfUtcDay(endDate);

    while (cursor.getTime() <= eventEnd.getTime()) {
      const cursorMs = cursor.getTime();
      if (cursorMs >= rangeStartMs && cursorMs <= rangeEndMs) {
        const key = formatIsoDateKey(cursor);
        const bucket = eventsByDay.get(key);
        if (bucket) {
          bucket.push(event);
        } else {
          eventsByDay.set(key, [event]);
        }
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  });

  for (const [, dayEvents] of eventsByDay.entries()) {
    dayEvents.sort((a, b) => {
      const aTime = safeParseDate(a.date)?.getTime() ?? 0;
      const bTime = safeParseDate(b.date)?.getTime() ?? 0;
      return aTime - bTime;
    });
  }

  return eventsByDay;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function formatIsoDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseMonthKey(key: string): { year: number; month: number } | null {
  const [yearStr, monthStr] = key.split("-");
  if (!yearStr || !monthStr) return null;
  const year = Number.parseInt(yearStr, 10);
  const month = Number.parseInt(monthStr, 10);
  if (Number.isNaN(year) || Number.isNaN(month)) return null;
  return { year, month };
}

function sortEventsByDate(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => {
    const aTime = safeParseDate(a.date)?.getTime() ?? Number.POSITIVE_INFINITY;
    const bTime = safeParseDate(b.date)?.getTime() ?? Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });
}
