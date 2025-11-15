import React from "react";
import type { ScheduleEvent, ScheduleEventType } from "@/lib/directus";
import { formatDateShort, formatDay, safeParseDate } from "@/lib/date-utils";
import { Calendar } from "@/components/ui/calendar";
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
}

const GROUP_EMPTY_MESSAGE = "No scheduled events for this month yet.";

const EVENT_INDICATOR_BASE =
  "relative after:absolute after:left-1/2 after:bottom-1 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:content-['']";

const EVENT_MODIFIER_CLASSES: Record<ScheduleEventType, string> = {
  season_start: `${EVENT_INDICATOR_BASE} after:bg-emerald-300`,
  season_end: `${EVENT_INDICATOR_BASE} after:bg-rose-300`,
  registration_open: `${EVENT_INDICATOR_BASE} after:bg-sky-300`,
  registration_close: `${EVENT_INDICATOR_BASE} after:bg-sky-200`,
  game: `${EVENT_INDICATOR_BASE} after:bg-purple-300`,
  practice: `${EVENT_INDICATOR_BASE} after:bg-orange-300`,
  tournament: `${EVENT_INDICATOR_BASE} after:bg-teal-300`,
  other: `${EVENT_INDICATOR_BASE} after:bg-white/80`,
};

export function SeasonCalendar({
  groups,
  title = "Season Calendar",
  subtitle = "Month-by-month snapshot of every key date",
  emptyMessage = "Calendar coming soon.",
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
            const calendarMeta = buildCalendarMeta(group.key, sortedEvents);

            return (
              <article key={group.key} className="card space-y-4">
                <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{group.label}</h3>
                    {!calendarMeta && (
                      <p className="text-xs uppercase tracking-wide text-amber-200/80">Dates are still being finalized</p>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-wide text-white/50">
                    {sortedEvents.length} {sortedEvents.length === 1 ? "event" : "events"}
                  </span>
                </header>

                {calendarMeta ? (
                  <div className="space-y-3">
                    <Calendar
                      disableNavigation
                      showOutsideDays
                      month={calendarMeta.monthDate}
                      defaultMonth={calendarMeta.monthDate}
                      fromMonth={calendarMeta.monthDate}
                      toMonth={calendarMeta.monthDate}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-2"
                      classNames={{
                        day: "h-10 w-10 rounded-lg text-sm font-medium text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                        day_selected: "bg-white text-[#175230] hover:bg-white focus:bg-white",
                      }}
                      modifiers={calendarMeta.modifiers}
                      modifiersClassNames={calendarMeta.modifierClassNames}
                    />
                    {!calendarMeta.hasEvents && <p className="text-sm text-white/60">{GROUP_EMPTY_MESSAGE}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-white/70">{GROUP_EMPTY_MESSAGE}</p>
                )}

                <EventList events={sortedEvents} />
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

function EventList({ events }: { events: ScheduleEvent[] }): React.JSX.Element {
  if (events.length === 0) {
    return <p className="text-sm text-white/70">{GROUP_EMPTY_MESSAGE}</p>;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {events.map((event) => (
        <li key={event.id}>
          <DefaultEventCard event={event} />
        </li>
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

interface CalendarMeta {
  monthDate: Date;
  modifiers: Record<string, Date[]>;
  modifierClassNames: Record<string, string>;
  hasEvents: boolean;
}

function buildCalendarMeta(key: string, events: ScheduleEvent[]): CalendarMeta | null {
  const parsed = parseMonthKey(key);
  if (!parsed) return null;

  const monthDate = new Date(parsed.year, parsed.month, 1);
  const monthStart = startOfLocalDay(monthDate);
  const monthEnd = startOfLocalDay(new Date(parsed.year, parsed.month + 1, 0));
  const dayTypeMap = new Map<string, ScheduleEventType>();

  events.forEach((event) => {
    enumerateEventDayKeys(event, monthStart, monthEnd).forEach((dayKey) => {
      if (!dayTypeMap.has(dayKey)) {
        dayTypeMap.set(dayKey, event.event_type);
      }
    });
  });

  const modifiers: Record<string, Date[]> = {};
  const modifierClassNames: Record<string, string> = {};

  dayTypeMap.forEach((type, key) => {
    (modifiers[type] ??= []).push(dateFromLocalKey(key));
  });

  Object.keys(modifiers).forEach((typeKey) => {
    modifierClassNames[typeKey] = EVENT_MODIFIER_CLASSES[typeKey as ScheduleEventType] ?? EVENT_MODIFIER_CLASSES.other;
  });

  return {
    monthDate,
    modifiers,
    modifierClassNames,
    hasEvents: dayTypeMap.size > 0,
  };
}

function enumerateEventDayKeys(event: ScheduleEvent, rangeStart: Date, rangeEnd: Date): string[] {
  const startDate = safeParseDate(event.date);
  if (!startDate) return [];
  const endDate = safeParseDate(event.end_date) ?? startDate;

  let cursor = startOfLocalDay(startDate);
  const eventEnd = startOfLocalDay(endDate);

  const keys: string[] = [];

  while (cursor.getTime() <= eventEnd.getTime()) {
    if (cursor.getTime() >= rangeStart.getTime() && cursor.getTime() <= rangeEnd.getTime()) {
      keys.push(formatLocalDateKey(cursor));
    }
    cursor = addDays(cursor, 1);
  }

  return keys;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfLocalDay(next);
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateFromLocalKey(key: string): Date {
  const [yearStr, monthStr, dayStr] = key.split("-");
  const year = Number.parseInt(yearStr, 10);
  const month = Number.parseInt(monthStr, 10) - 1;
  const day = Number.parseInt(dayStr, 10);
  return new Date(year, month, day);
}

function formatLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
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
