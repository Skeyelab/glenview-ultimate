import React from "react";
import { getSchedule, type ScheduleEvent, type ScheduleEventType } from "@/lib/directus";

export const revalidate = 300;

const EVENT_TYPE_LABELS: Record<ScheduleEventType, string> = {
  season_start: "Season Start",
  season_end: "Season Wrap",
  registration_open: "Registration Opens",
  registration_close: "Registration Deadline",
  game: "Game Day",
  practice: "Practice",
  tournament: "Tournament",
  other: "Event",
};

const EVENT_TYPE_STYLES: Record<ScheduleEventType, string> = {
  season_start: "bg-emerald-500/20 text-emerald-100 border border-emerald-400/40",
  season_end: "bg-rose-500/20 text-rose-100 border border-rose-400/40",
  registration_open: "bg-sky-500/20 text-sky-100 border border-sky-400/40",
  registration_close: "bg-sky-500/10 text-sky-100 border border-sky-300/40",
  game: "bg-purple-500/20 text-purple-100 border border-purple-400/40",
  practice: "bg-orange-500/20 text-orange-100 border border-orange-400/40",
  tournament: "bg-teal-500/20 text-teal-100 border border-teal-400/40",
  other: "bg-white/10 text-white border border-white/30",
};

const BADGE_BASE = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase";
const HIGHLIGHT_BADGE = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-amber-300/70 text-amber-100";

