import { describe, it, expect } from 'vitest'
import { describePracticePattern } from '@/lib/schedule-utils'
import type { ScheduleEvent } from '@/lib/directus'

const practice = (date: string, end: string, location = 'Flick Park'): ScheduleEvent => ({
  id: Math.random(), season_year: 2026, event_type: 'practice', title: 'Practice',
  date, end_date: end, location, description: null, highlight: true,
} as ScheduleEvent)

describe('describePracticePattern', () => {
  it('summarises a regular weekly practice in one line', () => {
    // All 8 upcoming practices are Tuesday 5-7pm at Flick Park. One sentence
    // answers the question the page exists for, without scanning a list.
    const events = [
      practice('2026-09-08T17:00:00', '2026-09-08T19:00:00'),
      practice('2026-09-15T17:00:00', '2026-09-15T19:00:00'),
      practice('2026-09-22T17:00:00', '2026-09-22T19:00:00'),
    ]

    expect(describePracticePattern(events)).toBe('Practices are Tuesdays, 5:00 PM – 7:00 PM, at Flick Park')
  })

  it('returns null when practices vary, rather than stating something false', () => {
    const events = [
      practice('2026-09-08T17:00:00', '2026-09-08T19:00:00'),
      practice('2026-09-12T10:00:00', '2026-09-12T12:00:00', 'Richardson Park'),
    ]

    expect(describePracticePattern(events)).toBeNull()
  })

  it('ignores non-practice events when judging the pattern', () => {
    const events = [
      practice('2026-09-08T17:00:00', '2026-09-08T19:00:00'),
      { ...practice('2026-09-13T09:00:00', '2026-09-13T14:00:00', 'Oak Park'), event_type: 'tournament' } as ScheduleEvent,
    ]

    expect(describePracticePattern(events)).toBe('Practices are Tuesdays, 5:00 PM – 7:00 PM, at Flick Park')
  })

  it('returns null when there are no practices at all', () => {
    expect(describePracticePattern([])).toBeNull()
  })
})
