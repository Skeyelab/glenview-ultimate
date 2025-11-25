import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { NewsList } from '@/components/news/news-list';
import type { NewsPost } from '@/lib/directus';

// Mock NewsArticleCard
vi.mock('@/components/news/news-article-card', () => ({
  NewsArticleCard: ({ post }: { post: NewsPost }) => (
    <div data-testid={`article-${post.id}`}>{post.title}</div>
  ),
}));

describe('NewsList', () => {
  const mockPosts: NewsPost[] = [
    {
      id: 1,
      slug: 'article-1',
      title: 'First Article',
      published_at: '2024-06-15',
      excerpt: 'First excerpt',
      content: 'First content',
    },
    {
      id: 2,
      slug: 'article-2',
      title: 'Second Article',
      published_at: '2024-06-16',
      excerpt: 'Second excerpt',
      content: 'Second content',
    },
  ];

  it('renders empty message when posts array is empty', () => {
    render(<NewsList posts={[]} />);
    expect(screen.getByText(/Nothing posted yet. Check back soon./i)).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    render(<NewsList posts={[]} emptyMessage="No articles available." />);
    expect(screen.getByText(/No articles available./i)).toBeInTheDocument();
  });

  it('renders all posts when provided', () => {
    render(<NewsList posts={mockPosts} />);
    expect(screen.getByTestId('article-1')).toBeInTheDocument();
    expect(screen.getByTestId('article-2')).toBeInTheDocument();
  });

  it('renders post titles', () => {
    render(<NewsList posts={mockPosts} />);
    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });

  it('uses custom renderArticle when provided', () => {
    const customRender = (post: NewsPost) => (
      <div key={post.id} data-testid={`custom-${post.id}`}>
        Custom: {post.title}
      </div>
    );
    render(<NewsList posts={mockPosts} renderArticle={customRender} />);
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-2')).toBeInTheDocument();
    expect(screen.getByText(/Custom: First Article/i)).toBeInTheDocument();
    expect(screen.queryByTestId('article-1')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<NewsList posts={mockPosts} className="custom-class" />);
    const list = container.querySelector('div');
    expect(list).toHaveClass('custom-class');
  });

  it('has correct base list classes', () => {
    const { container } = render(<NewsList posts={mockPosts} />);
    const list = container.querySelector('div');
    expect(list).toHaveClass('space-y-4');
  });

  it('handles single post', () => {
    render(<NewsList posts={[mockPosts[0]]} />);
    expect(screen.getByTestId('article-1')).toBeInTheDocument();
    expect(screen.queryByTestId('article-2')).not.toBeInTheDocument();
  });
});
