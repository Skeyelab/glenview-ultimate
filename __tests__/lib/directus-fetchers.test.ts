import { beforeEach, afterAll, vi, type Mock } from 'vitest'

// TODO: This test needs to be rewritten for Vitest's ESM system
// It currently uses patterns (vi.mock inside functions, require()) that don't work with Vitest
describe.skip("directus fetchers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    // Clear caches so env and mocks re-evaluate
    try { delete (require.cache as any)[require.resolve("@/lib/directus")]; } catch {}
    try { delete (require.cache as any)[require.resolve("@directus/sdk")]; } catch {}
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const mockDirectusSDK = () => {
    const requestMock = vi.fn();
    vi.mock("@directus/sdk", () => {
      return {
        createDirectus: vi.fn(() => ({
          with() { return this; },
          request: requestMock,
        })),
        readItems: vi.fn((collection: string, params: any) => ({ __op: "readItems", collection, params })),
        rest: vi.fn(() => ({})),
        staticToken: vi.fn(() => ({})),
        __requestMock: requestMock,
      };
    });
    return requestMock;
  };

  describe("fallbacks when env missing", () => {
    it("returns defaults when DIRECTUS env is not configured", async () => {
      delete process.env.DIRECTUS_URL;
      delete process.env.DIRECTUS_STATIC_TOKEN;
      const { getNewsList, getNewsBySlug, getAbout, getTeam, getPartners } = require("@/lib/directus");

      expect(await getNewsList()).toEqual([]);
      expect(await getNewsBySlug("any")).toBeNull();
      expect(await getAbout()).toBeNull();
      expect(await getTeam()).toEqual([]);
      expect(await getPartners()).toEqual([]);
    });

    it("getDirectusRestClient throws when not configured", () => {
      delete process.env.DIRECTUS_URL;
      delete process.env.DIRECTUS_STATIC_TOKEN;
      const { getDirectusRestClient } = require("@/lib/directus");
      expect(() => getDirectusRestClient()).toThrow(/Directus not configured/i);
    });
  });

  describe("fetchers with configured env", () => {
    beforeEach(() => {
      process.env.DIRECTUS_URL = "https://directus.test";
      process.env.DIRECTUS_STATIC_TOKEN = "token";
    });

    it("getNewsList returns list from client", async () => {
      const requestMock = mockDirectusSDK();
      const items = [
        { id: 1, slug: "a", title: "A", published_at: "2026-01-01T00:00:00Z", content: "x" },
        { id: 2, slug: "b", title: "B", published_at: "2026-02-01T00:00:00Z", content: "y" },
      ];
      requestMock.mockImplementation(async (arg: any) => {
        if (arg.collection === "News") return items;
        return [];
      });
      const { getNewsList } = require("@/lib/directus");
      await expect(getNewsList()).resolves.toEqual(items);
    });

    it("getNewsBySlug returns first or null", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockImplementation(async (arg: any) => {
        if (arg.collection === "News") {
          const slug = arg.params?.filter?.slug?._eq;
          return slug === "match" ? [{ id: 3, slug: "match", title: "M", published_at: "2026-03-01T00:00:00Z", content: "z" }] : [];
        }
        return [];
      });
      const { getNewsBySlug } = require("@/lib/directus");
      await expect(getNewsBySlug("match")).resolves.toMatchObject({ slug: "match" });
      await expect(getNewsBySlug("miss")).resolves.toBeNull();
    });

    it("getNewsBySlug selects first when multiple returned", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockImplementation(async (arg: any) => {
        if (arg.collection === "News") {
          return [
            { id: 10, slug: "dup", title: "First", published_at: "2026-01-01T00:00:00Z", content: "a" },
            { id: 11, slug: "dup", title: "Second", published_at: "2026-01-02T00:00:00Z", content: "b" },
          ];
        }
        return [];
      });
      const { getNewsBySlug } = require("@/lib/directus");
      await expect(getNewsBySlug("dup")).resolves.toMatchObject({ id: 10, title: "First" });
    });

    it("getNewsList returns empty array when API returns empty", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockResolvedValueOnce([]); // News
      const { getNewsList } = require("@/lib/directus");
      await expect(getNewsList()).resolves.toEqual([]);
    });

    it("getAbout returns first or null", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockImplementation(async (arg: any) => {
        if (arg.collection === "About") return [{ id: 1, club_description: "hello" }];
        return [];
      });
      const { getAbout } = require("@/lib/directus");
      await expect(getAbout()).resolves.toEqual({ id: 1, club_description: "hello" });
    });

    it("getAbout returns null when API returns empty", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockImplementation(async (arg: any) => {
        if (arg.collection === "About") return [];
        return [];
      });
      const { getAbout } = require("@/lib/directus");
      await expect(getAbout()).resolves.toBeNull();
    });

    it("getTeam and getPartners return arrays", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockImplementation(async (arg: any) => {
        if (arg.collection === "Team") return [{ id: 1, name: "Alice", role: "Coach" }];
        if (arg.collection === "Partners") return [{ id: 2, name: "ACME", url: "https://ac.me" }];
        return [];
      });
      const { getTeam, getPartners } = require("@/lib/directus");
      await expect(getTeam()).resolves.toEqual([{ id: 1, name: "Alice", role: "Coach" }]);
      await expect(getPartners()).resolves.toEqual([{ id: 2, name: "ACME", url: "https://ac.me" }]);
    });

    it("getTeam/getPartners return empty when API returns empty", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockImplementation(async (arg: any) => {
        if (arg.collection === "Team") return [];
        if (arg.collection === "Partners") return [];
        return [];
      });
      const { getTeam, getPartners } = require("@/lib/directus");
      await expect(getTeam()).resolves.toEqual([]);
      await expect(getPartners()).resolves.toEqual([]);
    });

    it("getDirectusRestClient returns a client instance", () => {
      mockDirectusSDK();
      const { getDirectusRestClient } = require("@/lib/directus");
      const client = getDirectusRestClient();
      expect(client).toBeTruthy();
      expect(typeof client).toBe("object");
    });

    it("propagates errors from client when env is configured", async () => {
      const requestMock = mockDirectusSDK();
      requestMock.mockRejectedValueOnce(new Error("boom"));
      const { getNewsList } = require("@/lib/directus");
      await expect(getNewsList()).rejects.toThrow(/boom/);
    });
  });
});


