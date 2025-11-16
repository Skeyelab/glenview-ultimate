import { selectUpcomingEvents, groupEventsByMonth } from "@/lib/schedule-utils";

describe("schedule-utils", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-03-01T12:00:00.000Z"));
  });
  afterEach(() => {
    jest.useRealTimers();
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


