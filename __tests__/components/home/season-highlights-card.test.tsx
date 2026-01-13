import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { SeasonHighlightsCard } from '@/components/home/season-highlights-card';
import type { ScheduleEvent } from '@/lib/directus';

// Mock SectionCard
vi.mock('@/components/ui/section-card', () => ({
  SectionCard: ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <div data-testid="section-card" className={className}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

// Mock EventTypeBadge
vi.mock('@/components/schedule/event-badge', () => ({
  EventTypeBadge: ({ type }: { type: string }) => (
    <span data-testid="event-badge">{type}</span>
  ),
}));

const mockEvents: ScheduleEvent[] = [
  {
    id: 1,
    season_year: 2026,
    event_type: 'season_start',
    title: 'Season Kickoff',
    date: '2026-03-01T10:00:00.000Z',
    end_date: null,
    location: 'Main Field',
    description: null,
    highlight: true,
  },
  {
    id: 2,
    season_year: 2026,
    event_type: 'tournament',
    title: 'Spring Tournament',
    date: '2026-04-15T09:00:00.000Z',
    end_date: '2026-04-16T17:00:00.000Z',
    location: null,
    description: 'Regional competition',
    highlight: true,
  },
];

describe('SeasonHighlightsCard', () => {
  it('renders section title', () => {
    render(<SeasonHighlightsCard />);
    expect(screen.getByRole('heading', { level: 2, name: /Season Highlights/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<SeasonHighlightsCard title="Custom Highlights" />);
    expect(screen.getByRole('heading', { level: 2, name: /Custom Highlights/i })).toBeInTheDocument();
  });

  describe('with events (preferred)', () => {
    it('renders events with badges', () => {
      render(<SeasonHighlightsCard events={mockEvents} />);
      expect(screen.getByText('Season Kickoff')).toBeInTheDocument();
      expect(screen.getByText('Spring Tournament')).toBeInTheDocument();
      expect(screen.getAllByTestId('event-badge')).toHaveLength(2);
    });

    it('displays event type badges', () => {
      render(<SeasonHighlightsCard events={[mockEvents[0]]} />);
      expect(screen.getByTestId('event-badge')).toHaveTextContent('season_start');
    });

    it('shows location when available', () => {
      render(<SeasonHighlightsCard events={[mockEvents[0]]} />);
      expect(screen.getByText('Main Field')).toBeInTheDocument();
    });

    it('hides location when null', () => {
      render(<SeasonHighlightsCard events={[mockEvents[1]]} />);
      expect(screen.queryByText('Main Field')).not.toBeInTheDocument();
    });

    it('formats date ranges for multi-day events', () => {
      render(<SeasonHighlightsCard events={[mockEvents[1]]} />);
      // formatDateRange returns "April 15–16, 2026" for same-month range
      expect(screen.getByText(/April 15–16, 2026/)).toBeInTheDocument();
    });
  });

  describe('with highlights (legacy)', () => {
    it('renders highlights list when provided', () => {
      const highlights = ['Highlight 1', 'Highlight 2', 'Highlight 3'];
      render(<SeasonHighlightsCard highlights={highlights} />);
      expect(screen.getByText('Highlight 1')).toBeInTheDocument();
      expect(screen.getByText('Highlight 2')).toBeInTheDocument();
      expect(screen.getByText('Highlight 3')).toBeInTheDocument();
    });

    it('renders list with correct structure', () => {
      const highlights = ['Highlight 1'];
      const { container } = render(<SeasonHighlightsCard highlights={highlights} />);
      const list = container.querySelector('ul');
      expect(list).toBeInTheDocument();
      expect(list).toHaveClass('list-disc', 'ps-5', 'space-y-1');
    });
  });

  it('prefers events over highlights when both provided', () => {
    render(<SeasonHighlightsCard events={mockEvents} highlights={['Legacy Highlight']} />);
    expect(screen.getByText('Season Kickoff')).toBeInTheDocument();
    expect(screen.queryByText('Legacy Highlight')).not.toBeInTheDocument();
  });

  it('renders empty message when no events or highlights', () => {
    render(<SeasonHighlightsCard />);
    expect(screen.getByText(/Highlights coming soon./i)).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    render(<SeasonHighlightsCard emptyMessage="No highlights yet." />);
    expect(screen.getByText(/No highlights yet./i)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<SeasonHighlightsCard className="custom-class" />);
    const card = container.querySelector('[data-testid="section-card"]');
    expect(card).toHaveClass('custom-class');
  });
});
