import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SeasonCalendar } from '@/components/schedule/season-calendar';
import { mockEvent1, mockEvent2 } from '@/__tests__/fixtures/schedule';

const mockGroup1 = {
  key: '2026-05',
  label: 'May 2026',
  events: [mockEvent1, mockEvent2],
};

const mockGroup2 = {
  key: '2026-09',
  label: 'September 2026',
  events: [mockEvent1],
};

describe('SeasonCalendar', () => {
  it('renders with default title', () => {
    render(<SeasonCalendar groups={[mockGroup1]} />);
    expect(screen.getByText('Season Calendar')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<SeasonCalendar groups={[mockGroup1]} title="Custom Calendar" />);
    expect(screen.getByText('Custom Calendar')).toBeInTheDocument();
  });

  it('renders with default subtitle', () => {
    render(<SeasonCalendar groups={[mockGroup1]} />);
    expect(screen.getByText('Month-by-month snapshot of every key date')).toBeInTheDocument();
  });

  it('renders with custom subtitle', () => {
    render(<SeasonCalendar groups={[mockGroup1]} subtitle="Custom subtitle" />);
    expect(screen.getByText('Custom subtitle')).toBeInTheDocument();
  });

  it('renders empty message when no groups', () => {
    render(<SeasonCalendar groups={[]} />);
    expect(screen.getByText('Calendar coming soon.')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<SeasonCalendar groups={[]} emptyMessage="No events scheduled" />);
    expect(screen.getByText('No events scheduled')).toBeInTheDocument();
  });

  it('renders all groups', () => {
    render(<SeasonCalendar groups={[mockGroup1, mockGroup2]} />);
    expect(screen.getByText('May 2026')).toBeInTheDocument();
    expect(screen.getByText('September 2026')).toBeInTheDocument();
  });

  it('renders event count for each group', () => {
    render(<SeasonCalendar groups={[mockGroup1]} />);
    expect(screen.getByText('2 events')).toBeInTheDocument();
  });

  it('renders singular event count', () => {
    render(<SeasonCalendar groups={[mockGroup2]} />);
    expect(screen.getByText('1 event')).toBeInTheDocument();
  });

  it('renders events in each group', () => {
    render(<SeasonCalendar groups={[mockGroup1]} />);
    expect(screen.getByText('Championship Game')).toBeInTheDocument();
    expect(screen.getByText('Practice Session')).toBeInTheDocument();
  });

  it('renders event location when available', () => {
    render(<SeasonCalendar groups={[mockGroup1]} />);
    expect(screen.getByText(/Location: Field A/)).toBeInTheDocument();
  });

  it('renders event description when available', () => {
    render(<SeasonCalendar groups={[mockGroup1]} />);
    expect(screen.getByText('The big game')).toBeInTheDocument();
  });

  it('uses custom renderEvent when provided', () => {
    const customRender = (event: ScheduleEvent) => <div data-testid={`custom-${event.id}`}>Custom {event.title}</div>;
    render(<SeasonCalendar groups={[mockGroup1]} renderEvent={customRender} />);
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByText('Custom Championship Game')).toBeInTheDocument();
  });
});

