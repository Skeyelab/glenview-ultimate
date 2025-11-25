import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { VideoGrid } from '@/components/what-is-ultimate/video-grid';
import type { VideoItem } from '@/components/what-is-ultimate/video-grid';

// Mock VideoCard
vi.mock('@/components/what-is-ultimate/video-card', () => ({
  VideoCard: ({ title }: { title: string }) => <div data-testid={`video-${title}`}>{title}</div>,
}));

describe('VideoGrid', () => {
  const mockVideos: VideoItem[] = [
    { title: 'Video 1', description: 'Description 1', embedId: 'id1' },
    { title: 'Video 2', description: 'Description 2', embedId: 'id2' },
    { title: 'Video 3', description: 'Description 3', embedId: 'id3' },
  ];

  it('renders section title', () => {
    render(<VideoGrid videos={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: /Learn More Through Videos/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<VideoGrid videos={[]} title="Custom Title" />);
    expect(screen.getByRole('heading', { level: 2, name: /Custom Title/i })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<VideoGrid videos={[]} description="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<VideoGrid videos={[]} />);
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('renders all videos', () => {
    render(<VideoGrid videos={mockVideos} />);
    expect(screen.getByTestId('video-Video 1')).toBeInTheDocument();
    expect(screen.getByTestId('video-Video 2')).toBeInTheDocument();
    expect(screen.getByTestId('video-Video 3')).toBeInTheDocument();
  });

  it('renders with 2 columns by default', () => {
    const { container } = render(<VideoGrid videos={mockVideos} />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });

  it('renders with 1 column when specified', () => {
    const { container } = render(<VideoGrid videos={mockVideos} columns={1} />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
  });

  it('renders with 3 columns when specified', () => {
    const { container } = render(<VideoGrid videos={mockVideos} columns={3} />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('renders with 4 columns when specified', () => {
    const { container } = render(<VideoGrid videos={mockVideos} columns={4} />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  it('uses custom renderVideo when provided', () => {
    const customRender = (video: VideoItem, index: number) => (
      <div key={index} data-testid={`custom-${index}`}>
        Custom: {video.title}
      </div>
    );
    render(<VideoGrid videos={mockVideos} renderVideo={customRender} />);
    expect(screen.getByTestId('custom-0')).toBeInTheDocument();
    expect(screen.getByText(/Custom: Video 1/i)).toBeInTheDocument();
    expect(screen.queryByTestId('video-Video 1')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<VideoGrid videos={mockVideos} className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

});
