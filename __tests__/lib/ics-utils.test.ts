import { buildIcsFeed } from "@/lib/ics-utils";
import type { ScheduleEvent } from "@/lib/directus";

function event(overrides: Partial<ScheduleEvent> = {}): ScheduleEvent {
  return {
    id: 1,
    season_year: 2026,
    event_type: "practice",
    title: "Practice",
    date: "2026-09-08T17:00:00",
    end_date: "2026-09-08T19:00:00",
    location: "Flick Park",
    description: null,
    highlight: false,
    ...overrides,
  };
}

function veventLines(ics: string): string[] {
  const start = ics.indexOf("BEGIN:VEVENT");
  const end = ics.indexOf("END:VEVENT") + "END:VEVENT".length;
  return ics.slice(start, end).split("\r\n").filter(Boolean);
}

describe("buildIcsFeed", () => {
  it("wraps an empty event list in a valid, empty VCALENDAR", () => {
    const ics = buildIcsFeed([], { now: new Date("2026-09-03T00:00:00Z") });

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("VERSION:2.0\r\n");
    expect(ics).toContain("CALSCALE:GREGORIAN\r\n");
    expect(ics).not.toContain("BEGIN:VEVENT");
  });

  it("emits one VEVENT per event, with local wall-clock start/end times", () => {
    const ics = buildIcsFeed([event()], { now: new Date("2026-09-03T00:00:00Z") });

    expect(ics).toContain("BEGIN:VTIMEZONE");
    expect(ics).toContain("TZID:America/Chicago");

    const vevent = veventLines(ics);
    expect(vevent).toContain("UID:event-1@glenview-ultimate.org");
    expect(vevent).toContain("SUMMARY:Practice");
    expect(vevent).toContain("LOCATION:Flick Park");
    expect(vevent).toContain("DTSTAMP:20260903T000000Z");
    // The stored digits ARE the local wall-clock time (established in the
    // schedule-clarity work), so DTSTART/DTEND carry them through literally
    // with TZID=America/Chicago rather than converting to UTC by hand.
    expect(vevent).toContain("DTSTART;TZID=America/Chicago:20260908T170000");
    expect(vevent).toContain("DTEND;TZID=America/Chicago:20260908T190000");
  });

  it("omits DTEND when the event has no end_date", () => {
    const ics = buildIcsFeed([event({ end_date: null })]);

    const vevent = veventLines(ics);
    expect(vevent.some((l) => l.startsWith("DTEND"))).toBe(false);
    expect(vevent).toContain("DTSTART;TZID=America/Chicago:20260908T170000");
  });

  it("skips an event whose date cannot be parsed, rather than emitting garbage", () => {
    const ics = buildIcsFeed([event({ date: "not-a-date" })]);

    expect(ics).not.toContain("BEGIN:VEVENT");
  });

  it("escapes RFC 5545 special characters in text fields", () => {
    const ics = buildIcsFeed([
      event({
        title: "Practice; Drills, Games",
        location: null,
        description: "Line one\nLine two with a \\ backslash",
      }),
    ]);

    const vevent = veventLines(ics);
    // A raw, unescaped ';' or ',' would be parsed as a property-parameter or
    // list separator by a real ICS consumer and corrupt the field.
    expect(vevent).toContain("SUMMARY:Practice\\; Drills\\, Games");
    expect(vevent).toContain("DESCRIPTION:Line one\\nLine two with a \\\\ backslash");
  });
});
