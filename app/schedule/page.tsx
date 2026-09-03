import React from "react";
import { getSchedule } from "@/lib/directus";
import { selectUpcomingEvents, groupEventsByMonth, describePracticePattern, partitionByDate } from "@/lib/schedule-utils";
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { UpcomingEventsCard } from "@/components/schedule/upcoming-events-card";
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

  // Season Timeline and Season Calendar previously rendered every event ever
  // entered, so a finished Spring season (Richardson Park, 10am-12pm) sat
  // directly above the current Fall one (Flick Park, 5-7pm) with identical
  // styling - a decoy a parent scanning for "what time is practice" could
  // easily grab by mistake. Both now default to future events; past ones sit
  // behind a <details> disclosure rather than disappearing outright.
  const { future: futureEvents, past: pastEvents } = partitionByDate(events);
  const practicePattern = describePracticePattern(futureEvents);
  // Same fallback pattern as app/sitemap.ts. webcal:// rather than https://:
  // that scheme is what gets Apple/Google Calendar to offer a live
  // subscription instead of a one-time "Add Event" import dialog.
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.glenview-ultimate.org").replace(/\/+$/, "");
  const subscribeHref = `webcal://${baseUrl.replace(/^https?:\/\//, "")}/schedule.ics`;
  const futureMonthlyGroups = groupEventsByMonth(futureEvents);
  const pastMonthlyGroups = groupEventsByMonth(pastEvents);

  return (
    <div className="space-y-8">
      <ScheduleHeader schedule={schedule} events={events} featuredEvent={upcomingDisplay[0]} />

      {practicePattern && (
        <p className="text-lg font-medium text-white">{practicePattern}</p>
      )}

      <a href={subscribeHref} className="inline-block text-sm font-medium text-white underline underline-offset-4 hover:text-white/80">
        Subscribe to calendar
      </a>

      {/* Season Highlights was cut from this page (kept on the homepage):
          two independent reviews found it duplicated Up Next with less detail
          and served neither of the two tasks a parent has here (when's
          practice / what's coming up). grid-2 dropped to a single column
          since UpcomingEventsCard no longer has a partner to sit beside. */}
      <UpcomingEventsCard events={upcomingDisplay} />

      <SeasonTimeline events={futureEvents} />
      {pastEvents.length > 0 && (
        <details className="card">
          <summary className="cursor-pointer text-white/80 hover:text-white">
            Show {pastEvents.length} past {pastEvents.length === 1 ? "event" : "events"}
          </summary>
          <div className="mt-6">
            <SeasonTimeline events={pastEvents} title="Past Events" />
          </div>
        </details>
      )}

      <SeasonCalendar groups={futureMonthlyGroups} />
      {pastMonthlyGroups.length > 0 && (
        <details className="card">
          <summary className="cursor-pointer text-white/80 hover:text-white">
            Show {pastEvents.length} past {pastEvents.length === 1 ? "event" : "events"}
          </summary>
          <div className="mt-6">
            <SeasonCalendar groups={pastMonthlyGroups} title="Past Events" subtitle="" />
          </div>
        </details>
      )}
    </div>
  );
}

