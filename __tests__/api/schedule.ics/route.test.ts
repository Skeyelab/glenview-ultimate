import { beforeEach, vi } from 'vitest'

vi.mock('@/lib/directus', () => ({
  getSchedule: vi.fn(),
}))

// eslint-disable-next-line import/first
import * as directus from '@/lib/directus'
// eslint-disable-next-line import/first
import { GET } from '@/app/schedule.ics/route'

describe('GET /schedule.ics', () => {
  const directusMock = vi.mocked(directus)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-03T00:00:00Z'))
    vi.clearAllMocks()
  })

  it('serves a calendar feed of only upcoming events, as text/calendar', async () => {
    directusMock.getSchedule.mockResolvedValue({
      season_year: 2026, year: 2026, title: 'Fall 2026', start_month: 'September', end_month: 'October',
      highlights: [],
      events: [
        { id: 1, season_year: 2026, event_type: 'practice', title: 'Old Practice', date: '2020-01-01T17:00:00', end_date: '2020-01-01T19:00:00', location: 'Richardson Park', description: null, highlight: false },
        { id: 2, season_year: 2026, event_type: 'practice', title: 'Fall Practice', date: '2026-09-08T17:00:00', end_date: '2026-09-08T19:00:00', location: 'Flick Park', description: null, highlight: true },
      ],
    })

    const response = await GET()
    const body = await response.text()

    expect(response.headers.get('content-type')).toContain('text/calendar')
    expect(body).toContain('SUMMARY:Fall Practice')
    expect(body).not.toContain('Old Practice')
  })
})
