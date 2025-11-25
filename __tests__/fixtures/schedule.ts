import type { ScheduleEvent, SeasonSchedule } from '@/lib/directus';

export const mockEvent1: ScheduleEvent = {
  id: 1,
  season_year: 2026,
  event_type: 'game',
  title: 'Championship Game',
  date: '2026-09-15',
  end_date: null,
  location: 'Field A',
  description: 'The big game',
  highlight: false,
};

export const mockEvent2: ScheduleEvent = {
  id: 2,
  season_year: 2026,
  event_type: 'practice',
  title: 'Practice Session',
  date: '2026-09-20',
  end_date: null,
  location: 'Practice Field',
  description: 'Regular practice session',
  highlight: true,
};

export const mockEventWithTime: ScheduleEvent = {
  id: 3,
  season_year: 2026,
  event_type: 'game',
  title: 'Game 1',
  date: '2026-05-15T10:00:00Z',
  end_date: '2026-05-15T16:00:00Z',
  location: 'Field A',
  description: 'First game',
  highlight: false,
};

export const mockSchedule: SeasonSchedule = {
  season_year: 2026,
  year: 2026,
  title: 'Spring 2026 Season',
  start_month: 'March',
  end_month: 'October',
  highlights: ['Highlight 1', 'Highlight 2'],
  events: [mockEvent1, mockEvent2],
};
