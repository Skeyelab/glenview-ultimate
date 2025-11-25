import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  EventTypeBadge,
  KeyMomentBadge,
  getEventTypeLabel,
  listEventTypeLabels,
  EVENT_TYPE_LABELS,
} from '@/components/schedule/event-badge';
import type { ScheduleEventType, ScheduleEvent } from '@/lib/directus';

describe('EventTypeBadge', () => {
  const eventTypes: ScheduleEventType[] = [
    'season_start',
    'season_end',
    'registration_open',
    'registration_close',
    'game',
    'practice',
    'tournament',
    'other',
  ];

  it('renders all event type labels correctly', () => {
    eventTypes.forEach((type) => {
      const { unmount } = render(<EventTypeBadge type={type} />);
      expect(screen.getByText(EVENT_TYPE_LABELS[type])).toBeInTheDocument();
      unmount();
    });
  });

  it('applies correct styles for each event type', () => {
    const { container, unmount } = render(<EventTypeBadge type="season_start" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-emerald-500/20', 'text-emerald-100');
    unmount();

    const { container: container2 } = render(<EventTypeBadge type="game" />);
    const badge2 = container2.querySelector('span');
    expect(badge2).toHaveClass('bg-purple-500/20', 'text-purple-100');
  });

  it('renders with medium size by default', () => {
    const { container } = render(<EventTypeBadge type="game" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-xs');
  });

  it('renders with small size when specified', () => {
    const { container } = render(<EventTypeBadge type="game" size="sm" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-[0.65rem]');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<EventTypeBadge type="game" className="custom-class" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('custom-class');
  });

  it('has correct base badge classes', () => {
    const { container } = render(<EventTypeBadge type="practice" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'font-semibold', 'uppercase', 'tracking-wide');
  });
});

describe('KeyMomentBadge', () => {
  it('renders with default label', () => {
    render(<KeyMomentBadge />);
    expect(screen.getByText('Key Moment')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<KeyMomentBadge label="Important Event" />);
    expect(screen.getByText('Important Event')).toBeInTheDocument();
  });

  it('applies correct styles', () => {
    const { container } = render(<KeyMomentBadge />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('border-amber-300/70', 'text-amber-100');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<KeyMomentBadge className="custom-class" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('custom-class');
  });
});

describe('getEventTypeLabel', () => {
  it('returns correct label for each event type', () => {
    expect(getEventTypeLabel('season_start')).toBe('Season Start');
    expect(getEventTypeLabel('season_end')).toBe('Season Wrap');
    expect(getEventTypeLabel('registration_open')).toBe('Registration Opens');
    expect(getEventTypeLabel('registration_close')).toBe('Registration Deadline');
    expect(getEventTypeLabel('game')).toBe('Game Day');
    expect(getEventTypeLabel('practice')).toBe('Practice');
    expect(getEventTypeLabel('tournament')).toBe('Tournament');
    expect(getEventTypeLabel('other')).toBe('Event');
  });
});

describe('listEventTypeLabels', () => {
  it('returns unique labels from events', () => {
    const events: Array<{ event_type: ScheduleEventType }> = [
      { event_type: 'game' },
      { event_type: 'practice' },
      { event_type: 'game' }, // duplicate
      { event_type: 'tournament' },
    ];
    const labels = listEventTypeLabels(events);
    expect(labels).toEqual(['Game Day', 'Practice', 'Tournament']);
    expect(labels).toHaveLength(3);
  });

  it('returns empty array for empty input', () => {
    const labels = listEventTypeLabels([]);
    expect(labels).toEqual([]);
  });

  it('handles single event', () => {
    const events: Array<{ event_type: ScheduleEventType }> = [{ event_type: 'game' }];
    const labels = listEventTypeLabels(events);
    expect(labels).toEqual(['Game Day']);
  });

  it('handles all event types', () => {
    const events: Array<{ event_type: ScheduleEventType }> = [
      { event_type: 'season_start' },
      { event_type: 'season_end' },
      { event_type: 'registration_open' },
      { event_type: 'registration_close' },
      { event_type: 'game' },
      { event_type: 'practice' },
      { event_type: 'tournament' },
      { event_type: 'other' },
    ];
    const labels = listEventTypeLabels(events);
    expect(labels).toHaveLength(8);
    expect(labels).toContain('Season Start');
    expect(labels).toContain('Game Day');
  });
});
