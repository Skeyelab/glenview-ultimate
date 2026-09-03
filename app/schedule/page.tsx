import React from "react";
import { getSchedule } from "@/lib/directus";
import { selectUpcomingEvents, groupEventsByMonth, selectUpcomingHighlights, describePracticePattern } from "@/lib/schedule-utils";
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
  // selectUpcomingEvents caps at 3; the pattern needs every upcoming practice.
  const upcomingAll = events.filter((event) => {
    const date = new Date(event.end_date ?? event.date);
    return !Number.isNaN(date.getTime()) && date.getTime() >= Date.now();
  });
  // No fallback to events.slice(0, n): that returned the OLDEST events on file,
  // so a finished season rendered its first practice as "Up Next". An empty list
  // lets UpcomingEventsCard show its honest "coming soon" message instead.
  const upcomingDisplay = upcomingEvents;
  const monthlyGroups = groupEventsByMonth(events);
  const practicePattern = describePracticePattern(upcomingAll);

  return (
    <div className="space-y-8">
      <ScheduleHeader schedule={schedule} events={events} featuredEvent={upcomingDisplay[0]} />

      {practicePattern && (
        <p className="text-lg font-medium text-white">{practicePattern}</p>
      )}

      <section className="grid-2">
        <UpcomingEventsCard events={upcomingDisplay} />
        {/* `events` rather than the deprecated `highlights` string array: that
            array is built with no date filter, so finished events rendered as
            current. selectUpcomingHighlights is the same helper the homepage
            uses, and it also gives badges and locations instead of bare text. */}
        <SeasonHighlightsCard events={selectUpcomingHighlights(events)} />
      </section>

      <SeasonTimeline events={events} />

      <SeasonCalendar groups={monthlyGroups} />
    </div>
  );
}

