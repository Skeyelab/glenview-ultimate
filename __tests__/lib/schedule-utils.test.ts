import { beforeEach, afterEach, vi } from 'vitest'
import { selectUpcomingEvents, groupEventsByMonth, selectUpcomingHighlights } from "@/lib/schedule-utils";

describe("schedule-utils", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-01T12:00:00.000Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("selectUpcomingEvents", () => {
    it("returns only future-or-equal events capped at 3", () => {
      const events = [
        { id: 1, date: "2026-02-28T12:00:00.000Z" },
        { id: 2, date: "2026-03-01T12:00:00.000Z" },
        { id: 3, date: "2026-03-02T12:00:00.000Z" },
        { id: 4, date: "2026-03-03T12:00:00.000Z" },
        { id: 5, date: "bad-date" },
      ] as any[];

      const result = selectUpcomingEvents(events);
      expect(result.map((e) => e.id)).toEqual([2, 3, 4]);
      expect(result).toHaveLength(3);
    });
  });

  describe("selectUpcomingHighlights", () => {
    const DAY = 86_400_000;
    const at = (offsetDays: number, over: Partial<any> = {}) => ({
      id: Math.abs(offsetDays), season_year: 2026, event_type: "practice",
      title: `e${offsetDays}`, date: new Date(Date.now() + offsetDays * DAY).toISOString(),
      end_date: null, location: null, description: null, highlight: true, ...over,
    });

    it("excludes highlighted events that have already happened", () => {
      const result = selectUpcomingHighlights([at(-30), at(-1), at(5)] as any);
      expect(result.map((e) => e.title)).toEqual(["e5"]);
    });

    it("excludes upcoming events that are not highlighted", () => {
      const result = selectUpcomingHighlights([at(3, { highlight: false }), at(4)] as any);
      expect(result.map((e) => e.title)).toEqual(["e4"]);
    });

    it("returns them in chronological order, soonest first", () => {
      const result = selectUpcomingHighlights([at(9), at(2), at(5)] as any);
      expect(result.map((e) => e.title)).toEqual(["e2", "e5", "e9"]);
    });

    it("caps the list rather than dumping a whole season", () => {
      const many = Array.from({ length: 15 }, (_, i) => at(i + 1));
      expect(selectUpcomingHighlights(many as any).length).toBeLessThanOrEqual(4);
    });

    it("returns an empty array when the season has no upcoming highlights", () => {
      expect(selectUpcomingHighlights([at(-5), at(-2)] as any)).toEqual([]);
    });
  });

  describe("groupEventsByMonth", () => {
    it("groups by month and sorts groups and events; invalid dates go to 'Date TBD'", () => {
      const events = [
        { id: 1, date: "2026-03-02T12:00:00.000Z" },
        { id: 2, date: "2026-03-01T12:00:00.000Z" },
        { id: 3, date: "bad-date" },
        { id: 4, date: "2026-04-01T12:00:00.000Z" },
      ] as any[];

      const groups = groupEventsByMonth(events);
      expect(groups.map((g) => g.label)).toEqual(["March 2026", "April 2026", "Date TBD"]);
      expect(groups[0].events.map((e) => e.id)).toEqual([2, 1]);
    });
  });
});