export default async function SchedulePage(): Promise<React.JSX.Element> {
  const schedule = await getSchedule();
  const events = schedule.events;
  const upcomingEvents = selectUpcomingEvents(events);
  const upcomingDisplay = upcomingEvents.length > 0 ? upcomingEvents : events.slice(0, Math.min(3, events.length));
  const monthlyGroups = groupEventsByMonth(events);

  return (
    <div className="space-y-8">
      <header className="card space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-white/60">Season {schedule.season_year}</p>
            <h1 className="text-3xl font-bold text-white">{schedule.title}</h1>
            {schedule.start_month && schedule.end_month && (
              <p className="text-white/80 mt-2">
                Season runs from <strong>{schedule.start_month}</strong> through <strong>{schedule.end_month}</strong> {schedule.season_year}
              </p>
            )}
          </div>
          {upcomingDisplay.length > 0 && (
            <div className="notice md:min-w-[240px]">
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Next Key Date</p>
              <p className="font-semibold text-white">
                {upcomingDisplay[0].title}
              </p>
              <p className="text-sm text-white/70">
                {formatDateRange(upcomingDisplay[0])}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          {Array.from(new Set(events.map((event) => EVENT_TYPE_LABELS[event.event_type]))).map((label) => (
            <span key={label} className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              {label}
            </span>
          ))}
        </div>
      </header>

      <section className="grid-2">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-3">Up Next</h2>
          {upcomingDisplay.length > 0 ? (
            <ul className="space-y-3">
              {upcomingDisplay.map((event) => (
                <li key={event.id} className="rounded-lg border border-white/15 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`${BADGE_BASE} ${EVENT_TYPE_STYLES[event.event_type]}`}>{EVENT_TYPE_LABELS[event.event_type]}</span>
                    {event.highlight && <span className={HIGHLIGHT_BADGE}>Key Moment</span>}
                  </div>
                  <p className="text-sm text-white/70 mt-3">{formatDateRange(event)}</p>
                  <p className="text-lg font-semibold text-white mt-1">{event.title}</p>
                  {event.location && <p className="text-sm text-white/60 mt-1">Location: {event.location}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/80">Season events coming soon.</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-3">Season Highlights</h2>
          {schedule.highlights.length > 0 ? (
            <ul className="list-disc space-y-2 ps-5 text-white/90">
              {schedule.highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-white/80">Highlights coming soon.</p>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Season Timeline</h2>
        <ol className="relative pl-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-white/20">
          {events.map((event, index) => {
            const timeRange = formatTimeRange(event);
            return (
              <li key={event.id} className="relative pl-6 pb-6 last:pb-0 md:grid md:grid-cols-[minmax(180px,240px)_1fr] md:gap-6">
                <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white/40 bg-[#175230]" />
                <div className="mb-3 md:mb-0">
                  <div className="text-xs uppercase tracking-wide text-white/60">{formatDay(event.date)}</div>
                  <div className="text-sm font-semibold text-white">{formatDateRange(event)}</div>
                  {timeRange && <div className="text-xs text-white/60 mt-1">{timeRange}</div>}
                </div>
                <div className={`space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 ${index === 0 ? "ring-1 ring-white/15" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`${BADGE_BASE} ${EVENT_TYPE_STYLES[event.event_type]}`}>{EVENT_TYPE_LABELS[event.event_type]}</span>
                    {event.highlight && <span className={HIGHLIGHT_BADGE}>Key Moment</span>}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    {event.description && <p className="text-white/80">{event.description}</p>}
                    {event.location && <p className="text-sm text-white/60 mt-2">Location: {event.location}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Season Calendar</h2>
          <p className="text-sm text-white/60 hidden md:block">Month-by-month snapshot of every key date</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {monthlyGroups.map((group) => (
            <article key={group.key} className="card space-y-3">
              <header className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">{group.label}</h3>
                <span className="text-xs uppercase tracking-wide text-white/50">{group.events.length} {group.events.length === 1 ? "event" : "events"}</span>
              </header>
              <ul className="space-y-3">
                {group.events.map((event) => (
                  <li key={event.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/60">{formatDay(event.date)}</p>
                        <p className="text-sm font-semibold text-white">{formatDateShort(event.date)}</p>
                      </div>
                      <span className={`${BADGE_BASE} ${EVENT_TYPE_STYLES[event.event_type]} text-[0.6rem]`}>{EVENT_TYPE_LABELS[event.event_type]}</span>
                    </div>
                    <p className="text-sm text-white/80 mt-2 font-medium">{event.title}</p>
                    {event.location && <p className="text-xs text-white/60 mt-1">Location: {event.location}</p>}
                    {event.description && <p className="text-xs text-white/60 mt-1">{event.description}</p>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function selectUpcomingEvents(events: ScheduleEvent[]): ScheduleEvent[] {
  const now = Date.now();
  return events
    .filter((event) => {
      const eventDate = safeParseDate(event.date);
      return eventDate ? eventDate.getTime() >= now : false;
    })
    .slice(0, 3);
}

function formatDateRange(event: ScheduleEvent): string {
  const startDate = safeParseDate(event.date);
  if (!startDate) return "Date TBD";
  const endDate = safeParseDate(event.end_date) ?? startDate;

  const sameDay = isSameDay(startDate, endDate);
  if (sameDay) {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(startDate);
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  if (sameYear) {
    const sameMonth = startDate.getMonth() === endDate.getMonth();
    if (sameMonth) {
      const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long" }).format(startDate);
      return `${monthLabel} ${startDate.getDate()}–${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
    const startLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(startDate);
    const endLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(endDate);
    return `${startLabel} – ${endLabel}, ${startDate.getFullYear()}`;
  }

  const startFull = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(startDate);
  const endFull = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(endDate);
  return `${startFull} – ${endFull}`;
}

function formatTimeRange(event: ScheduleEvent): string | null {
  const startDate = safeParseDate(event.date);
  if (!startDate || isMidnight(startDate)) return null;

  const endDate = safeParseDate(event.end_date);
  const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

  if (!endDate || isSameMinute(startDate, endDate) || isMidnight(endDate)) {
    return timeFormatter.format(startDate);
  }

  return `${timeFormatter.format(startDate)} – ${timeFormatter.format(endDate)}`;
}

function safeParseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isSameMinute(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate() &&
    a.getHours() === b.getHours() &&
    a.getMinutes() === b.getMinutes();
}

function isMidnight(date: Date): boolean {
  return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
}

function groupEventsByMonth(events: ScheduleEvent[]): Array<{ key: string; label: string; events: ScheduleEvent[] }> {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const buckets = new Map<string, { label: string; events: ScheduleEvent[] }>();

  events.forEach((event) => {
    const date = safeParseDate(event.date);
    const key = date ? `${date.getFullYear()}-${date.getMonth()}` : "tbd";
    const label = date ? formatter.format(date) : "Date TBD";
    if (!buckets.has(key)) {
      buckets.set(key, { label, events: [] });
    }
    buckets.get(key)!.events.push(event);
  });

  return Array.from(buckets.entries())
    .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
    .map(([key, group]) => ({
      key,
      label: group.label,
      events: group.events.sort((x, y) => {
        const dx = safeParseDate(x.date)?.getTime() ?? Number.POSITIVE_INFINITY;
        const dy = safeParseDate(y.date)?.getTime() ?? Number.POSITIVE_INFINITY;
        return dx - dy;
      }),
    }));
}

function formatDay(isoDate: string | null | undefined): string {
  const date = safeParseDate(isoDate);
  if (!date) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

function formatDateShort(isoDate: string | null | undefined): string {
  const date = safeParseDate(isoDate);
  if (!date) return "TBD";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
