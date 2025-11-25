import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SeasonTimeline } from '@/components/schedule/season-timeline';
import { mockEventWithTime, mockEvent2 } from '@/__tests__/fixtures/schedule';

describe('SeasonTimeline', () => {
  it('renders with default title', () => {
    render(<SeasonTimeline events={[mockEventWithTime]} />);
    expect(screen.getByText('Season Timeline')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<SeasonTimeline events={[mockEventWithTime]} title="Custom Timeline" />);
    expect(screen.getByText('Custom Timeline')).toBeInTheDocument();
  });

  it('renders empty message when no events', () => {
    render(<SeasonTimeline events={[]} />);
    expect(screen.getByText('Timeline coming soon.')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<SeasonTimeline events={[]} emptyMessage="No events scheduled" />);
    expect(screen.getByText('No events scheduled')).toBeInTheDocument();
  });

  it('renders events in timeline', () => {
    render(<SeasonTimeline events={[mockEventWithTime, mockEvent2]} />);
    expect(screen.getByText('Game 1')).toBeInTheDocument();
    expect(screen.getByText('Practice Session')).toBeInTheDocument();
  });

  it('renders event cards for each event', () => {
    render(<SeasonTimeline events={[mockEventWithTime]} />);
    expect(screen.getByText('Game Day')).toBeInTheDocument();
    expect(screen.getByText('First game')).toBeInTheDocument();
  });

  it('applies outline to first event', () => {
    const { container } = render(<SeasonTimeline events={[mockEventWithTime, mockEvent2]} />);
    // First event should have outline via withOutline prop
    const cards = container.querySelectorAll('[class*="ring-1"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('uses custom renderEventCard when provided', () => {
    const customRender = (event: ScheduleEvent) => <div data-testid={`custom-${event.id}`}>Custom {event.title}</div>;
    render(<SeasonTimeline events={[mockEventWithTime]} renderEventCard={customRender} />);
    expect(screen.getByTestId('custom-3')).toBeInTheDocument();
    expect(screen.getByText('Custom Game 1')).toBeInTheDocument();
  });

  it('passes highlightLabel to event cards', () => {
    render(<SeasonTimeline events={[mockEvent2]} highlightLabel="Important" />);
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('renders formatted dates for events', () => {
    render(<SeasonTimeline events={[mockEventWithTime]} />);
    // formatDay and formatDateRange should be called
    expect(screen.getByText(/May/)).toBeInTheDocument();
  });
});

