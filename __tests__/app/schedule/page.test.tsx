import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, afterEach, vi } from 'vitest'
import SchedulePage from '@/app/schedule/page'
import * as directus from '@/lib/directus'
import { mockSchedule } from '@/__tests__/fixtures/schedule'

vi.mock('@/lib/directus', () => ({
  getSchedule: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

describe('SchedulePage (integration)', () => {
  const directusMock = vi.mocked(directus)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
    vi.clearAllMocks()
    directusMock.getSchedule.mockResolvedValue(mockSchedule)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not present past events as upcoming when the season has ended', async () => {
    // Every event in the fixture is before this date, matching the real CMS
    // state where a finished season is the only data on file.
    vi.setSystemTime(new Date('2030-01-01T00:00:00Z'))

    render(await SchedulePage())

    expect(screen.getByText(/Season events coming soon/i)).toBeInTheDocument()
    expect(screen.queryByText(/Next Key Date/i)).not.toBeInTheDocument()
  })

  it('renders schedule header, upcoming events, timeline, and calendar with real components', async () => {
    const page = await SchedulePage()
    render(page)

    expect(screen.getByRole('heading', { level: 1, name: /spring 2026 season/i })).toBeInTheDocument()
    expect(screen.getByText(/Season 2026/i)).toBeInTheDocument()
    expect(screen.getAllByText('Championship Game').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Practice Session').length).toBeGreaterThan(0)
    expect(screen.getByText(/Season Calendar/)).toBeInTheDocument()
  })

  it('does not render a Season Highlights section at all', async () => {
    // Two independent reviews agreed this block should be cut from /schedule
    // entirely, not just have its date bug fixed: it duplicates Up Next with
    // less detail (no day, no time, no badge) and serves neither of the two
    // tasks a parent has on this page. It stays on the homepage as a separate,
    // marketing-flavored component.
    render(await SchedulePage())

    expect(screen.queryByText(/Season Highlights/i)).not.toBeInTheDocument()
  })

  it('states the recurring practice pattern near the top', async () => {
    // The shared fixture's practice has no end_date and lands on a Sunday, so
    // it cannot express a pattern. Supply a regular weekly one instead.
    const practice = (date: string) => ({
      id: Number(date.slice(-2)), season_year: 2026, event_type: 'practice',
      title: 'Practice', date: `${date}T17:00:00`, end_date: `${date}T19:00:00`,
      location: 'Flick Park', description: null, highlight: true,
    })
    directusMock.getSchedule.mockResolvedValue({
      ...mockSchedule,
      events: [practice('2026-09-08'), practice('2026-09-15'), practice('2026-09-22')],
    } as any)
    vi.setSystemTime(new Date('2026-09-03T00:00:00Z'))

    render(await SchedulePage())

    expect(screen.getByText(/Practices are Tuesdays, 5:00 PM – 7:00 PM, at Flick Park/i)).toBeInTheDocument()
  })
})
