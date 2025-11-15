"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type CalendarChevronProps = {
  className?: string;
  size?: number;
  disabled?: boolean;
  orientation?: "up" | "down" | "left" | "right";
};

type Orientation = NonNullable<CalendarChevronProps["orientation"]>;

const ORIENTATION_ICONS: Record<Orientation, (iconProps: { size?: number; className?: string }) => React.JSX.Element> = {
  up: (iconProps) => <ChevronUp {...iconProps} />,
  down: (iconProps) => <ChevronDown {...iconProps} />,
  left: (iconProps) => <ChevronLeft {...iconProps} />,
  right: (iconProps) => <ChevronRight {...iconProps} />,
};

function CalendarChevron({
  orientation = "right",
  size = 16,
  disabled,
  className,
}: CalendarChevronProps): React.JSX.Element {
  const Icon = ORIENTATION_ICONS[orientation] ?? ChevronRight;
  return (
    <Icon
      size={size}
      className={cn("text-white", disabled && "opacity-40", className)}
    />
  );
}

export function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: CalendarProps): React.JSX.Element {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rdp text-white", className)}
      classNames={{
        months: "flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "relative flex items-center justify-center pt-1",
        caption_label: "text-sm font-semibold text-white",
        nav: "flex items-center gap-1 absolute right-1 top-1",
        nav_button:
          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-40 disabled:pointer-events-none",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "w-9 text-xs font-medium text-white/60",
        row: "flex w-full mt-2",
        cell: "relative h-9 w-9 text-center text-sm focus-within:relative focus-within:z-20",
        day: cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium text-white/80 transition",
          "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        ),
        day_disabled: "text-white/40 opacity-50",
        day_outside: "text-white/30 opacity-60",
        day_selected: "bg-white text-[#175230] hover:text-[#175230] hover:bg-white focus:bg-white focus:text-[#175230]",
        day_today: "text-white",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_range_middle: "aria-selected:bg-white/20",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        ...components,
      }}
      {...props}
    />
  );
}
