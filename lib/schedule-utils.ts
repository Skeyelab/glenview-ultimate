import type { ScheduleEvent } from "./directus";
import { safeParseDate, formatTimeRange } from "./date-utils";
import type { MonthlyEventGroup } from "@/components/schedule/season-calendar";

export function selectUpcomingEvents(events: ScheduleEvent[]): ScheduleEvent[] {
  const now = Date.now();
  return events
    .filter((event) => {
      const eventDate = safeParseDate(event.date);
      return eventDate ? eventDate.getTime() >= now : false;
    })
    .slice(0, 3);
}

const MAX_HIGHLIGHTS = 4;

/**
 * Highlighted events that have not happened yet, soonest first, capped.
 *
 * The `highlight` flag in Directus is permanent, so without a date filter a
 * finished season keeps rendering forever and the card becomes a duplicate of
 * the schedule page. Returning [] lets the caller show an honest empty state.
 */
export function selectUpcomingHighlights(events: ScheduleEvent[], limit = MAX_HIGHLIGHTS): ScheduleEvent[] {
  const now = Date.now();
  return events
    .filter((event) => {
      if (!event.highlight) return false;
      const eventDate = safeParseDate(event.end_date ?? event.date);
      return eventDate ? eventDate.getTime() >= now : false;
    })
    .sort((a, b) => {
      const da = safeParseDate(a.date)?.getTime() ?? Number.POSITIVE_INFINITY;
      const db = safeParseDate(b.date)?.getTime() ?? Number.POSITIVE_INFINITY;
      return da - db;
    })
    .slice(0, limit);
}

/**
 * One-line summary of the recurring practice, or null when it does not recur.
 *
 * Every upcoming practice is currently the same weekday, time and place, so a
 * sentence answers "when is practice" better than a list the reader has to
 * infer the pattern from. Returns null the moment practices vary, rather than
 * stating something that is only mostly true.
 */
export function describePracticePattern(events: ScheduleEvent[]): string | null {
  const practices = events.filter((event) => event.event_type === "practice");
  if (practices.length === 0) return null;

  const weekdays = new Set<string>();
  const times = new Set<string>();
  const locations = new Set<string>();

  for (const practice of practices) {
    const date = safeParseDate(practice.date);
    if (!date) return null;
    weekdays.add(new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(date));
    const range = formatTimeRange(practice);
    if (!range) return null;
    times.add(range);
    locations.add(practice.location ?? "");
  }

  if (weekdays.size !== 1 || times.size !== 1 || locations.size !== 1) return null;

  const [weekday] = [...weekdays];
  const [time] = [...times];
  const [location] = [...locations];
  const where = location ? `, at ${location}` : "";
  return `Practices are ${weekday}s, ${time}${where}`;
}

/**
 * Splits events into future-or-now and past, by end_date falling back to date.
 *
 * Both Season Timeline and Season Calendar rendered every event ever entered,
 * so a finished Spring season (Richardson Park, 10am-12pm) sat directly above
 * the current Fall one (Flick Park, 5-7pm) with identical styling - a decoy a
 * parent scanning for "what time is practice" could easily grab by mistake.
 * Callers show `future` by default and put `past` behind a disclosure.
 */
export function partitionByDate(events: ScheduleEvent[]): { future: ScheduleEvent[]; past: ScheduleEvent[] } {
  const now = Date.now();
  const future: ScheduleEvent[] = [];
  const past: ScheduleEvent[] = [];
  for (const event of events) {
    const date = safeParseDate(event.end_date ?? event.date);
    (date && date.getTime() >= now ? future : past).push(event);
  }
  return { future, past };
}

export function groupEventsByMonth(events: ScheduleEvent[]): MonthlyEventGroup[] {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const buckets = new Map<string, { label: string; events: ScheduleEvent[] }>();

  events.forEach((event) => {
    const date = safeParseDate(event.date);
    const key = date ? `${date.getFullYear()}-${date.getMonth()}` : "tbd";
    const label = date ? formatter.format(date) : "Date TBD";
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.events.push(event);
    } else {
      buckets.set(key, { label, events: [event] });
    }
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

