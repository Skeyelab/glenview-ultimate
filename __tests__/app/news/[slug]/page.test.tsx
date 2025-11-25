import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import NewsPostPage from '@/app/news/[slug]/page';
import * as directusModule from '@/lib/directus';

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getNewsBySlug: vi.fn(),
}));

// Mock marked
vi.mock('marked', () => ({
  marked: {
    parse: vi.fn(async (content: string) => {
      if (content === '# Test Content') return '<h1>Test Content</h1>';
      return '<p>Parsed content</p>';
    }),
  },
}));

// Mock sanitize-html
vi.mock('sanitize-html', () => ({
  default: vi.fn((html: string) => html),
}));

// Mock next/navigation
const mockNotFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    mockNotFound();
    throw new Error('notFound');
  },
}));

// Mock NewsPost component
vi.mock('@/components/news/news-post', () => ({
  NewsPost: ({ post, htmlContent }: { post: any; htmlContent: string }) => (
    <div data-testid="news-post">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  ),
}));

describe('NewsPostPage', () => {
  const getNewsBySlug = vi.mocked(directusModule.getNewsBySlug);

  beforeEach(() => {
    vi.clearAllMocks();
    mockNotFound.mockClear();
  });

  it('renders post when found', async () => {
    const mockPost = {
      id: 1,
      slug: 'test-article',
      title: 'Test Article',
      published_at: '2024-06-15',
      excerpt: 'Test excerpt',
      content: '# Test Content',
    };

    getNewsBySlug.mockResolvedValue(mockPost);

    const page = await NewsPostPage({ params: Promise.resolve({ slug: 'test-article' }) });
    const { getByTestId } = render(page);

    expect(getByTestId('news-post')).toBeInTheDocument();
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('calls notFound when post does not exist', async () => {
    getNewsBySlug.mockResolvedValue(null);

    try {
      await NewsPostPage({ params: Promise.resolve({ slug: 'non-existent' }) });
    } catch (error) {
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    }
  });

  it('parses markdown content', async () => {
    const { marked } = await import('marked');
    const mockPost = {
      id: 1,
      slug: 'test-article',
      title: 'Test Article',
      published_at: '2024-06-15',
      excerpt: 'Test excerpt',
      content: '# Test Content',
    };

    getNewsBySlug.mockResolvedValue(mockPost);

    await NewsPostPage({ params: Promise.resolve({ slug: 'test-article' }) });

    expect(marked.parse).toHaveBeenCalledWith('# Test Content');
  });

  it('sanitizes HTML content', async () => {
    const sanitizeHtml = (await import('sanitize-html')).default;
    const mockPost = {
      id: 1,
      slug: 'test-article',
      title: 'Test Article',
      published_at: '2024-06-15',
      excerpt: 'Test excerpt',
      content: '# Test Content',
    };

    getNewsBySlug.mockResolvedValue(mockPost);

    await NewsPostPage({ params: Promise.resolve({ slug: 'test-article' }) });

    expect(sanitizeHtml).toHaveBeenCalled();
  });

  it('passes parsed and sanitized HTML to NewsPost', async () => {
    const mockPost = {
      id: 1,
      slug: 'test-article',
      title: 'Test Article',
      published_at: '2024-06-15',
      excerpt: 'Test excerpt',
      content: '# Test Content',
    };

    getNewsBySlug.mockResolvedValue(mockPost);

    const page = await NewsPostPage({ params: Promise.resolve({ slug: 'test-article' }) });
    const { container } = render(page);

    // The mocked NewsPost component renders htmlContent in a div with dangerouslySetInnerHTML
    // So we can check that the HTML content is passed correctly
    const contentDiv = container.querySelector('div[data-testid="news-post"] div');
    expect(contentDiv).toBeInTheDocument();
    const h1 = contentDiv?.querySelector('h1');
    expect(h1?.textContent).toBe('Test Content');
  });

  it('calls getNewsBySlug with correct slug', async () => {
    const mockPost = {
      id: 1,
      slug: 'test-article',
      title: 'Test Article',
      published_at: '2024-06-15',
      excerpt: 'Test excerpt',
      content: 'Content',
    };

    getNewsBySlug.mockResolvedValue(mockPost);

    await NewsPostPage({ params: Promise.resolve({ slug: 'test-article' }) });

    expect(getNewsBySlug).toHaveBeenCalledWith('test-article');
  });
});
