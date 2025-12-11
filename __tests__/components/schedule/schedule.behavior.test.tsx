import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SeasonCalendar } from '@/components/schedule/season-calendar'
import { ScheduleEventCard } from '@/components/schedule/event-card'
import { SeasonTimeline } from '@/components/schedule/season-timeline'
import { NextKeyDate } from '@/components/schedule/next-key-date'
import { mockEvent1, mockEvent2, mockEventWithTime } from '@/__tests__/fixtures/schedule'

describe('Schedule UI (behavior-focused)', () => {
  it('renders grouped events with default layout', () => {
    render(
      <SeasonCalendar
        groups={[
          {
            key: '2026-09',
            label: 'September 2026',
            events: [mockEvent1, mockEvent2],
          },
        ]}
      />,
    )

    expect(screen.getByText('September 2026')).toBeInTheDocument()
    expect(screen.getByText('Championship Game')).toBeInTheDocument()
    expect(screen.getByText('The big game')).toBeInTheDocument()
    expect(screen.getByText(/Location: Field A/)).toBeInTheDocument()
    expect(screen.getByText('Practice Session')).toBeInTheDocument()
  })

  it('supports custom event rendering in the calendar', () => {
    render(
      <SeasonCalendar
        groups={[
          {
            key: '2026-09',
            label: 'September 2026',
            events: [mockEvent1],
          },
        ]}
        renderEvent={(event) => <div data-testid={`custom-${event.id}`}>{event.title}</div>}
      />,
    )

    expect(screen.getByTestId('custom-1')).toBeInTheDocument()
    expect(screen.queryByText('Championship Game')).toBeInTheDocument()
  })

  it('shows highlight badge and respects showDescription/showLocation flags', () => {
    render(<ScheduleEventCard event={mockEvent2} highlightLabel="Featured" showDescription={false} showLocation={false} />)

    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.queryByText(mockEvent2.description!)).not.toBeInTheDocument()
    expect(screen.queryByText(/Practice Field/)).not.toBeInTheDocument()
  })

  it('renders timeline with outline on first event and empty fallback', () => {
    const empty = render(<SeasonTimeline events={[]} emptyMessage="No timeline" />)
    expect(empty.getByText('No timeline')).toBeInTheDocument()

    const { container } = render(<SeasonTimeline events={[mockEvent2, mockEvent1]} highlightLabel="Next Up" />)
    expect(screen.getByText('Practice Session')).toBeInTheDocument()
    // First event card gets the outline styles
    const outlined = container.querySelector('.ring-white\\/15')
    expect(outlined).toBeInTheDocument()
  })

  it('shows next key date with formatted range and handles missing event', () => {
    const { container } = render(<NextKeyDate event={mockEventWithTime} title="Upcoming" />)
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText('Game 1')).toBeInTheDocument()
    expect(screen.getByText(/May/)).toBeInTheDocument()

    const nullState = render(<NextKeyDate />)
    expect(nullState.container.firstChild).toBeNull()
  })
})
