import React from "react";
import { getSchedule, type ScheduleEvent } from "@/lib/directus";
import { safeParseDate } from "@/lib/date-utils";
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { UpcomingEventsCard } from "@/components/schedule/upcoming-events-card";
import { SeasonHighlightsCard } from "@/components/schedule/highlights-card";
import { SeasonTimeline } from "@/components/schedule/season-timeline";
import { SeasonCalendar, type MonthlyEventGroup } from "@/components/schedule/season-calendar";

export const revalidate = 10;

export default async function SchedulePage(): Promise<React.JSX.Element> {
  const schedule = await getSchedule();
  const { events } = schedule;
  const upcomingEvents = selectUpcomingEvents(events);
  const upcomingDisplay = upcomingEvents.length > 0 ? upcomingEvents : events.slice(0, Math.min(3, events.length));
  const monthlyGroups = groupEventsByMonth(events);

  return (
    <div className="space-y-8">
      <ScheduleHeader schedule={schedule} events={events} featuredEvent={upcomingDisplay[0]} />

      <section className="grid-2">
        <UpcomingEventsCard events={upcomingDisplay} />
        <SeasonHighlightsCard highlights={schedule.highlights} />
      </section>

      <SeasonTimeline events={events} />

      <SeasonCalendar groups={monthlyGroups} />
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

function groupEventsByMonth(events: ScheduleEvent[]): MonthlyEventGroup[] {
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

