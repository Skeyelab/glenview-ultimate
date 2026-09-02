import { beforeEach, afterAll, vi, describe, it, expect } from 'vitest';

// Mock @directus/sdk at the top level (required for Vitest)
const mockRequest = vi.fn();
const mockCreateDirectus = vi.fn(() => ({
  with: vi.fn(function (this: any) {
    return this;
  }),
  request: mockRequest,
}));

vi.mock('@directus/sdk', () => ({
  createDirectus: vi.fn(() => mockCreateDirectus()),
  readItems: vi.fn((collection: string, params?: any) => ({ __op: 'readItems', collection, params })),
  rest: vi.fn(() => ({})),
  staticToken: vi.fn(() => ({})),
}));

describe('directus fetchers', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest.mockClear();
    // Reset the module cache by clearing the client singleton
    // We'll need to re-import the module after changing env vars
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('fallbacks when env missing', () => {
    it('returns defaults when DIRECTUS env is not configured', async () => {
      delete process.env.DIRECTUS_URL;
      delete process.env.DIRECTUS_STATIC_TOKEN;

      // Re-import to get fresh module state
      vi.resetModules();
      const { getNewsList, getNewsBySlug, getAbout, getTeam, getPartners } = await import('@/lib/directus');

      expect(await getNewsList()).toEqual([]);
      expect(await getNewsBySlug('any')).toBeNull();
      expect(await getAbout()).toBeNull();
      expect(await getTeam()).toEqual([]);
      expect(await getPartners()).toEqual([]);
    });

    it('getDirectusRestClient throws when not configured', () => {
      delete process.env.DIRECTUS_URL;
      delete process.env.DIRECTUS_STATIC_TOKEN;

      vi.resetModules();
      return import('@/lib/directus').then(({ getDirectusRestClient }) => {
        expect(() => getDirectusRestClient()).toThrow(/Directus not configured/i);
      });
    });
  });

  describe('fetchers with configured env', () => {
    beforeEach(() => {
      process.env.DIRECTUS_URL = 'https://directus.test';
      process.env.DIRECTUS_STATIC_TOKEN = 'token';
      vi.resetModules();
    });

    it('getTeamPhotos requests only active photos, newest season first', async () => {
      let captured: any = null;
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'TeamPhotos') {
          captured = arg.params;
          return [{ id: 1, title: 'U14', image: 'img-1', season_year: 2026, sort: 1, active: true }];
        }
        return [];
      });

      const { getTeamPhotos } = await import('@/lib/directus');
      await expect(getTeamPhotos()).resolves.toHaveLength(1);
      expect(captured.filter).toEqual({ active: { _eq: true } });
      expect(captured.sort).toEqual(['-season_year', 'sort']);
    });

    it('getNewsList returns list from client', async () => {
      const items = [
        { id: 1, slug: 'a', title: 'A', published_at: '2026-01-01T00:00:00Z', content: 'x' },
        { id: 2, slug: 'b', title: 'B', published_at: '2026-02-01T00:00:00Z', content: 'y' },
      ];
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'News') return items;
        return [];
      });

      const { getNewsList } = await import('@/lib/directus');
      await expect(getNewsList()).resolves.toEqual(items);
    });

    it('getNewsBySlug returns first or null', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'News') {
          const slug = arg?.params?.filter?.slug?._eq;
          return slug === 'match' ? [{ id: 3, slug: 'match', title: 'M', published_at: '2026-03-01T00:00:00Z', content: 'z' }] : [];
        }
        return [];
      });

      const { getNewsBySlug } = await import('@/lib/directus');
      await expect(getNewsBySlug('match')).resolves.toMatchObject({ slug: 'match' });
      await expect(getNewsBySlug('miss')).resolves.toBeNull();
    });

    it('hasNewsArticles returns true when articles exist', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'News') return [{ id: 1 }];
        return [];
      });

      const { hasNewsArticles } = await import('@/lib/directus');
      await expect(hasNewsArticles()).resolves.toBe(true);
    });

    it('hasNewsArticles returns false when no articles exist', async () => {
      mockRequest.mockImplementation(async () => []);

      const { hasNewsArticles } = await import('@/lib/directus');
      await expect(hasNewsArticles()).resolves.toBe(false);
    });

    it('getNewsBySlug selects first when multiple returned', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'News') {
          return [
            { id: 10, slug: 'dup', title: 'First', published_at: '2026-01-01T00:00:00Z', content: 'a' },
            { id: 11, slug: 'dup', title: 'Second', published_at: '2026-01-02T00:00:00Z', content: 'b' },
          ];
        }
        return [];
      });

      const { getNewsBySlug } = await import('@/lib/directus');
      await expect(getNewsBySlug('dup')).resolves.toMatchObject({ id: 10, title: 'First' });
    });

    it('getNewsList returns empty array when API returns empty', async () => {
      mockRequest.mockResolvedValueOnce([]);
      const { getNewsList } = await import('@/lib/directus');
      await expect(getNewsList()).resolves.toEqual([]);
    });

    it('getAbout returns first or null', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'About') return [{ id: 1, club_description: 'hello' }];
        return [];
      });

      const { getAbout } = await import('@/lib/directus');
      await expect(getAbout()).resolves.toEqual({ id: 1, club_description: 'hello' });
    });

    it('getAbout returns null when API returns empty', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'About') return [];
        return [];
      });

      const { getAbout } = await import('@/lib/directus');
      await expect(getAbout()).resolves.toBeNull();
    });

    it('getAbout handles JSON field what_kids_learn as array', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'About') {
          return [
            {
              id: 1,
              club_description: 'Test description',
              what_kids_learn: ['Rule 1', 'Rule 2', 'Rule 3'],
            },
          ];
        }
        return [];
      });

      const { getAbout } = await import('@/lib/directus');
      const result = await getAbout();
      expect(result).toEqual({
        id: 1,
        club_description: 'Test description',
        what_kids_learn: ['Rule 1', 'Rule 2', 'Rule 3'],
      });
      expect(Array.isArray(result?.what_kids_learn)).toBe(true);
    });

    it('getAbout handles singleton collection correctly (array response)', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'About') {
          return [{ id: 1, club_description: 'Singleton data', what_kids_learn: null }];
        }
        return [];
      });

      const { getAbout } = await import('@/lib/directus');
      const result = await getAbout();
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it('getWhatIsUltimate returns first or null', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'WhatIsUltimate') {
          return [{ id: 1, Description: 'Test description' }];
        }
        return [];
      });

      const { getWhatIsUltimate } = await import('@/lib/directus');
      await expect(getWhatIsUltimate()).resolves.toEqual({ id: 1, Description: 'Test description' });
    });

    it('getWhatIsUltimate returns null when API returns empty', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'WhatIsUltimate') return [];
        return [];
      });

      const { getWhatIsUltimate } = await import('@/lib/directus');
      await expect(getWhatIsUltimate()).resolves.toBeNull();
    });

    it('getWhatIsUltimate handles singleton collection correctly (array response)', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'WhatIsUltimate') {
          return [{ id: 1, Description: 'Singleton description' }];
        }
        return [];
      });

      const { getWhatIsUltimate } = await import('@/lib/directus');
      const result = await getWhatIsUltimate();
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.Description).toBe('Singleton description');
    });

    it('getTeam and getPartners return arrays', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'Team') return [{ id: 1, name: 'Alice', role: 'Coach' }];
        if (arg?.collection === 'Partners') return [{ id: 2, name: 'ACME', url: 'https://ac.me' }];
        return [];
      });

      const { getTeam, getPartners } = await import('@/lib/directus');
      await expect(getTeam()).resolves.toEqual([{ id: 1, name: 'Alice', role: 'Coach' }]);
      await expect(getPartners()).resolves.toEqual([{ id: 2, name: 'ACME', url: 'https://ac.me' }]);
    });

    it('getTeam/getPartners return empty when API returns empty', async () => {
      mockRequest.mockImplementation(async (arg: any) => {
        if (arg?.collection === 'Team') return [];
        if (arg?.collection === 'Partners') return [];
        return [];
      });

      const { getTeam, getPartners } = await import('@/lib/directus');
      await expect(getTeam()).resolves.toEqual([]);
      await expect(getPartners()).resolves.toEqual([]);
    });

    it('getDirectusRestClient returns a client instance', async () => {
      const { getDirectusRestClient } = await import('@/lib/directus');
      const client = getDirectusRestClient();
      expect(client).toBeTruthy();
      expect(typeof client).toBe('object');
    });

    it('propagates errors from client when env is configured', async () => {
      mockRequest.mockRejectedValueOnce(new Error('boom'));
      const { getNewsList } = await import('@/lib/directus');
      await expect(getNewsList()).rejects.toThrow(/boom/);
    });
  });
});
