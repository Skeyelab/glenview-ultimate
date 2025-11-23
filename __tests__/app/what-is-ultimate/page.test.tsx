import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Mock sanitize-html
vi.mock('sanitize-html', () => {
  return vi.fn((html: string) => html);
});

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getWhatIsUltimate: vi.fn(),
  getWhatIsUltimateVideos: vi.fn(),
}));

// Mock components
vi.mock('@/components/what-is-ultimate/what-is-ultimate-header', () => ({
  WhatIsUltimateHeader: () => <h1>What is Ultimate?</h1>,
}));

vi.mock('@/components/what-is-ultimate/description-section', () => ({
  DescriptionSection: ({ htmlContent, paragraphs }: any) => (
    <div data-testid="description-section">
      {htmlContent ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : null}
      {paragraphs?.map((p: string, i: number) => <p key={i}>{p}</p>)}
    </div>
  ),
}));

vi.mock('@/components/what-is-ultimate/video-grid', () => ({
  VideoGrid: ({ videos, description }: any) => (
    <div data-testid="video-grid">
      <h2>Learn More Through Videos</h2>
      {description && <p>{description}</p>}
      {videos.map((video: any, i: number) => (
        <div key={i} data-testid={`video-${i}`}>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
        </div>
      ))}
    </div>
  ),
}));

import WhatIsUltimatePage from '@/app/what-is-ultimate/page';
import * as directusModule from '@/lib/directus';

describe('WhatIsUltimatePage', () => {
  const getWhatIsUltimate = vi.mocked(directusModule.getWhatIsUltimate);
  const getWhatIsUltimateVideos = vi.mocked(directusModule.getWhatIsUltimateVideos);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', async () => {
    getWhatIsUltimate.mockResolvedValue(null);
    getWhatIsUltimateVideos.mockResolvedValue([]);

    const page = await WhatIsUltimatePage();
    render(page);

    expect(screen.getByRole('heading', { level: 1, name: /what is ultimate\?/i })).toBeInTheDocument();
  });

  it('renders introductory text about Ultimate from fallback paragraphs', async () => {
    getWhatIsUltimate.mockResolvedValue(null);
    getWhatIsUltimateVideos.mockResolvedValue([]);

    const page = await WhatIsUltimatePage();
    render(page);

    expect(screen.getByText(/Ultimate, also known as Ultimate Frisbee/i)).toBeInTheDocument();
    expect(screen.getByText(/emphasizing sportsmanship and fair play/i)).toBeInTheDocument();
  });

  it('renders HTML description when available from Directus', async () => {
    const mockWhatIsUltimate = {
      id: 1,
      Description: '<p>This is <strong>HTML</strong> content from Directus.</p>',
    };
    getWhatIsUltimate.mockResolvedValue(mockWhatIsUltimate);
    getWhatIsUltimateVideos.mockResolvedValue([]);

    const page = await WhatIsUltimatePage();
    render(page);

    expect(screen.getByText(/This is/)).toBeInTheDocument();
    expect(screen.getByText(/HTML/)).toBeInTheDocument();
  });

  it('renders the Learn More section heading', async () => {
    getWhatIsUltimate.mockResolvedValue(null);
    getWhatIsUltimateVideos.mockResolvedValue([]);

    const page = await WhatIsUltimatePage();
    render(page);

    expect(screen.getByRole('heading', { level: 2, name: /learn more through videos/i })).toBeInTheDocument();
  });

  it('renders videos from Directus', async () => {
    const mockVideos = [
      {
        id: 1,
        title: 'Introduction to Ultimate',
        description: 'A comprehensive introduction',
        youtube_embed_id: 'abc123',
        video_url: null,
        sort: 1,
      },
      {
        id: 2,
        title: 'How to Play',
        description: 'Learn the fundamentals',
        youtube_embed_id: null,
        video_url: 'https://example.com/video',
        sort: 2,
      },
    ];

    getWhatIsUltimate.mockResolvedValue(null);
    getWhatIsUltimateVideos.mockResolvedValue(mockVideos);

    const page = await WhatIsUltimatePage();
    render(page);

    expect(screen.getByRole('heading', { level: 3, name: /introduction to ultimate/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /how to play/i })).toBeInTheDocument();
    expect(screen.getByText(/A comprehensive introduction/)).toBeInTheDocument();
    expect(screen.getByText(/Learn the fundamentals/)).toBeInTheDocument();
  });

  it('renders a note about videos coming soon when no videos are available', async () => {
    getWhatIsUltimate.mockResolvedValue(null);
    getWhatIsUltimateVideos.mockResolvedValue([]);

    const page = await WhatIsUltimatePage();
    render(page);

    expect(screen.getByText(/video content will be added soon/i)).toBeInTheDocument();
  });

  it('should fetch WhatIsUltimate and WhatIsUltimateVideos data', async () => {
    getWhatIsUltimate.mockResolvedValue(null);
    getWhatIsUltimateVideos.mockResolvedValue([]);

    await WhatIsUltimatePage();

    expect(getWhatIsUltimate).toHaveBeenCalledTimes(1);
    expect(getWhatIsUltimateVideos).toHaveBeenCalledTimes(1);
  });
});
