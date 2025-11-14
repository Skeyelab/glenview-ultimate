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

