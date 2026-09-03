import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { UpcomingEventsCard } from '@/components/schedule/upcoming-events-card'
import type { ScheduleEvent } from '@/lib/directus'

const practice = {
  id: 1, season_year: 2026, event_type: 'practice', title: 'Practice',
  date: '2026-09-08T17:00:00', end_date: '2026-09-08T19:00:00',
  location: 'Flick Park', description: null, highlight: true,
} as ScheduleEvent

describe('UpcomingEventsCard', () => {
  it('shows the time of day, not just the date', () => {
    // A parent checking whether practice clashes with another activity needs
    // the hours. Previously time appeared in only one component on the page.
    render(<UpcomingEventsCard events={[practice]} />)

    expect(screen.getByText(/5:00\s*PM\s*–\s*7:00\s*PM/i)).toBeInTheDocument()
  })

  it('still shows the empty message when there is nothing upcoming', () => {
    render(<UpcomingEventsCard events={[]} />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })
})
