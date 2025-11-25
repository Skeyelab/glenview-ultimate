import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { NewsArticleCard } from '@/components/news/news-article-card';
import type { NewsPost } from '@/lib/directus';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock date-utils
vi.mock('@/lib/date-utils', () => ({
  formatFullDate: vi.fn((date: string) => {
    if (date === '2024-06-15') return 'June 15, 2024';
    return null;
  }),
}));

describe('NewsArticleCard', () => {
  const mockPost: NewsPost = {
    id: 1,
    slug: 'test-article',
    title: 'Test Article Title',
    published_at: '2024-06-15',
    excerpt: 'This is a test excerpt',
    content: 'Full content here',
  };

  it('renders article title', () => {
    render(<NewsArticleCard post={mockPost} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('renders title as link to article page', () => {
    render(<NewsArticleCard post={mockPost} />);
    const link = screen.getByRole('link', { name: 'Test Article Title' });
    expect(link).toHaveAttribute('href', '/news/test-article');
  });

  it('renders formatted date when published_at exists', () => {
    render(<NewsArticleCard post={mockPost} />);
    expect(screen.getByText('June 15, 2024')).toBeInTheDocument();
  });

  it('does not render date when published_at is missing', () => {
    const postWithoutDate: NewsPost = {
      ...mockPost,
      published_at: '',
    };
    render(<NewsArticleCard post={postWithoutDate} />);
    expect(screen.queryByText('June 15, 2024')).not.toBeInTheDocument();
  });

  it('renders excerpt when showExcerpt is true and excerpt exists', () => {
    render(<NewsArticleCard post={mockPost} showExcerpt />);
    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
  });

  it('does not render excerpt when showExcerpt is false', () => {
    render(<NewsArticleCard post={mockPost} showExcerpt={false} />);
    expect(screen.queryByText('This is a test excerpt')).not.toBeInTheDocument();
  });

  it('does not render excerpt when excerpt is missing', () => {
    const postWithoutExcerpt: NewsPost = {
      ...mockPost,
      excerpt: null,
    };
    render(<NewsArticleCard post={postWithoutExcerpt} showExcerpt />);
    expect(screen.queryByText('This is a test excerpt')).not.toBeInTheDocument();
  });

  it('renders read more link when showReadMore is true', () => {
    render(<NewsArticleCard post={mockPost} showReadMore />);
    const readMoreLink = screen.getByRole('link', { name: /Read more/i });
    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink).toHaveAttribute('href', '/news/test-article');
  });

  it('does not render read more link when showReadMore is false', () => {
    render(<NewsArticleCard post={mockPost} showReadMore={false} />);
    expect(screen.queryByRole('link', { name: /Read more/i })).not.toBeInTheDocument();
  });

  it('renders custom read more label', () => {
    render(<NewsArticleCard post={mockPost} readMoreLabel="Continue reading" />);
    expect(screen.getByRole('link', { name: /Continue reading/i })).toBeInTheDocument();
  });

  it('uses custom date formatter when provided', () => {
    const customFormatter = vi.fn((date: string) => `Custom: ${date}`);
    render(<NewsArticleCard post={mockPost} dateFormat={customFormatter} />);
    expect(customFormatter).toHaveBeenCalledWith('2024-06-15');
    expect(screen.getByText('Custom: 2024-06-15')).toBeInTheDocument();
  });

  it('uses custom title element when provided', () => {
    render(<NewsArticleCard post={mockPost} titleAs="h3" />);
    const link = screen.getByRole('link', { name: 'Test Article Title' });
    const title = link.closest('h3');
    expect(title).toBeInTheDocument();
    expect(title?.tagName).toBe('H3');
  });

  it('defaults to h2 for title', () => {
    render(<NewsArticleCard post={mockPost} />);
    const link = screen.getByRole('link', { name: 'Test Article Title' });
    const title = link.closest('h2');
    expect(title).toBeInTheDocument();
    expect(title?.tagName).toBe('H2');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<NewsArticleCard post={mockPost} className="custom-class" />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('custom-class');
  });

});
