import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { NewsPost } from '@/components/news/news-post';
import type { NewsPost as NewsPostType } from '@/lib/directus';

// Mock date-utils
vi.mock('@/lib/date-utils', () => ({
  formatFullDate: vi.fn((date: string) => {
    if (date === '2024-06-15') return 'June 15, 2024';
    return null;
  }),
}));

describe('NewsPost', () => {
  const mockPost: NewsPostType = {
    id: 1,
    slug: 'test-article',
    title: 'Test Article Title',
    published_at: '2024-06-15',
    excerpt: 'Test excerpt',
    content: 'Test content',
  };

  const mockHtmlContent = '<p>This is HTML content</p><h2>Subheading</h2>';

  it('renders post title', () => {
    render(<NewsPost post={mockPost} htmlContent={mockHtmlContent} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Test Article Title' })).toBeInTheDocument();
  });

  it('renders formatted date when published_at exists', () => {
    render(<NewsPost post={mockPost} htmlContent={mockHtmlContent} />);
    expect(screen.getByText('June 15, 2024')).toBeInTheDocument();
  });

  it('does not render date when published_at is missing', () => {
    const postWithoutDate: NewsPostType = {
      ...mockPost,
      published_at: '',
    };
    render(<NewsPost post={postWithoutDate} htmlContent={mockHtmlContent} />);
    expect(screen.queryByText('June 15, 2024')).not.toBeInTheDocument();
  });

  it('renders HTML content', () => {
    const { container } = render(<NewsPost post={mockPost} htmlContent={mockHtmlContent} />);
    // The HTML content is in a div with dangerouslySetInnerHTML and class "text-white/90"
    const contentDiv = container.querySelector('div.text-white\\/90');
    expect(contentDiv).toBeInTheDocument();
    const paragraph = contentDiv?.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('This is HTML content');
  });

  it('renders HTML content with correct classes', () => {
    const { container } = render(<NewsPost post={mockPost} htmlContent={mockHtmlContent} />);
    const contentDiv = container.querySelector('.prose');
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toHaveClass('prose-invert', 'max-w-none');
  });

  it('uses custom date formatter when provided', () => {
    const customFormatter = vi.fn((date: string) => `Custom: ${date}`);
    render(<NewsPost post={mockPost} htmlContent={mockHtmlContent} dateFormat={customFormatter} />);
    expect(customFormatter).toHaveBeenCalledWith('2024-06-15');
    expect(screen.getByText('Custom: 2024-06-15')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<NewsPost post={mockPost} htmlContent={mockHtmlContent} className="custom-class" />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('custom-class');
  });

  it('applies custom contentClassName when provided', () => {
    const { container } = render(
      <NewsPost post={mockPost} htmlContent={mockHtmlContent} contentClassName="custom-content" />,
    );
    // contentClassName is applied to the div with dangerouslySetInnerHTML, not the prose div
    const contentDiv = container.querySelector('div.text-white\\/90');
    expect(contentDiv).toHaveClass('custom-content');
  });

  it('has correct base article classes', () => {
    const { container } = render(<NewsPost post={mockPost} htmlContent={mockHtmlContent} />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('prose', 'prose-invert', 'max-w-none');
  });
});
