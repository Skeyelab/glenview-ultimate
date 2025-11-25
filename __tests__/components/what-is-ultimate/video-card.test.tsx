import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VideoCard } from '@/components/what-is-ultimate/video-card';

describe('VideoCard', () => {
  it('renders title', () => {
    render(<VideoCard title="Test Video" description="Test description" />);
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<VideoCard title="Test Video" description="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders YouTube embed when embedId is provided', () => {
    const { container } = render(
      <VideoCard title="Test Video" description="Test description" embedId="dQw4w9WgXcQ" />,
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(iframe).toHaveAttribute('title', 'Test Video');
  });

  it('renders video URL when videoUrl is provided', () => {
    const { container } = render(
      <VideoCard title="Test Video" description="Test description" videoUrl="https://example.com/video.mp4" />,
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://example.com/video.mp4');
  });

  it('prioritizes embedId over videoUrl', () => {
    const { container } = render(
      <VideoCard
        title="Test Video"
        description="Test description"
        embedId="dQw4w9WgXcQ"
        videoUrl="https://example.com/video.mp4"
      />,
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('renders placeholder when no video is provided', () => {
    render(<VideoCard title="Test Video" description="Test description" />);
    expect(screen.getByText(/YouTube Video Embed/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });

  it('renders custom placeholder when provided', () => {
    render(
      <VideoCard
        title="Test Video"
        description="Test description"
        placeholder={<div data-testid="custom-placeholder">Custom Placeholder</div>}
      />,
    );
    expect(screen.getByTestId('custom-placeholder')).toBeInTheDocument();
  });

  it('uses custom title element when provided', () => {
    render(<VideoCard title="Test Video" description="Test description" titleAs="h2" />);
    const title = screen.getByText('Test Video');
    expect(title.tagName).toBe('H2');
  });

  it('defaults to h3 for title', () => {
    render(<VideoCard title="Test Video" description="Test description" />);
    const title = screen.getByText('Test Video');
    expect(title.tagName).toBe('H3');
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <VideoCard title="Test Video" description="Test description" className="custom-class" />,
    );
    const card = container.querySelector('.card');
    expect(card).toHaveClass('custom-class');
  });

});
