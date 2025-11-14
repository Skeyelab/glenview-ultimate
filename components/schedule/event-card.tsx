import React from "react";
import type { ScheduleEvent } from "@/lib/directus";
import { cn } from "@/lib/utils";
import { EventTypeBadge, KeyMomentBadge } from "./event-badge";

type CardSize = "default" | "compact";

const SIZE_STYLES: Record<CardSize, { title: string; description: string; location: string; gap: string }> = {
  default: {
    title: "text-lg font-semibold",
    description: "text-sm text-white/80",
    location: "text-sm text-white/60",
    gap: "space-y-3",
  },
  compact: {
    title: "text-sm font-semibold",
    description: "text-xs text-white/60",
    location: "text-xs text-white/60",
    gap: "space-y-2",
  },
};

export interface ScheduleEventCardProps {
  event: ScheduleEvent;
  showDescription?: boolean;
  showLocation?: boolean;
  size?: CardSize;
  className?: string;
  highlightLabel?: string;
  badgeSize?: "sm" | "md";
  withOutline?: boolean;
  footer?: React.ReactNode;
  meta?: React.ReactNode;
  titleAs?: keyof React.JSX.IntrinsicElements;
}

export function ScheduleEventCard({
  event,
  showDescription = Boolean(event.description),
  showLocation = Boolean(event.location),
  size = "default",
  className,
  highlightLabel = "Key Moment",
  badgeSize,
  withOutline,
  footer,
  meta,
  titleAs: TitleTag = "h3",
}: ScheduleEventCardProps): React.JSX.Element {
  const styles = SIZE_STYLES[size];
  const showHighlight = Boolean(event.highlight);

  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/5 p-4",
        withOutline && "ring-1 ring-white/15",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <EventTypeBadge type={event.event_type} size={badgeSize ?? (size === "compact" ? "sm" : "md")} />
        {showHighlight && <KeyMomentBadge label={highlightLabel} />}
      </div>
      <div className={cn("mt-3", styles.gap)}>
        {meta}
        <TitleTag className={cn(styles.title, "text-white")}>{event.title}</TitleTag>
        {showDescription && event.description && <p className={styles.description}>{event.description}</p>}
        {showLocation && event.location && (
          <p className={cn(styles.location, showDescription && event.description ? "mt-2" : undefined)}>
            Location: {event.location}
          </p>
        )}
        {footer}
      </div>
    </div>
  );
}
