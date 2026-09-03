import type { ScheduleEvent } from "@/lib/directus";

export function formatDateRange(event: ScheduleEvent): string {
  const startDate = safeParseDate(event.date);
  if (!startDate) return "Date TBD";
  const endDate = safeParseDate(event.end_date) ?? startDate;

  const sameDay = isSameDay(startDate, endDate);
  if (sameDay) {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(startDate);
  }

  const sameYear = startDate.getUTCFullYear() === endDate.getUTCFullYear();
  if (sameYear) {
    const sameMonth = startDate.getUTCMonth() === endDate.getUTCMonth();
    if (sameMonth) {
      const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(startDate);
      return `${monthLabel} ${startDate.getUTCDate()}–${endDate.getUTCDate()}, ${startDate.getUTCFullYear()}`;
    }
    const startLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(startDate);
    const endLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(endDate);
    return `${startLabel} – ${endLabel}, ${startDate.getUTCFullYear()}`;
  }

  const startFull = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(startDate);
  const endFull = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(endDate);
  return `${startFull} – ${endFull}`;
}

export function formatTimeRange(event: ScheduleEvent): string | null {
  const startDate = safeParseDate(event.date);
  if (!startDate || isMidnight(startDate)) return null;

  const endDate = safeParseDate(event.end_date);
  const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

  if (!endDate || isSameMinute(startDate, endDate) || isMidnight(endDate)) {
    return timeFormatter.format(startDate);
  }

  return `${timeFormatter.format(startDate)} – ${timeFormatter.format(endDate)}`;
}

export function formatDay(isoDate: string | null | undefined): string {
  const date = safeParseDate(isoDate);
  if (!date) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(date);
}

export function formatDateShort(isoDate: string | null | undefined): string {
  const date = safeParseDate(isoDate);
  if (!date) return "TBD";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

export function formatFullDate(isoDate: string | null | undefined): string | null {
  const date = safeParseDate(isoDate);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

/**
 * Schedule times are naive wall-clock values: the club is entirely in one
 * timezone, so a stored "17:00" means 5pm to everyone who reads it.
 *
 * A datetime string with no offset is parsed as server-local by the runtime,
 * which would make the rendered time depend on the container's TZ. Anchoring
 * to UTC here, and formatting in UTC, makes the value pass through literally.
 */
const HAS_TIMEZONE = /(?:Z|[+-]\d{2}:?\d{2})$/i;

export function safeParseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const normalized = iso.includes("T") && !HAS_TIMEZONE.test(iso) ? `${iso}Z` : iso;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

export function isSameMinute(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate() &&
    a.getUTCHours() === b.getUTCHours() &&
    a.getUTCMinutes() === b.getUTCMinutes();
}

export function isMidnight(date: Date): boolean {
  return date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0;
}
