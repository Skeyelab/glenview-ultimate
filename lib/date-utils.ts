import type { ScheduleEvent } from "@/lib/directus";

export function formatDateRange(event: ScheduleEvent): string {
  const startDate = safeParseDate(event.date);
  if (!startDate) return "Date TBD";
  const endDate = safeParseDate(event.end_date) ?? startDate;

  const sameDay = isSameDay(startDate, endDate);
  if (sameDay) {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(startDate);
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  if (sameYear) {
    const sameMonth = startDate.getMonth() === endDate.getMonth();
    if (sameMonth) {
      const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long" }).format(startDate);
      return `${monthLabel} ${startDate.getDate()}–${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
    const startLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(startDate);
    const endLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(endDate);
    return `${startLabel} – ${endLabel}, ${startDate.getFullYear()}`;
  }

  const startFull = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(startDate);
  const endFull = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(endDate);
  return `${startFull} – ${endFull}`;
}

export function formatTimeRange(event: ScheduleEvent): string | null {
  const startDate = safeParseDate(event.date);
  if (!startDate || isMidnight(startDate)) return null;

  const endDate = safeParseDate(event.end_date);
  const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

  if (!endDate || isSameMinute(startDate, endDate) || isMidnight(endDate)) {
    return timeFormatter.format(startDate);
  }

  return `${timeFormatter.format(startDate)} – ${timeFormatter.format(endDate)}`;
}

export function formatDay(isoDate: string | null | undefined): string {
  const date = safeParseDate(isoDate);
  if (!date) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

export function formatDateShort(isoDate: string | null | undefined): string {
  const date = safeParseDate(isoDate);
  if (!date) return "TBD";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function formatFullDate(isoDate: string | null | undefined): string | null {
  const date = safeParseDate(isoDate);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

export function safeParseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isSameMinute(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate() &&
    a.getHours() === b.getHours() &&
    a.getMinutes() === b.getMinutes();
}

export function isMidnight(date: Date): boolean {
  return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
}
