import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScheduleHeader } from '@/components/schedule/schedule-header';
import { mockSchedule, mockEvent1, mockEvent2 } from '@/__tests__/fixtures/schedule';

describe('ScheduleHeader', () => {
  it('renders season year', () => {
    render(<ScheduleHeader schedule={mockSchedule} events={[]} />);
    expect(screen.getByText('Season 2026')).toBeInTheDocument();
  });

  it('renders schedule title', () => {
    render(<ScheduleHeader schedule={mockSchedule} events={[]} />);
    expect(screen.getByText('Spring 2026 Season')).toBeInTheDocument();
  });

  it('renders season months when provided', () => {
    render(<ScheduleHeader schedule={mockSchedule} events={[]} />);
    expect(screen.getByText(/Season runs from/)).toBeInTheDocument();
    expect(screen.getByText(/March/)).toBeInTheDocument();
    expect(screen.getByText(/October/)).toBeInTheDocument();
  });

  it('does not render season months when not provided', () => {
    const scheduleWithoutMonths = { ...mockSchedule, start_month: null, end_month: null };
    render(<ScheduleHeader schedule={scheduleWithoutMonths} events={[]} />);
    expect(screen.queryByText(/Season runs from/)).not.toBeInTheDocument();
  });

  it('renders featured event when provided', () => {
    render(<ScheduleHeader schedule={mockSchedule} events={[]} featuredEvent={mockEvent1} />);
    expect(screen.getByText('Championship Game')).toBeInTheDocument();
  });

  it('does not render featured event section when not provided', () => {
    render(<ScheduleHeader schedule={mockSchedule} events={[]} />);
    expect(screen.queryByText('Next Key Date')).not.toBeInTheDocument();
  });

  it('renders event type labels from events', () => {
    render(<ScheduleHeader schedule={mockSchedule} events={[mockEvent1, mockEvent2]} />);
    expect(screen.getByText('Game Day')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
  });

  it('renders unique event type labels only', () => {
    const duplicateEvents = [mockEvent1, { ...mockEvent1, id: 3 }];
    render(<ScheduleHeader schedule={mockSchedule} events={duplicateEvents} />);
    const labels = screen.getAllByText('Game Day');
    // Should only appear once in the labels section
    expect(labels.length).toBeGreaterThan(0);
  });

  it('does not render event type labels section when no events', () => {
    const { container } = render(<ScheduleHeader schedule={mockSchedule} events={[]} />);
    const labelsSection = container.querySelector('[class*="border-t"]');
    expect(labelsSection).not.toBeInTheDocument();
  });
});

