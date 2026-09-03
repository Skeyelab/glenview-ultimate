import type { ScheduleEvent } from "@/lib/directus";
import { safeParseDate } from "@/lib/date-utils";

const PRODID = "-//Glenview Ultimate//Schedule//EN";
const CRLF = "\r\n";

// Standard, unchanging block for America/Chicago (CST/CDT), matching the
// published IANA rules. The club is entirely in one timezone, so this is
// hardcoded rather than pulled from a timezone-data library: DTSTART/DTEND
// values are stored and rendered everywhere else on this site as literal
// local wall-clock digits (see lib/date-utils.ts), and TZID is what lets an
// ICS consumer interpret "17:00" as 5pm Central regardless of DST or the
// reader's own timezone, without any conversion happening in this codebase.
const VTIMEZONE_AMERICA_CHICAGO = [
  "BEGIN:VTIMEZONE",
  "TZID:America/Chicago",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0600",
  "TZOFFSETTO:-0500",
  "TZNAME:CDT",
  "DTSTART:19700308T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0600",
  "TZNAME:CST",
  "DTSTART:19701101T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
].join(CRLF);

function icsLines(lines: string[]): string {
  return lines.join(CRLF) + CRLF;
}

/** Escapes text per RFC 5545 §3.3.11: backslash, comma, semicolon, newline. */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * YYYYMMDDTHHMMSS from the literal local wall-clock digits.
 *
 * `safeParseDate` anchors an offset-less string to UTC (see date-utils.ts),
 * so the UTC getters here read back exactly the digits that were stored -
 * not a converted value. Paired with TZID=America/Chicago on the caller's
 * DTSTART/DTEND property, this is a pass-through, not a timezone conversion.
 */
function toIcsLocalDateTime(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`
  );
}

function toIcsUtcDateTime(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function buildVevent(event: ScheduleEvent, dtstamp: string): string[] | null {
  const start = safeParseDate(event.date);
  if (!start) return null;

  const lines = [
    "BEGIN:VEVENT",
    `UID:event-${event.id}@glenview-ultimate.org`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=America/Chicago:${toIcsLocalDateTime(start)}`,
  ];

  const end = safeParseDate(event.end_date);
  if (end) {
    lines.push(`DTEND;TZID=America/Chicago:${toIcsLocalDateTime(end)}`);
  }

  lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  lines.push("END:VEVENT");
  return lines;
}

export function buildIcsFeed(events: ScheduleEvent[], options: { now?: Date } = {}): string {
  const dtstamp = toIcsUtcDateTime(options.now ?? new Date());

  const veventLines = events.flatMap((event) => buildVevent(event, dtstamp) ?? []);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    VTIMEZONE_AMERICA_CHICAGO,
    ...veventLines,
    "END:VCALENDAR",
  ];
  return icsLines(lines);
}
