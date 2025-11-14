import React from "react";
import { getSchedule } from "@/lib/directus";
import { selectUpcomingEvents, groupEventsByMonth } from "@/lib/schedule-utils";
import { DEFAULT_REVALIDATE_SECONDS } from "@/lib/config";
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { UpcomingEventsCard } from "@/components/schedule/upcoming-events-card";
import { SeasonHighlightsCard } from "@/components/schedule/highlights-card";
import { SeasonTimeline } from "@/components/schedule/season-timeline";
import { SeasonCalendar } from "@/components/schedule/season-calendar";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

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

