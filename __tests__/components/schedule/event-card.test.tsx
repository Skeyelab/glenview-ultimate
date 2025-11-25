import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { ScheduleEventCard } from '@/components/schedule/event-card';
import type { ScheduleEvent } from '@/lib/directus';

// Mock event-badge
vi.mock('@/components/schedule/event-badge', () => ({
  EventTypeBadge: ({ type }: { type: string }) => <span data-testid={`badge-${type}`}>Badge: {type}</span>,
  KeyMomentBadge: ({ label }: { label?: string }) => <span data-testid="key-moment-badge">{label || 'Key Moment'}</span>,
}));

describe('ScheduleEventCard', () => {
  const mockEvent: ScheduleEvent = {
    id: 1,
    season_year: 2024,
    event_type: 'game',
    title: 'Championship Game',
    date: '2024-06-15',
    end_date: null,
    location: 'Main Field',
    description: 'Final game of the season',
    highlight: false,
  };

  const mockHighlightEvent: ScheduleEvent = {
    ...mockEvent,
    highlight: true,
  };

  it('renders event title', () => {
    render(<ScheduleEventCard event={mockEvent} />);
    expect(screen.getByText('Championship Game')).toBeInTheDocument();
  });

  it('renders event type badge', () => {
    render(<ScheduleEventCard event={mockEvent} />);
    expect(screen.getByTestId('badge-game')).toBeInTheDocument();
  });

  it('renders highlight badge when event is highlighted', () => {
    render(<ScheduleEventCard event={mockHighlightEvent} />);
    expect(screen.getByTestId('key-moment-badge')).toBeInTheDocument();
  });

  it('does not render highlight badge when event is not highlighted', () => {
    render(<ScheduleEventCard event={mockEvent} />);
    expect(screen.queryByTestId('key-moment-badge')).not.toBeInTheDocument();
  });

  it('renders description when showDescription is true and description exists', () => {
    render(<ScheduleEventCard event={mockEvent} showDescription />);
    expect(screen.getByText('Final game of the season')).toBeInTheDocument();
  });

  it('does not render description when showDescription is false', () => {
    render(<ScheduleEventCard event={mockEvent} showDescription={false} />);
    expect(screen.queryByText('Final game of the season')).not.toBeInTheDocument();
  });

  it('renders location when showLocation is true and location exists', () => {
    render(<ScheduleEventCard event={mockEvent} showLocation />);
    expect(screen.getByText(/Location: Main Field/i)).toBeInTheDocument();
  });

  it('does not render location when showLocation is false', () => {
    render(<ScheduleEventCard event={mockEvent} showLocation={false} />);
    expect(screen.queryByText(/Location:/i)).not.toBeInTheDocument();
  });

  it('renders with default size', () => {
    const { container } = render(<ScheduleEventCard event={mockEvent} />);
    const title = screen.getByText('Championship Game');
    expect(title).toHaveClass('text-lg', 'font-semibold');
  });

  it('renders with compact size', () => {
    render(<ScheduleEventCard event={mockEvent} size="compact" />);
    const title = screen.getByText('Championship Game');
    expect(title).toHaveClass('text-sm', 'font-semibold');
  });

  it('uses small badge size for compact cards', () => {
    render(<ScheduleEventCard event={mockEvent} size="compact" />);
    // Badge size is passed to EventTypeBadge, which we mock
    // We can verify the card renders correctly
    expect(screen.getByTestId('badge-game')).toBeInTheDocument();
  });

  it('applies withOutline class when withOutline is true', () => {
    const { container } = render(<ScheduleEventCard event={mockEvent} withOutline />);
    const card = container.querySelector('.rounded-lg');
    expect(card).toHaveClass('ring-1', 'ring-white/15');
  });

  it('does not apply outline when withOutline is false', () => {
    const { container } = render(<ScheduleEventCard event={mockEvent} withOutline={false} />);
    const card = container.querySelector('.rounded-lg');
    expect(card).not.toHaveClass('ring-1', 'ring-white/15');
  });

  it('renders custom footer when provided', () => {
    render(<ScheduleEventCard event={mockEvent} footer={<div data-testid="custom-footer">Custom Footer</div>} />);
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('renders custom meta when provided', () => {
    render(<ScheduleEventCard event={mockEvent} meta={<div data-testid="custom-meta">Custom Meta</div>} />);
    expect(screen.getByTestId('custom-meta')).toBeInTheDocument();
  });

  it('uses custom title element when provided', () => {
    render(<ScheduleEventCard event={mockEvent} titleAs="h2" />);
    const title = screen.getByText('Championship Game');
    expect(title.tagName).toBe('H2');
  });

  it('defaults to h3 for title', () => {
    render(<ScheduleEventCard event={mockEvent} />);
    const title = screen.getByText('Championship Game');
    expect(title.tagName).toBe('H3');
  });

  it('renders custom highlight label', () => {
    render(<ScheduleEventCard event={mockHighlightEvent} highlightLabel="Important" />);
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('handles event without description', () => {
    const eventWithoutDescription: ScheduleEvent = {
      ...mockEvent,
      description: null,
    };
    render(<ScheduleEventCard event={eventWithoutDescription} />);
    expect(screen.queryByText('Final game of the season')).not.toBeInTheDocument();
  });

  it('handles event without location', () => {
    const eventWithoutLocation: ScheduleEvent = {
      ...mockEvent,
      location: null,
    };
    render(<ScheduleEventCard event={eventWithoutLocation} />);
    expect(screen.queryByText(/Location:/i)).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<ScheduleEventCard event={mockEvent} className="custom-class" />);
    const card = container.querySelector('.rounded-lg');
    expect(card).toHaveClass('custom-class');
  });

  it('shows description by default when description exists', () => {
    render(<ScheduleEventCard event={mockEvent} />);
    expect(screen.getByText('Final game of the season')).toBeInTheDocument();
  });

  it('shows location by default when location exists', () => {
    render(<ScheduleEventCard event={mockEvent} />);
    expect(screen.getByText(/Location: Main Field/i)).toBeInTheDocument();
  });
});
