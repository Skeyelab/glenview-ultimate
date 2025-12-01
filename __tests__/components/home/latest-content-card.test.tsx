import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { LatestContentCard } from '@/components/home/latest-content-card';
import type { NewsPost, WhatIsUltimateVideo } from '@/lib/directus';

// Mock SectionCard
vi.mock('@/components/ui/section-card', () => ({
  SectionCard: ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <div data-testid="section-card" className={className}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

// Mock NewsArticleCard
vi.mock('@/components/news/news-article-card', () => ({
  NewsArticleCard: ({ post }: { post: NewsPost }) => (
    <div data-testid="news-article-card">
      <h3>{post.title}</h3>
    </div>
  ),
}));

// Mock VideoCard
vi.mock('@/components/what-is-ultimate/video-card', () => ({
  VideoCard: ({ title }: { title: string }) => (
    <div data-testid="video-card">
      <h3>{title}</h3>
    </div>
  ),
}));

describe('LatestContentCard', () => {
  const mockNewsPost: NewsPost = {
    id: 1,
    slug: 'test-article',
    title: 'Test News Article',
    published_at: '2026-01-01T00:00:00Z',
    content: 'Test content',
    excerpt: 'Test excerpt',
  };

  const mockVideo: WhatIsUltimateVideo = {
    id: 1,
    title: 'Test Video',
    description: 'Test video description',
    youtube_embed_id: 'abc123',
    video_url: null,
    sort: 1,
    active: true,
  };

  it('renders latest news when available', () => {
    render(<LatestContentCard latestNews={mockNewsPost} />);
    expect(screen.getByRole('heading', { level: 2, name: /Latest News/i })).toBeInTheDocument();
    expect(screen.getByTestId('news-article-card')).toBeInTheDocument();
    expect(screen.getByText('Test News Article')).toBeInTheDocument();
  });

  it('renders first video when no news is available', () => {
    render(<LatestContentCard firstVideo={mockVideo} />);
    expect(screen.getByRole('heading', { level: 2, name: /Learn More/i })).toBeInTheDocument();
    expect(screen.getByTestId('video-card')).toBeInTheDocument();
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  it('prioritizes news over video when both are available', () => {
    render(<LatestContentCard latestNews={mockNewsPost} firstVideo={mockVideo} />);
    expect(screen.getByRole('heading', { level: 2, name: /Latest News/i })).toBeInTheDocument();
    expect(screen.getByTestId('news-article-card')).toBeInTheDocument();
    expect(screen.queryByTestId('video-card')).not.toBeInTheDocument();
  });

  it('renders empty message when no content is available', () => {
    render(<LatestContentCard />);
    expect(screen.getByRole('heading', { level: 2, name: /Latest Updates/i })).toBeInTheDocument();
    expect(screen.getByText(/Content coming soon./i)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<LatestContentCard latestNews={mockNewsPost} className="custom-class" />);
    const card = container.querySelector('[data-testid="section-card"]');
    expect(card).toHaveClass('custom-class');
  });
});

