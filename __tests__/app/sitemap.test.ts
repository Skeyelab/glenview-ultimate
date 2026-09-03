import { beforeEach, afterAll, vi } from 'vitest';
import sitemap from '@/app/sitemap';
import * as directusModule from '@/lib/directus';

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getNewsList: vi.fn(),
}));

describe('sitemap', () => {
  const getNewsList = vi.mocked(directusModule.getNewsList);
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SITE_URL: 'https://www.glenview-ultimate.org',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('generates static paths', async () => {
    getNewsList.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toHaveLength(6); // 6 static paths
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/')).toBeDefined();
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/about')).toBeDefined();
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/register')).toBeDefined();
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/schedule')).toBeDefined();
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/news')).toBeDefined();
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/what-is-ultimate')).toBeDefined();
  });

  it('sets correct priorities for static paths', async () => {
    getNewsList.mockResolvedValue([]);

    const result = await sitemap();

    const homeEntry = result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/');
    expect(homeEntry?.priority).toBe(1);

    const aboutEntry = result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/about');
    expect(aboutEntry?.priority).toBe(0.6);

    const registerEntry = result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/register');
    expect(registerEntry?.priority).toBe(0.9);
  });

  it('sets correct changeFrequency for static paths', async () => {
    getNewsList.mockResolvedValue([]);

    const result = await sitemap();

    const homeEntry = result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/');
    expect(homeEntry?.changeFrequency).toBe('weekly');

    const newsEntry = result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/news');
    expect(newsEntry?.changeFrequency).toBe('daily');
  });

  it('generates news entries from getNewsList', async () => {
    const mockNewsPosts = [
      {
        id: 1,
        slug: 'article-1',
        title: 'Article 1',
        published_at: '2024-06-15',
        excerpt: null,
        content: 'Content 1',
      },
      {
        id: 2,
        slug: 'article-2',
        title: 'Article 2',
        published_at: '2024-06-16',
        excerpt: null,
        content: 'Content 2',
      },
    ];

    getNewsList.mockResolvedValue(mockNewsPosts);

    const result = await sitemap();

    expect(result).toHaveLength(8); // 6 static + 2 news
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/news/article-1')).toBeDefined();
    expect(result.find((entry) => entry.url === 'https://www.glenview-ultimate.org/news/article-2')).toBeDefined();
  });

  it('sets lastModified from published_at for news entries', async () => {
    const mockNewsPosts = [
      {
        id: 1,
        slug: 'article-1',
        title: 'Article 1',
        published_at: '2024-06-15T10:00:00Z',
        excerpt: null,
        content: 'Content 1',
      },
    ];

    getNewsList.mockResolvedValue(mockNewsPosts);

    const result = await sitemap();
    const newsEntry = result.find((entry) => entry.url.includes('/news/article-1'));

    // MetadataRoute.Sitemap types lastModified as string | Date, so narrow
    // after asserting it really is a Date rather than widening the assertion.
    const lastModified = newsEntry?.lastModified;
    expect(lastModified).toBeInstanceOf(Date);
    expect((lastModified as Date).toISOString()).toContain('2024-06-15');
  });

  it('sets correct priority and changeFrequency for news entries', async () => {
    const mockNewsPosts = [
      {
        id: 1,
        slug: 'article-1',
        title: 'Article 1',
        published_at: '2024-06-15',
        excerpt: null,
        content: 'Content 1',
      },
    ];

    getNewsList.mockResolvedValue(mockNewsPosts);

    const result = await sitemap();
    const newsEntry = result.find((entry) => entry.url.includes('/news/article-1'));

    expect(newsEntry?.priority).toBe(0.6);
    expect(newsEntry?.changeFrequency).toBe('monthly');
  });

  it('handles news posts without published_at', async () => {
    const mockNewsPosts = [
      {
        id: 1,
        slug: 'article-1',
        title: 'Article 1',
        published_at: '',
        excerpt: null,
        content: 'Content 1',
      },
    ];

    getNewsList.mockResolvedValue(mockNewsPosts);

    const result = await sitemap();
    const newsEntry = result.find((entry) => entry.url.includes('/news/article-1'));

    expect(newsEntry?.lastModified).toBeUndefined();
  });

  it('calls getNewsList with limit 100', async () => {
    getNewsList.mockResolvedValue([]);

    await sitemap();

    expect(getNewsList).toHaveBeenCalledWith(100);
  });

  it('handles missing NEXT_PUBLIC_SITE_URL', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    getNewsList.mockResolvedValue([]);

    const result = await sitemap();

    // Should use default URL
    expect(result[0]?.url).toContain('https://www.glenview-ultimate.org');
  });

  it('trims trailing slashes from site URL', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.glenview-ultimate.org/';
    getNewsList.mockResolvedValue([]);

    const result = await sitemap();

    // The URL should not have double slashes when concatenating paths
    expect(result[0]?.url).toBe('https://www.glenview-ultimate.org/');
    // Check that paths don't create double slashes (like /about should not become //about)
    const aboutUrl = result.find((entry) => entry.url.endsWith('/about'));
    expect(aboutUrl?.url).toBe('https://www.glenview-ultimate.org/about');
    // Ensure no double slashes in the path portion (after the protocol)
    const pathPart = aboutUrl?.url.replace(/^https?:\/\//, '');
    expect(pathPart).not.toContain('//');
  });
});

