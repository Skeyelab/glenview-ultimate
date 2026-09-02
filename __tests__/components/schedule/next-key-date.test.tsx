import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { NextKeyDate } from '@/components/schedule/next-key-date'
import type { ScheduleEvent } from '@/lib/directus'

function event(date: string): ScheduleEvent {
  return {
    id: 1, season_year: 2026, event_type: 'season_start', title: 'Pre-Registration Opens',
    date, end_date: null, location: null, description: null, highlight: true,
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
})
