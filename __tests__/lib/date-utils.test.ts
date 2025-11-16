import {
  safeParseDate,
  formatDateRange,
  formatTimeRange,
  formatDay,
  formatDateShort,
  formatFullDate,
} from "@/lib/date-utils";

describe("date-utils", () => {
  describe("safeParseDate", () => {
    it("returns null for null/undefined/invalid", () => {
      expect(safeParseDate(null)).toBeNull();
      expect(safeParseDate(undefined)).toBeNull();
      expect(safeParseDate("not-a-date")).toBeNull();
    });
    it("parses valid ISO", () => {
      const d = safeParseDate("2026-03-01T12:00:00.000Z");
      expect(d).toBeInstanceOf(Date);
      expect(d?.toISOString()).toBe("2026-03-01T12:00:00.000Z");
    });
  });

  describe("formatDateRange", () => {
    const mk = (date: string, end?: string | null) =>
      ({ date, end_date: end ?? null } as any);

    it("same day", () => {
      const s = formatDateRange(mk("2026-03-01T12:00:00")); // noon local to avoid TZ shifts
      expect(s).toMatch(/March 1, 2026/);
    });

    it("same month and year, different days", () => {
      const s = formatDateRange(mk("2026-03-01T12:00:00", "2026-03-05T12:00:00"));
      expect(s).toBe("March 1–5, 2026");
    });

    it("same year, different months", () => {
      const s = formatDateRange(mk("2026-03-30T12:00:00", "2026-04-02T12:00:00"));
      expect(s).toBe("March 30 – April 2, 2026");
    });

    it("different years", () => {
      const s = formatDateRange(mk("2026-12-31T12:00:00", "2027-01-02T12:00:00"));
      expect(s).toBe("December 31, 2026 – January 2, 2027");
    });

    it("handles invalid start date", () => {
      const s = formatDateRange(mk("nope", "2026-03-02T00:00:00.000Z"));
      expect(s).toBe("Date TBD");
    });
  });

  describe("formatTimeRange", () => {
    const mk = (date: string, end?: string | null) =>
      ({ date, end_date: end ?? null } as any);

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date("2026-03-01T12:00:00.000Z"));
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it("returns null for midnight", () => {
      expect(formatTimeRange(mk("2026-03-01T00:00:00"))).toBeNull(); // local midnight
    });

    it("single time when no valid end", () => {
      const s = formatTimeRange(mk("2026-03-01T09:05:00"));
      expect(s).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });

    it("single time when same minute", () => {
      const s = formatTimeRange(mk("2026-03-01T09:05:00", "2026-03-01T09:05:00"));
      expect(s).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
      expect(s).not.toMatch(/–/);
    });

    it("range when different minutes", () => {
      const s = formatTimeRange(mk("2026-03-01T09:05:00", "2026-03-01T10:10:00"));
      expect(s).toMatch(/–/);
    });
  });

  describe("formatDay", () => {
    it("returns weekday for valid date", () => {
      const s = formatDay("2026-03-01T12:00:00");
      expect(typeof s).toBe("string");
      expect(s.length).toBeGreaterThan(0);
    });
    it("returns 'Date TBD' for invalid", () => {
      expect(formatDay("nope")).toBe("Date TBD");
    });
  });

  describe("formatDateShort", () => {
    it("returns short date", () => {
      const s = formatDateShort("2026-03-01T12:00:00");
      expect(s).toMatch(/Mar|Mar\./);
    });
    it("returns 'TBD' for invalid", () => {
      expect(formatDateShort("nope")).toBe("TBD");
    });
  });

  describe("formatFullDate", () => {
    it("returns full date", () => {
      const s = formatFullDate("2026-03-01T12:00:00");
      expect(s).toMatch(/March 1, 2026/);
    });
    it("returns null for invalid", () => {
      expect(formatFullDate("nope")).toBeNull();
    });
  });
});


