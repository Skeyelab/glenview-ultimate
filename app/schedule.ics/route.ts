import { getSchedule } from "@/lib/directus";
import { partitionByDate } from "@/lib/schedule-utils";
import { buildIcsFeed } from "@/lib/ics-utils";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const schedule = await getSchedule();
  const { future } = partitionByDate(schedule.events);
  const ics = buildIcsFeed(future);

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
    },
  });
}
