import React from "react";
import { getSchedule } from "@/lib/directus";
import { selectUpcomingEvents, groupEventsByMonth, describePracticePattern } from "@/lib/schedule-utils";
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { UpcomingEventsCard } from "@/components/schedule/upcoming-events-card";
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

      {/* Season Highlights was cut from this page (kept on the homepage):
          two independent reviews found it duplicated Up Next with less detail
          and served neither of the two tasks a parent has here (when's
          practice / what's coming up). grid-2 dropped to a single column
          since UpcomingEventsCard no longer has a partner to sit beside. */}
      <UpcomingEventsCard events={upcomingDisplay} />

      <SeasonTimeline events={events} />

      <SeasonCalendar groups={monthlyGroups} />
    </div>
  );
}

