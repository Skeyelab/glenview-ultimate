import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { NextKeyDate } from '@/components/schedule/next-key-date'
import type { ScheduleEvent } from '@/lib/directus'

function event(date: string): ScheduleEvent {
  return {
    id: 1, season_year: 2026, event_type: 'season_start', title: 'Pre-Registration Opens',
    date, end_date: new Date(new Date(date).getTime() + 2*3600e3).toISOString(), location: null, description: null, highlight: true,
  } as ScheduleEvent
}

const DAY = 86_400_000

describe('NextKeyDate', () => {
  it('renders nothing when given no event', () => {
    const { container } = render(<NextKeyDate />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders an upcoming event', () => {
    render(<NextKeyDate event={event(new Date(Date.now() + 7 * DAY).toISOString())} />)
    expect(screen.getByText('Pre-Registration Opens')).toBeInTheDocument()
  })

  it('renders nothing when the event has already passed', () => {
    const { container } = render(<NextKeyDate event={event(new Date(Date.now() - 30 * DAY).toISOString())} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the time and location, not just the date', () => {
    // This is the one box above the fold. Without time it cannot answer
    // "when is practice", which is the reason people open this page.
    render(<NextKeyDate event={{
      ...event(new Date(Date.now() + 3 * DAY).toISOString()),
      title: 'Practice',
      location: 'Flick Park',
    } as ScheduleEvent} />)

    expect(screen.getByText(/Flick Park/)).toBeInTheDocument()
    expect(screen.getByText(/\d{1,2}:\d{2}\s*(AM|PM)/i)).toBeInTheDocument()
  })
})
