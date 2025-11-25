import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { NextKeyDate } from '@/components/schedule/next-key-date';
import type { ScheduleEvent } from '@/lib/directus';

// Mock date-utils
vi.mock('@/lib/date-utils', () => ({
  formatDateRange: vi.fn((event: ScheduleEvent) => {
    if (event.end_date) {
      return `June 15 - June 20, 2024`;
    }
    return `June 15, 2024`;
  }),
}));

describe('NextKeyDate', () => {
  const mockEvent: ScheduleEvent = {
    id: 1,
    season_year: 2024,
    event_type: 'registration_open',
    title: 'Registration Opens',
    date: '2024-06-15',
    end_date: null,
    location: null,
    description: null,
    highlight: true,
  };

  const mockEventWithEndDate: ScheduleEvent = {
    ...mockEvent,
    end_date: '2024-06-20',
  };

  it('returns null when no event is provided', () => {
    const { container } = render(<NextKeyDate />);
    expect(container.firstChild).toBeNull();
  });

  it('renders event title when event is provided', () => {
    render(<NextKeyDate event={mockEvent} />);
    expect(screen.getByText('Registration Opens')).toBeInTheDocument();
  });

  it('renders formatted date range', () => {
    render(<NextKeyDate event={mockEvent} />);
    expect(screen.getByText('June 15, 2024')).toBeInTheDocument();
  });

  it('renders formatted date range with end date', () => {
    render(<NextKeyDate event={mockEventWithEndDate} />);
    expect(screen.getByText('June 15 - June 20, 2024')).toBeInTheDocument();
  });

  it('renders with default title', () => {
    render(<NextKeyDate event={mockEvent} />);
    expect(screen.getByText('Next Key Date')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<NextKeyDate event={mockEvent} title="Upcoming Event" />);
    expect(screen.getByText('Upcoming Event')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<NextKeyDate event={mockEvent} className="custom-class" />);
    const notice = container.querySelector('.notice');
    expect(notice).toHaveClass('custom-class');
  });

  it('has correct structure with notice class', () => {
    const { container } = render(<NextKeyDate event={mockEvent} />);
    const notice = container.querySelector('.notice');
    expect(notice).toBeInTheDocument();
    expect(notice?.querySelector('p')).toBeInTheDocument();
  });
});
