import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpcomingEventsCard } from '@/components/schedule/upcoming-events-card';
import { mockEvent1, mockEvent2 } from '@/__tests__/fixtures/schedule';

describe('UpcomingEventsCard', () => {
  it('renders with default title', () => {
    render(<UpcomingEventsCard events={[mockEvent1]} />);
    expect(screen.getByText('Up Next')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<UpcomingEventsCard events={[mockEvent1]} title="Next Events" />);
    expect(screen.getByText('Next Events')).toBeInTheDocument();
  });

  it('renders empty message when no events', () => {
    render(<UpcomingEventsCard events={[]} />);
    expect(screen.getByText('Season events coming soon.')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<UpcomingEventsCard events={[]} emptyMessage="No upcoming events" />);
    expect(screen.getByText('No upcoming events')).toBeInTheDocument();
  });

  it('renders all events', () => {
    render(<UpcomingEventsCard events={[mockEvent1, mockEvent2]} />);
    expect(screen.getByText('Championship Game')).toBeInTheDocument();
    expect(screen.getByText('Practice Session')).toBeInTheDocument();
  });

  it('renders event cards with location', () => {
    render(<UpcomingEventsCard events={[mockEvent1]} />);
    expect(screen.getByText(/Location: Field A/)).toBeInTheDocument();
  });

  it('does not render description by default', () => {
    render(<UpcomingEventsCard events={[mockEvent1]} />);
    expect(screen.queryByText('Game description')).not.toBeInTheDocument();
  });

  it('renders formatted date range for events', () => {
    render(<UpcomingEventsCard events={[mockEvent1]} />);
    // formatDateRange should format the date
    expect(screen.getByText(/Sep/)).toBeInTheDocument();
  });

  it('renders highlight badge when event has highlight', () => {
    render(<UpcomingEventsCard events={[mockEvent2]} />);
    expect(screen.getByText('Key Moment')).toBeInTheDocument();
  });

  it('uses custom renderEventCard when provided', () => {
    const customRender = (event: ScheduleEvent) => <div data-testid={`custom-${event.id}`}>Custom {event.title}</div>;
    render(<UpcomingEventsCard events={[mockEvent1]} renderEventCard={customRender} />);
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByText('Custom Championship Game')).toBeInTheDocument();
  });

  it('passes highlightLabel to event cards', () => {
    render(<UpcomingEventsCard events={[mockEvent2]} highlightLabel="Important" />);
    expect(screen.getByText('Important')).toBeInTheDocument();
  });
});

