import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { SeasonHighlightsCard } from '@/components/home/season-highlights-card';

// Mock SectionCard
vi.mock('@/components/ui/section-card', () => ({
  SectionCard: ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <div data-testid="section-card" className={className}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

describe('SeasonHighlightsCard', () => {
  it('renders section title', () => {
    render(<SeasonHighlightsCard highlights={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: /Season Highlights/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<SeasonHighlightsCard highlights={[]} title="Custom Highlights" />);
    expect(screen.getByRole('heading', { level: 2, name: /Custom Highlights/i })).toBeInTheDocument();
  });

  it('renders highlights list when provided', () => {
    const highlights = ['Highlight 1', 'Highlight 2', 'Highlight 3'];
    render(<SeasonHighlightsCard highlights={highlights} />);
    expect(screen.getByText('Highlight 1')).toBeInTheDocument();
    expect(screen.getByText('Highlight 2')).toBeInTheDocument();
    expect(screen.getByText('Highlight 3')).toBeInTheDocument();
  });

  it('renders empty message when highlights array is empty', () => {
    render(<SeasonHighlightsCard highlights={[]} />);
    expect(screen.getByText(/Highlights coming soon./i)).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    render(<SeasonHighlightsCard highlights={[]} emptyMessage="No highlights yet." />);
    expect(screen.getByText(/No highlights yet./i)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<SeasonHighlightsCard highlights={[]} className="custom-class" />);
    const card = container.querySelector('[data-testid="section-card"]');
    expect(card).toHaveClass('custom-class');
  });

  it('renders list with correct structure', () => {
    const highlights = ['Highlight 1'];
    const { container } = render(<SeasonHighlightsCard highlights={highlights} />);
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('list-disc', 'ps-5', 'space-y-1');
  });
});
