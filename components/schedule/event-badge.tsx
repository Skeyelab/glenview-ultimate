import React from "react";
import type { ScheduleEventType } from "@/lib/directus";
import { cn } from "@/lib/utils";

export const EVENT_TYPE_LABELS: Record<ScheduleEventType, string> = {
  season_start: "Season Start",
  season_end: "Season Wrap",
  registration_open: "Registration Opens",
  registration_close: "Registration Deadline",
  game: "Game Day",
  practice: "Practice",
  tournament: "Tournament",
  other: "Event",
};

const EVENT_TYPE_STYLES: Record<ScheduleEventType, string> = {
  season_start: "bg-emerald-500/20 text-emerald-100 border border-emerald-400/40",
  season_end: "bg-rose-500/20 text-rose-100 border border-rose-400/40",
  registration_open: "bg-sky-500/20 text-sky-100 border border-sky-400/40",
  registration_close: "bg-sky-500/10 text-sky-100 border border-sky-300/40",
  game: "bg-purple-500/20 text-purple-100 border border-purple-400/40",
  practice: "bg-orange-500/20 text-orange-100 border border-orange-400/40",
  tournament: "bg-teal-500/20 text-teal-100 border border-teal-400/40",
  other: "bg-white/10 text-white border border-white/30",
};

const BADGE_BASE = "inline-flex items-center rounded-full font-semibold uppercase tracking-wide";

const BADGE_SIZES = {
  md: "px-3 py-1 text-xs",
  sm: "px-2 py-0.5 text-[0.65rem]",
} satisfies Record<"md" | "sm", string>;

export function EventTypeBadge({
  type,
  size = "md",
  className,
}: {
  type: ScheduleEventType;
  size?: "sm" | "md";
  className?: string;
}): React.JSX.Element {
  return (
    <span className={cn(BADGE_BASE, BADGE_SIZES[size], EVENT_TYPE_STYLES[type], className)}>
      {EVENT_TYPE_LABELS[type]}
    </span>
  );
}

const HIGHLIGHT_BADGE_STYLES =
  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-amber-300/70 text-amber-100 uppercase tracking-wide";

export function KeyMomentBadge({
  className,
  label = "Key Moment",
}: {
  className?: string;
  label?: string;
}): React.JSX.Element {
  return <span className={cn(HIGHLIGHT_BADGE_STYLES, className)}>{label}</span>;
}

export function getEventTypeLabel(type: ScheduleEventType): string {
  return EVENT_TYPE_LABELS[type];
}

export function listEventTypeLabels(events: Array<{ event_type: ScheduleEventType }>): string[] {
  return Array.from(new Set(events.map((event) => EVENT_TYPE_LABELS[event.event_type])));
}
