import { buildRegistrationPayload, parseApiError } from "@/lib/register-utils";

describe("register-utils", () => {
  describe("buildRegistrationPayload", () => {
    it("includes parent1, notes, marketing_opt_in, and children", () => {
      const parents = [{ name: "A", email: "a@example.com", phone: "111-1111" }] as any;
      const children = [{ full_name: "Kid 1" }] as any;
      const payload = buildRegistrationPayload(parents, children, "some notes", true);
      expect(payload).toMatchObject({
        parent1_name: "A",
        parent1_email: "a@example.com",
        parent1_phone: "111-1111",
        children,
        notes: "some notes",
        marketing_opt_in: true,
      });
    });

    it("includes parent2 fields when present", () => {
      const parents = [
        { name: "A", email: "a@example.com", phone: "111-1111" },
        { name: "B", email: "b@example.com", phone: "222-2222" },
      ] as any;
      const payload = buildRegistrationPayload(parents, [], "", false);
      expect(payload).toMatchObject({
        parent2_name: "B",
        parent2_email: "b@example.com",
        parent2_phone: "222-2222",
      });
    });
  });

  describe("parseApiError", () => {
    it("maps duplicate email to friendly error and returns field", () => {
      const result = parseApiError({ code: "DUPLICATE_EMAIL", field: "parent1_email" });
      expect(result.field).toBe("parent1_email");
      expect(result.error).toMatch(/already been registered/i);
    });

    it("passes through generic error", () => {
      const result = parseApiError({ error: "Something went wrong" });
      expect(result).toEqual({ error: "Something went wrong" });
    });

    it("falls back to generic message for unknown shapes", () => {
      const result = parseApiError("weird");
      expect(result).toEqual({ error: "Failed" });
    });
  });
});


