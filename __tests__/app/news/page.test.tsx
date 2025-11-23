import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import NewsIndex from '@/app/news/page';

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getNewsList: vi.fn(),
}));

// Mock components
vi.mock('@/components/news/news-header', () => ({
  NewsHeader: () => <div data-testid="news-header">News Header</div>,
}));

vi.mock('@/components/news/news-list', () => ({
  NewsList: ({ posts }: any) => <div data-testid="news-list">{posts?.length || 0} posts</div>,
}));

describe('NewsIndex', () => {
  const { getNewsList } = require('@/lib/directus');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with empty posts array', async () => {
    getNewsList.mockResolvedValue([]);

    const page = await NewsIndex();
    const { getByTestId } = render(page);

    expect(getByTestId('news-header')).toBeInTheDocument();
    expect(getByTestId('news-list')).toHaveTextContent('0 posts');
  });

  it('should render with fetched posts', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', slug: 'post-1' },
      { id: '2', title: 'Post 2', slug: 'post-2' },
    ];

    getNewsList.mockResolvedValue(mockPosts);

    const page = await NewsIndex();
    const { getByTestId } = render(page);

    expect(getByTestId('news-list')).toHaveTextContent('2 posts');
  });

  it('should fetch news list', async () => {
    getNewsList.mockResolvedValue([]);

    await NewsIndex();

    expect(getNewsList).toHaveBeenCalledTimes(1);
  });
});
