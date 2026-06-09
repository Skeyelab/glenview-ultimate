import React from "react";
import type { SeasonSchedule, ScheduleEvent } from "@/lib/directus";
import type { ScheduleEventType } from "@/lib/directus";
import { NextKeyDate } from "./next-key-date";
import { EVENT_TYPE_LABELS, EVENT_TYPE_STYLES } from "./event-badge";

interface ScheduleHeaderProps {
  schedule: SeasonSchedule;
  events: ScheduleEvent[];
  featuredEvent?: ScheduleEvent | null;
}

export function ScheduleHeader({ schedule, events, featuredEvent }: ScheduleHeaderProps): React.JSX.Element {
  const seenTypes = new Set<ScheduleEventType>();
  const uniqueTypes: ScheduleEventType[] = [];
  for (const e of events) {
    if (!seenTypes.has(e.event_type)) {
      seenTypes.add(e.event_type);
      uniqueTypes.push(e.event_type);
    }
  }

  return (
    <header className="card space-y-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-white/50 font-medium">
            Season {schedule.season_year}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{schedule.title}</h1>
          {schedule.start_month && schedule.end_month && (
            <p className="text-white/70 mt-2 text-sm">
              {schedule.start_month} – {schedule.end_month} {schedule.season_year}
            </p>
          )}
        </div>
        {featuredEvent && <NextKeyDate event={featuredEvent} />}
      </div>

      {uniqueTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          {uniqueTypes.map((type) => (
            <span
              key={type}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${EVENT_TYPE_STYLES[type]}`}
            >
              {EVENT_TYPE_LABELS[type]}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
