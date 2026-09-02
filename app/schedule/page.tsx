import React from "react";
import { getSchedule } from "@/lib/directus";
import { selectUpcomingEvents, groupEventsByMonth } from "@/lib/schedule-utils";
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { UpcomingEventsCard } from "@/components/schedule/upcoming-events-card";
import { SeasonHighlightsCard } from "@/components/schedule/highlights-card";
import { SeasonTimeline } from "@/components/schedule/season-timeline";
import { SeasonCalendar } from "@/components/schedule/season-calendar";

export const dynamic = 'force-dynamic'; // @NextJS

export default async function SchedulePage(): Promise<React.JSX.Element> {
  const schedule = await getSchedule();
  const { events } = schedule;
  const upcomingEvents = selectUpcomingEvents(events);
  // No fallback to events.slice(0, n): that returned the OLDEST events on file,
  // so a finished season rendered its first practice as "Up Next". An empty list
  // lets UpcomingEventsCard show its honest "coming soon" message instead.
  const upcomingDisplay = upcomingEvents;
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

