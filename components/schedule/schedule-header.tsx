import React from "react";
import type { SeasonSchedule, ScheduleEvent } from "@/lib/directus";
import { NextKeyDate } from "./next-key-date";
import { listEventTypeLabels } from "./event-badge";

interface ScheduleHeaderProps {
  schedule: SeasonSchedule;
  events: ScheduleEvent[];
  featuredEvent?: ScheduleEvent | null;
}

export function ScheduleHeader({ schedule, events, featuredEvent }: ScheduleHeaderProps): React.JSX.Element {
  const labels = listEventTypeLabels(events);

  return (
    <header className="card space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/60">Season {schedule.season_year}</p>
          <h1 className="text-3xl font-bold text-white">{schedule.title}</h1>
          {schedule.start_month && schedule.end_month && (
            <p className="text-white/80 mt-2">
              Season runs from <strong>{schedule.start_month}</strong> through <strong>{schedule.end_month}</strong>{" "}
              {schedule.season_year}
            </p>
          )}
        </div>
        {featuredEvent && <NextKeyDate event={featuredEvent} />}
      </div>
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
