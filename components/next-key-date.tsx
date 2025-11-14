import React from "react";
import type { ScheduleEvent } from "@/lib/directus";
import { formatDateRange } from "@/lib/date-utils";

interface NextKeyDateProps {
  event?: ScheduleEvent;
  title?: string;
  className?: string;
}

export function NextKeyDate({ event, title = "Next Key Date", className = "" }: NextKeyDateProps): React.JSX.Element | null {
  if (!event) {
    return null;
  }

  return (
    <div className={`notice md:min-w-[240px] ${className}`}>
      <p className="text-xs uppercase tracking-wide text-white/60 mb-1">{title}</p>
      <p className="font-semibold text-white">
        {event.title}
      </p>
      <p className="text-sm text-white/70">
        {formatDateRange(event)}
      </p>
    </div>
  );
}
