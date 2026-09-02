import type { ScheduleEvent } from "./directus";
import { safeParseDate } from "./date-utils";
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

